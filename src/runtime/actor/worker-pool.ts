/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA CONCURRENCY RUNTIME - Pool Pekerja (Worker Pool)
 * Target Milestone: Phase 46 (v0.46.0)
 *
 * Mengelola slot konkurensi pemrosesan pesan aktor secara adil dan terkendali.
 */

export interface WorkerStats {
  totalWorkers: number;
  busyWorkers: number;
  idleWorkers: number;
  totalTasksExecuted: number;
}

export class WorkerPool {
  public readonly size: number;
  private busyCount = 0;
  private totalTasksExecuted = 0;
  private queue: Array<() => void> = [];
  private isTerminated = false;

  constructor(size: number = 4) {
    this.size = Math.max(1, size);
  }

  /**
   * Menjalankan pekerjaan di slot worker yang tersedia.
   */
  public async run<T>(job: () => Promise<T>): Promise<T> {
    if (this.isTerminated) {
      throw new Error('WorkerPool telah dihentikan.');
    }

    await this.acquireWorker();
    try {
      this.totalTasksExecuted++;
      return await job();
    } finally {
      this.releaseWorker();
    }
  }

  private acquireWorker(): Promise<void> {
    if (this.busyCount < this.size) {
      this.busyCount++;
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      this.queue.push(() => {
        this.busyCount++;
        resolve();
      });
    });
  }

  private releaseWorker(): void {
    this.busyCount--;
    if (this.queue.length > 0 && this.busyCount < this.size && !this.isTerminated) {
      const next = this.queue.shift();
      next?.();
    }
  }

  public getStats(): WorkerStats {
    return {
      totalWorkers: this.size,
      busyWorkers: this.busyCount,
      idleWorkers: Math.max(0, this.size - this.busyCount),
      totalTasksExecuted: this.totalTasksExecuted,
    };
  }

  public shutdown(): void {
    this.isTerminated = true;
    this.queue = [];
  }
}
