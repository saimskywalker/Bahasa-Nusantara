/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA CONCURRENCY RUNTIME - Sistem Aktor Terpadu (Actor System)
 * Target Milestone: Phase 46 (v0.46.0)
 *
 * Mengoordinasikan seluruh siklus hidup aktor, scheduler, registri, dan sumber daya.
 */

import { ActorRegistry } from './actor-registry';
import { ConcurrencyScheduler, SchedulerOptions } from './scheduler';
import { ResourceManager, ResourceLimits } from '../concurrency/resource-manager';
import { Actor, ActorOptions } from './actor';
import { ActorRef, SendOptions } from './actor-ref';
import { ActorNotFoundError, ActorTerminatedError } from './errors';
import { buatPesan, Message, MessageType } from './message';
import { ConcurrencyDiagnostics, SystemDiagnosticReport } from '../concurrency/diagnostics';

export interface ActorSystemOptions {
  name?: string;
  scheduler?: SchedulerOptions;
  limits?: ResourceLimits;
  maxActors?: number;
  workerCount?: number;
  throughputBudget?: number;
}

export interface DeadLetter {
  message: Message;
  reason: string;
  timestamp: number;
}

export class ActorSystem {
  public readonly name: string;
  public readonly registry: ActorRegistry;
  public readonly scheduler: ConcurrencyScheduler;
  public readonly resourceManager: ResourceManager;

  private deadLetters: DeadLetter[] = [];
  private askWaiters = new Map<string, (response: any) => void>();
  private isShuttingDown = false;

  private static defaultInstance?: ActorSystem;

  public static dapatkanInstance(): ActorSystem {
    if (!this.defaultInstance) {
      this.defaultInstance = new ActorSystem();
    }
    return this.defaultInstance;
  }

  public static getInstance(): ActorSystem {
    return this.dapatkanInstance();
  }

  constructor(options: ActorSystemOptions = {}) {
    this.name = options.name ?? 'nusantara-actor-system';
    this.registry = new ActorRegistry();
    this.scheduler = new ConcurrencyScheduler(options.scheduler);
    this.resourceManager = new ResourceManager(options.limits);
  }

  /**
   * Membuat dan mendaftarkan aktor baru dalam sistem.
   */
  public spawn<TState = unknown, TMsg = unknown>(
    optionsOrName: ActorOptions<TState, TMsg> | string,
    handlerOrInitState?: any
  ): ActorRef {
    if (this.isShuttingDown) {
      throw new Error(`ActorSystem '${this.name}' sedang dalam proses penghentian.`);
    }

    let actorOptions: ActorOptions<any, any>;
    if (typeof optionsOrName === 'string') {
      const name = optionsOrName;
      const fn = handlerOrInitState;
      let userReceiveHandler: ((msg: Message<any>) => any) | undefined;
      const fakeCtx = {
        receive: (cb: (msg: Message<any>) => any) => {
          userReceiveHandler = cb;
        },
      };
      if (typeof fn === 'function') {
        fn(fakeCtx);
      }
      actorOptions = {
        name,
        initialState: null,
        behavior: async (state, msg, ctx) => {
          if (userReceiveHandler) {
            const res = await userReceiveHandler(msg);
            if (res !== undefined) return res;
          }
          return state;
        },
      };
    } else {
      actorOptions = optionsOrName;
    }

    this.resourceManager.acquireActorSlot();
    const actor = new Actor<any, any>(this, actorOptions);
    this.registry.register(actor);
    return actor.ref;
  }

  /**
   * Mengambil referensi aktor berdasarkan ID atau nama alias.
   */
  public getActorRef(idOrName: string): ActorRef | undefined {
    const actor = this.registry.getById(idOrName) ?? this.registry.getByName(idOrName);
    return actor ? actor.ref : undefined;
  }

  /**
   * Mengirim pesan ke aktor target via ID atau ActorRef (Tell Pattern).
   */
  public async send(
    target: string | ActorRef,
    payload: any,
    options?: SendOptions
  ): Promise<boolean> {
    const ref = typeof target === 'string' ? this.getActorRef(target) : target;
    if (!ref) {
      const targetId = typeof target === 'string' ? target : 'unknown';
      this.publishDeadLetter(buatPesan(MessageType.USER, targetId, payload), `Aktor '${targetId}' tidak ditemukan.`);
      return false;
    }
    try {
      return await ref.send(payload, options);
    } catch (err: any) {
      if (err instanceof ActorTerminatedError) {
        this.publishDeadLetter(buatPesan(MessageType.USER, ref.id, payload), err.message);
        return false;
      }
      throw err;
    }
  }

  /**
   * Mengirim pesan dan meminta balasan dari aktor target (Ask Pattern).
   */
  public async ask<TReq = unknown, TRes = unknown>(
    target: string | ActorRef,
    payload: TReq,
    timeoutMs: number = 5000
  ): Promise<TRes> {
    const ref = typeof target === 'string' ? this.getActorRef(target) : target;
    if (!ref) {
      const id = typeof target === 'string' ? target : 'unknown';
      throw new ActorNotFoundError(id);
    }
    return ref.ask<TReq, TRes>(payload, timeoutMs);
  }

  /**
   * Menghentikan aktor target.
   */
  public async stop(target: string | ActorRef): Promise<void> {
    const ref = typeof target === 'string' ? this.getActorRef(target) : target;
    if (ref) {
      await ref.stop();
      this.resourceManager.releaseActorSlot();
    }
  }

  /**
   * Mencatat waiter untuk Ask Pattern.
   */
  public registerAskWait(correlationId: string, resolver: (response: any) => void): void {
    this.askWaiters.set(correlationId, resolver);
  }

  /**
   * Menyelesaikan waiter Ask Pattern saat balasan tiba.
   */
  public completeAskWait(correlationId: string, response: any): void {
    const resolver = this.askWaiters.get(correlationId);
    if (resolver) {
      this.askWaiters.delete(correlationId);
      resolver(response);
    }
  }

  /**
   * Mengirim pesan yang tidak dapat diantar ke kotak surat mati (Dead Letters).
   */
  public publishDeadLetter(message: Message, reason: string): void {
    this.deadLetters.push({
      message,
      reason,
      timestamp: Date.now(),
    });
    // Batasi ukuran riwayat dead letters agar memori tidak bocor
    if (this.deadLetters.length > 5000) {
      this.deadLetters.shift();
    }
  }

  public getDeadLetters(): readonly DeadLetter[] {
    return this.deadLetters;
  }

  public handleRootError(actorId: string, error: Error): void {
    // Log atau rekam galat root aktor yang terelevasi
    console.error(`[ActorSystem:${this.name}] Galat tak tertangani pada root actor '${actorId}':`, error.message);
  }

  /**
   * Mengambil diagnostik kesehatan seluruh aktor.
   */
  public getDiagnostics(thresholdStallMs: number = 5000): SystemDiagnosticReport {
    const actors = this.registry.getAll().map((a) => ({
      id: a.id,
      name: a.name,
      status: a.status,
      mailboxLength: a.mailbox.length,
      totalProcessed: a.mailbox.getMetrics().totalProcessed,
      lastActiveTimestamp: a.getLastActiveTimestamp(),
    }));

    return ConcurrencyDiagnostics.analyzeStalls(actors, thresholdStallMs);
  }

  /**
   * Menghentikan seluruh aktor dan subsistem scheduler secara anggun (graceful shutdown).
   */
  public async shutdown(timeoutMs: number = 5000): Promise<void> {
    this.isShuttingDown = true;
    const allActors = this.registry.getAll();
    const stopPromises = allActors.map((a) => a.stop().catch(() => {}));

    await Promise.race([
      Promise.all(stopPromises),
      new Promise((res) => setTimeout(res, timeoutMs)),
    ]);

    await this.scheduler.shutdown();
    this.registry.clear();
    this.askWaiters.clear();
  }

  // Indonesian Aliases
  public dapatkanRegistry(): ActorRegistry {
    return this.registry;
  }

  public dapatkanScheduler(): ConcurrencyScheduler {
    return this.scheduler;
  }

  public dapatkanDeadLetters() {
    return this.getDeadLetters();
  }

  public dapatkanStatistik() {
    const all = this.registry.getAll();
    let totalProcessed = 0;
    for (const a of all) {
      totalProcessed += a.mailbox.getMetrics().totalProcessed;
    }
    return {
      totalAktor: this.registry.count,
      aktorAktif: all.filter((a) => a.status === 'RUNNING').length,
      pesanTerkirim: totalProcessed + this.deadLetters.length,
      pesanDiproses: totalProcessed,
      deadLetters: this.deadLetters.length,
      pesanPerDetik: totalProcessed > 0 ? totalProcessed : 0,
    };
  }

  public async hentikanSemua(timeoutMs: number = 5000): Promise<void> {
    await this.shutdown(timeoutMs);
  }
}
