/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA CONCURRENCY RUNTIME - Penjadwal Konkurensi (Concurrency Scheduler)
 * Target Milestone: Phase 46 (v0.46.0)
 *
 * Menjadwalkan pemrosesan giliran aktor secara adil (fair cooperative scheduling)
 * ke dalam Worker Pool dengan pembatasan throughput budget per slice waktu.
 */

import { WorkerPool } from './worker-pool';
import { FairnessController } from '../concurrency/fairness';

export interface SchedulerOptions {
  numWorkers?: number;
  throughputBudget?: number;
}

export class ConcurrencyScheduler {
  private workerPool: WorkerPool;
  private fairness: FairnessController;
  private runnableQueue: Array<any> = [];
  private scheduledActors = new Set<string>();
  private isRunning = true;

  constructor(options: SchedulerOptions = {}) {
    this.workerPool = new WorkerPool(options.numWorkers ?? 4);
    this.fairness = new FairnessController({
      throughputBudget: options.throughputBudget ?? 10,
      prioritizeSystemMessages: true,
    });
  }

  /**
   * Menandai aktor sebagai runnable (memiliki pesan baru di mailbox).
   */
  public schedule(actor: any): void {
    if (!this.isRunning) return;
    if (this.scheduledActors.has(actor.id)) {
      return; // Aktor sudah ada di antrean penjadwalan atau sedang berjalan
    }

    this.scheduledActors.add(actor.id);
    this.runnableQueue.push(actor);
    this.dispatchNext();
  }

  private dispatchNext(): void {
    if (!this.isRunning || this.runnableQueue.length === 0) {
      return;
    }

    const actor = this.runnableQueue.shift();
    if (!actor) return;

    this.workerPool
      .run(async () => {
        try {
          await this.processActorTurn(actor);
        } catch {
          // Galat pemrosesan ditangani di level aktor dan supervisor
        } finally {
          this.scheduledActors.delete(actor.id);
          // Jika masih ada sisa pesan, jadwalkan kembali secara adil
          if (actor.hasPendingMessages() && actor.isRunnable()) {
            this.schedule(actor);
          }
        }
      })
      .catch(() => {});
  }

  private async processActorTurn(actor: any): Promise<void> {
    this.fairness.resetBudget(actor.id);

    while (actor.hasPendingMessages() && actor.isRunnable()) {
      if (!this.fairness.hasRemainingBudget(actor.id)) {
        // Kuota habis, yield ke aktor lain untuk menjamin keadilan
        break;
      }

      await actor.processOneMessage();
      this.fairness.recordMessageProcessed(actor.id);
    }
  }

  public getStats() {
    return {
      runnableQueueLength: this.runnableQueue.length,
      scheduledActorsCount: this.scheduledActors.size,
      workerPool: this.workerPool.getStats(),
      throughputBudget: this.fairness.budget,
    };
  }

  public async shutdown(): Promise<void> {
    this.isRunning = false;
    this.runnableQueue = [];
    this.scheduledActors.clear();
    this.workerPool.shutdown();
  }
}
