/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA CONCURRENCY RUNTIME - Inti Aktor (Actor Core Implementation)
 * Target Milestone: Phase 46 (v0.46.0)
 *
 * Mengenkapsulasi state terisolasi, mailbox, siklus hidup, dan penanganan pesan.
 */

import { ActorStatus, validasiTransisiStatus } from './lifecycle';
import { Mailbox, MailboxOptions } from './mailbox';
import { Message, MessageType, buatPesan } from './message';
import { ActorRef, SendOptions } from './actor-ref';
import { ActorContext } from './actor-context';
import { SupervisorDirective, SupervisorStrategy } from './actor-supervisor';
import { CancellationTokenSource } from '../async/cancellation';
import { ActorTerminatedError, ConcurrencyError, ConcurrencyErrorCode } from './errors';
import { withTimeout } from '../async/timeout';

export type ActorBehavior<TState, TMsg> = (
  state: TState,
  message: Message<TMsg>,
  ctx: ActorContext
) => Promise<TState> | TState;

export interface ActorOptions<TState, TMsg> {
  id?: string;
  name?: string;
  initialState: TState;
  behavior: ActorBehavior<TState, TMsg>;
  mailboxOptions?: MailboxOptions;
  supervisor?: SupervisorStrategy;
  parent?: any;
}

export class Actor<TState = unknown, TMsg = unknown> {
  public readonly id: string;
  public readonly name: string;
  public readonly path: string;
  public readonly mailbox: Mailbox;

  private _status: ActorStatus = ActorStatus.CREATED;
  private state: TState;
  private readonly initialState: TState;
  private readonly behavior: ActorBehavior<TState, TMsg>;
  private readonly supervisor: SupervisorStrategy;
  private readonly system: any;
  private readonly parent?: Actor<any, any>;

  private readonly cts = new CancellationTokenSource();
  private currentMsg?: Message<TMsg>;
  private lastActiveTimestamp: number = Date.now();
  private lastError?: Error;

  // Ask-reply pendings: messageId -> resolver
  private pendingReplies = new Map<string, (response: any) => void>();
  private dynamicHandler?: (msg: Message<any>) => void | Promise<void>;

  constructor(systemOrName: any, optionsOrRegistry?: any, extraOptions?: any) {
    if (typeof systemOrName === 'string') {
      // Signature: new Actor('nama', registry, extraOptions)
      const name = systemOrName;
      this.name = name;
      this.id = `actor_${name}_${Math.random().toString(36).substring(2, 7)}`;
      this.path = `/user/${this.name}`;
      this.initialState = (extraOptions?.initialState ?? null) as TState;
      this.state = this.initialState;
      this.behavior = extraOptions?.behavior ?? (async (_s, _m) => _s);
      this.mailbox = new Mailbox(this.id, extraOptions?.mailboxOptions);
      this.supervisor = extraOptions?.strategy instanceof SupervisorStrategy ? extraOptions.strategy : (extraOptions?.supervisor ?? new SupervisorStrategy());
      this.system = {
        registry: optionsOrRegistry,
        scheduler: { schedule: () => {} },
        publishDeadLetter: () => {},
        registerAskWait: () => {},
        completeAskWait: () => {},
        getActorRef: () => undefined,
      };
      if (optionsOrRegistry && typeof optionsOrRegistry.register === 'function') {
        optionsOrRegistry.register(this);
      }
    } else {
      const options = (optionsOrRegistry ?? {}) as ActorOptions<TState, TMsg>;
      this.system = systemOrName;
      this.id = options.id ?? `actor_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      this.name = options.name ?? this.id;
      this.path = options.parent ? `${options.parent.path}/${this.name}` : `/user/${this.name}`;
      this.initialState = options.initialState;
      this.state = options.initialState;
      this.behavior = options.behavior;
      this.mailbox = new Mailbox(this.id, options.mailboxOptions);
      this.supervisor = options.supervisor ?? new SupervisorStrategy();
      this.parent = options.parent;
    }

    this.setStatus(ActorStatus.RUNNING);
  }

  public get status(): ActorStatus {
    return this._status;
  }

  public get ref(): ActorRef {
    const actor = this;
    return {
      id: actor.id,
      name: actor.name,
      path: actor.path,
      send: (payload: any, opts?: SendOptions) => actor.send(payload, opts),
      ask: (payload: any, timeoutMs?: number) => actor.ask(payload, timeoutMs),
      stop: () => actor.stop(),
    };
  }

  public get context(): ActorContext {
    const actor = this;
    return {
      self: actor.ref,
      sender: actor.currentMsg?.senderId ? actor.system.getActorRef(actor.currentMsg.senderId) : undefined,
      currentMessage: actor.currentMsg,
      status: actor._status,
      cancellationToken: actor.cts.token,
      forward: async (target: ActorRef) => {
        if (!actor.currentMsg) return false;
        return target.send(actor.currentMsg.payload, {
          sender: actor.currentMsg.senderId ? actor.system.getActorRef(actor.currentMsg.senderId) : undefined,
        });
      },
      spawn: (opts: any) => actor.system.spawn({ ...opts, parent: actor }),
      stop: async (target?: ActorRef) => {
        if (!target || target.id === actor.id) {
          await actor.stop();
        } else {
          await target.stop();
        }
      },
    };
  }

  public isRunnable(): boolean {
    return this._status === ActorStatus.RUNNING || this._status === ActorStatus.STOPPING;
  }

  public hasPendingMessages(): boolean {
    return !this.mailbox.isEmpty;
  }

  public getLastActiveTimestamp(): number {
    return this.lastActiveTimestamp;
  }

  public getLastError(): Error | undefined {
    return this.lastError;
  }

  /**
   * Mengirim pesan ke mailbox aktor ini.
   */
  public async send(payload: any, options: SendOptions = {}): Promise<boolean> {
    if (this._status === ActorStatus.STOPPED || this._status === ActorStatus.FAILED) {
      throw new ActorTerminatedError(this.id, this._status);
    }

    const type = payload?.type === MessageType.STOP ? MessageType.STOP : MessageType.USER;
    const msg = buatPesan(type, this.id, payload, options.sender?.id);

    const enqueued = await this.mailbox.enqueue(msg);
    if (enqueued && this.isRunnable()) {
      this.system.scheduler.schedule(this);
    }
    return enqueued;
  }

  /**
   * Mengirim pesan dan menunggu balasan (Ask Pattern).
   */
  public async ask<TReq, TRes>(payload: TReq, timeoutMs: number = 5000): Promise<TRes> {
    const replyMsgPromise = new Promise<TRes>((resolve, reject) => {
      // Buat temporary pseudo-inbox untuk menerima balasan
      const correlationId = `corr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const tempSenderId = `ask_${correlationId}`;

      const askMsg = buatPesan(
        MessageType.USER,
        this.id,
        payload,
        tempSenderId,
        undefined,
        { replyExpected: true, correlationId }
      );

      this.system.registerAskWait(correlationId, (reply: any) => {
        resolve(reply);
      });

      this.mailbox
        .enqueue(askMsg)
        .then((enqueued) => {
          if (enqueued && this.isRunnable()) {
            this.system.scheduler.schedule(this);
          }
        })
        .catch(reject);
    });

    return withTimeout(replyMsgPromise, timeoutMs, `ask_ke_${this.name}`);
  }

  /**
   * Memproses tepat satu pesan dari mailbox (dieksekusi oleh scheduler).
   */
  public async processOneMessage(): Promise<void> {
    const msg = this.mailbox.dequeue();
    if (!msg) return;

    this.currentMsg = msg as Message<TMsg>;
    this.lastActiveTimestamp = Date.now();

    // Penanganan pesan sistem bawaan
    if (msg.type === MessageType.STOP) {
      await this.terminate();
      return;
    }

    try {
      this.cts.token.throwIfCancelled();
      if (this.dynamicHandler) {
        await this.dynamicHandler(this.currentMsg);
      }
      const newState = await this.behavior(this.state, this.currentMsg, this.context);
      this.state = newState;

      // Jika pesan memerlukan reply otomatis dan handler mengembalikan hasil
      if (msg.metadata?.replyExpected && msg.metadata?.correlationId) {
        this.system.completeAskWait(msg.metadata.correlationId as string, newState);
      }
    } catch (err: any) {
      this.lastError = err instanceof Error ? err : new Error(String(err));
      await this.handleProcessingError(this.lastError);
    } finally {
      this.currentMsg = undefined;
    }
  }

  private async handleProcessingError(error: Error): Promise<void> {
    const directive = this.supervisor.handleFailure(this.id, error);

    switch (directive) {
      case SupervisorDirective.RESUME:
        // Lanjutkan tanpa mengubah state saat ini
        break;

      case SupervisorDirective.RESTART:
        // Reset state ke kondisi awal, buang pesan yang menyebabkan galat
        this.state = this.initialState;
        this.setStatus(ActorStatus.RUNNING);
        break;

      case SupervisorDirective.STOP:
        this.setStatus(ActorStatus.FAILED);
        await this.terminate();
        break;

      case SupervisorDirective.ESCALATE:
        this.setStatus(ActorStatus.FAILED);
        if (this.parent) {
          await this.parent.handleProcessingError(error);
        } else {
          this.system.handleRootError(this.id, error);
        }
        break;
    }
  }

  /**
   * Menghentikan aktor secara aman.
   */
  public async stop(): Promise<void> {
    if (this._status === ActorStatus.STOPPED || this._status === ActorStatus.STOPPING) {
      return;
    }
    this.setStatus(ActorStatus.STOPPING);
    // Masukkan STOP message dengan prioritas
    const stopMsg = buatPesan(MessageType.STOP, this.id, null);
    await this.mailbox.enqueue(stopMsg);
    this.system.scheduler.schedule(this);
  }

  private async terminate(): Promise<void> {
    if (this._status !== ActorStatus.STOPPING) {
      this.setStatus(ActorStatus.STOPPING);
    }
    this.setStatus(ActorStatus.STOPPED);
    this.cts.cancel('Aktor dihentikan.');
    // Bersihkan sisa pesan ke dead letters
    const unread = this.mailbox.clear();
    for (const msg of unread) {
      this.system.publishDeadLetter(msg, `Aktor ${this.id} berhenti sebelum memproses pesan.`);
    }
    this.system.registry.unregister(this.id);
  }

  private setStatus(newStatus: ActorStatus): void {
    if (validasiTransisiStatus(this._status, newStatus)) {
      this._status = newStatus;
    } else {
      throw new ConcurrencyError(
        ConcurrencyErrorCode.TRANSISI_STATUS_ILEGAL,
        `Transisi status tidak sah dari ${this._status} ke ${newStatus} untuk aktor '${this.id}'.`
      );
    }
  }

  /**
   * Menginspeksi state internal (hanya untuk testing & diagnostik runtime).
   */
  public getState(): TState {
    return this.state;
  }

  // Indonesian Aliases
  public aturPenangan(fn: (msg: Message<any>) => void | Promise<void>): void {
    this.dynamicHandler = fn;
  }

  public terimaPesan(msg: Message<any>): Promise<boolean> {
    return this.mailbox.enqueue(msg);
  }

  public dapatkanId(): string {
    return this.id;
  }

  public dapatkanNama(): string {
    return this.name;
  }

  public dapatkanStatus(): ActorStatus {
    return this.status;
  }

  public dapatkanMailbox(): Mailbox {
    return this.mailbox;
  }

  public dapatkanJumlahPesanDiproses(): number {
    return this.mailbox.getMetrics().totalProcessed;
  }

  public dapatkanJumlahKegagalan(): number {
    return this.lastError ? 1 : 0;
  }

  public hentikan(): Promise<void> {
    return this.terminate();
  }

  public prosesPesanBerikutnya(): Promise<void> {
    return this.processOneMessage();
  }

  public transisiStatus(s: ActorStatus): void {
    this.setStatus(s);
  }
}
