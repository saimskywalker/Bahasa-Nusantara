/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA CONCURRENCY RUNTIME - Mailbox & Backpressure
 * Target Milestone: Phase 46 (v0.46.0)
 *
 * Kebijakan Overflow Bawaan: REJECT (Pesan ditolak dan menghasilkan galat backpressure).
 * Kebijakan alternatif: WAIT (backpressure penundaan asinkron), DROP_OLDEST, DROP_NEWEST.
 */

import { Message } from './message';
import { MailboxOverflowError } from './errors';

export enum MailboxOverflowPolicy {
  /** Tolak pesan baru jika antrean penuh (Bawaan aman) */
  REJECT = 'REJECT',
  /** Tunda pengiriman sampai antrean memiliki ruang (Asynchronous Backpressure) */
  WAIT = 'WAIT',
  /** Buang pesan tertua di kepala antrean */
  DROP_OLDEST = 'DROP_OLDEST',
  /** Buang pesan terbaru yang baru masuk */
  DROP_NEWEST = 'DROP_NEWEST',
}

export interface MailboxMetrics {
  capacity: number;
  currentLength: number;
  totalEnqueued: number;
  totalProcessed: number;
  totalDropped: number;
  totalRejected: number;
  peakLength: number;
}

export interface MailboxOptions {
  capacity?: number;
  overflowPolicy?: MailboxOverflowPolicy;
  waitTimeoutMs?: number;
}

export class Mailbox {
  private queue: Message[] = [];
  public readonly capacity: number;
  public readonly overflowPolicy: MailboxOverflowPolicy;
  private readonly waitTimeoutMs: number;

  private totalEnqueued = 0;
  private totalProcessed = 0;
  private totalDropped = 0;
  private totalRejected = 0;
  private peakLength = 0;

  // Resolvers untuk backpressure penundaan (WAIT policy)
  private waitingSenders: Array<{
    resolve: () => void;
    reject: (err: Error) => void;
    timeoutId?: any;
  }> = [];

  constructor(
    public readonly actorId: string,
    options: MailboxOptions = {}
  ) {
    this.capacity = options.capacity ?? 1000;
    this.overflowPolicy = options.overflowPolicy ?? MailboxOverflowPolicy.REJECT;
    this.waitTimeoutMs = options.waitTimeoutMs ?? 5000;
  }

  /**
   * Menambahkan pesan ke antrean dengan validasi kapasitas dan backpressure.
   */
  public async enqueue(message: Message): Promise<boolean> {
    if (this.queue.length >= this.capacity) {
      switch (this.overflowPolicy) {
        case MailboxOverflowPolicy.REJECT: {
          this.totalRejected++;
          throw new MailboxOverflowError(this.actorId, this.capacity);
        }

        case MailboxOverflowPolicy.DROP_OLDEST: {
          this.queue.shift(); // Buang pesan paling lama di depan antrean
          this.totalDropped++;
          break;
        }

        case MailboxOverflowPolicy.DROP_NEWEST: {
          this.totalDropped++;
          return false; // Buang pesan baru yang masuk
        }

        case MailboxOverflowPolicy.WAIT: {
          await this.waitForSpace();
          break;
        }
      }
    }

    this.queue.push(message);
    this.totalEnqueued++;
    if (this.queue.length > this.peakLength) {
      this.peakLength = this.queue.length;
    }
    return true;
  }

  /**
   * Mengambil pesan terdepan dari antrean (FIFO).
   */
  public dequeue(): Message | undefined {
    const msg = this.queue.shift();
    if (msg) {
      this.totalProcessed++;
      this.notifyWaitingSender();
    }
    return msg;
  }

  /**
   * Mengintip pesan terdepan tanpa menghapusnya.
   */
  public peek(): Message | undefined {
    return this.queue[0];
  }

  public get length(): number {
    return this.queue.length;
  }

  public get isEmpty(): boolean {
    return this.queue.length === 0;
  }

  public get isFull(): boolean {
    return this.queue.length >= this.capacity;
  }

  /**
   * Mengosongkan seluruh antrean pesan.
   */
  public clear(): Message[] {
    const sisa = this.queue;
    this.queue = [];
    while (this.waitingSenders.length > 0) {
      const waiter = this.waitingSenders.shift();
      waiter?.resolve();
    }
    return sisa;
  }

  /**
   * Mengambil metrik statistik kinerja antrean.
   */
  public getMetrics(): MailboxMetrics {
    return {
      capacity: this.capacity,
      currentLength: this.queue.length,
      totalEnqueued: this.totalEnqueued,
      totalProcessed: this.totalProcessed,
      totalDropped: this.totalDropped,
      totalRejected: this.totalRejected,
      peakLength: this.peakLength,
    };
  }

  private waitForSpace(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let timeoutId: any;
      if (this.waitTimeoutMs > 0) {
        timeoutId = setTimeout(() => {
          const idx = this.waitingSenders.findIndex((w) => w.resolve === resolve);
          if (idx !== -1) {
            this.waitingSenders.splice(idx, 1);
          }
          this.totalRejected++;
          reject(new MailboxOverflowError(this.actorId, this.capacity));
        }, this.waitTimeoutMs);
      }

      this.waitingSenders.push({ resolve, reject, timeoutId });
    });
  }

  private notifyWaitingSender(): void {
    if (this.waitingSenders.length > 0 && this.queue.length < this.capacity) {
      const waiter = this.waitingSenders.shift();
      if (waiter) {
        if (waiter.timeoutId) {
          clearTimeout(waiter.timeoutId);
        }
        waiter.resolve();
      }
    }
  }

  // Indonesian Aliases
  public ukuran(): number {
    return this.length;
  }

  public kapasitasMaksimum(): number {
    return this.capacity;
  }

  public dorong(message: Message): Promise<boolean> {
    return this.enqueue(message);
  }

  public tarik(): Message | undefined {
    return this.dequeue();
  }
}
