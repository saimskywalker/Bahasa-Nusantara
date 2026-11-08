/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA CONCURRENCY RUNTIME - Eksekutor Tugas Asinkron (Task Executor)
 * Target Milestone: Phase 46 (v0.46.0)
 */

import { Task } from './task';
import { CancellationToken } from './cancellation';

export interface TaskExecutorOptions {
  maxConcurrency?: number;
}

export class TaskExecutor {
  public readonly maxConcurrency: number;
  private activeCount = 0;
  private waitingQueue: Array<() => void> = [];

  constructor(options: TaskExecutorOptions = {}) {
    this.maxConcurrency = options.maxConcurrency ?? 8;
  }

  /**
   * Menjadwalkan aksi fungsi ke dalam antrean eksekusi terkontrol.
   */
  public submit<T>(action: (token: CancellationToken) => Promise<T> | T): Task<T> {
    const task = new Task<T>(async (token) => {
      await this.acquireSlot();
      try {
        return await action(token);
      } finally {
        this.releaseSlot();
      }
    });

    task.execute().catch(() => {});
    return task;
  }

  private acquireSlot(): Promise<void> {
    if (this.activeCount < this.maxConcurrency) {
      this.activeCount++;
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      this.waitingQueue.push(() => {
        this.activeCount++;
        resolve();
      });
    });
  }

  private releaseSlot(): void {
    this.activeCount--;
    if (this.waitingQueue.length > 0 && this.activeCount < this.maxConcurrency) {
      const next = this.waitingQueue.shift();
      next?.();
    }
  }

  public get runningTasks(): number {
    return this.activeCount;
  }

  public get queuedTasks(): number {
    return this.waitingQueue.length;
  }
}
