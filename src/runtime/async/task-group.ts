/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA CONCURRENCY RUNTIME - Pengelompokan Tugas (Task Group)
 * Target Milestone: Phase 46 (v0.46.0)
 */

import { Task } from './task';
import { CancellationToken, CancellationTokenSource } from './cancellation';

export class TaskGroup {
  private tasks: Task<any>[] = [];
  private readonly cts = new CancellationTokenSource();

  constructor(public readonly name: string = 'grup_tugas') {}

  /**
   * Menambahkan tugas baru ke dalam grup.
   */
  public spawn<T>(action: (token: CancellationToken) => Promise<T> | T): Task<T> {
    const task = new Task<T>((tok) => {
      // Hubungkan pembatalan grup ke tugas
      const unbind = this.cts.token.onCancelled((reason) => {
        task.cancel(reason);
      });
      return Promise.resolve(action(tok)).finally(unbind);
    }, `${this.name}_task`);

    this.tasks.push(task);
    // Jalankan secara asinkron
    task.execute().catch(() => {});
    return task;
  }

  /**
   * Menunggu seluruh tugas dalam grup selesai dieksekusi (Join All).
   */
  public async joinAll(): Promise<any[]> {
    const promises = this.tasks.map((t) => t.result());
    return Promise.all(promises);
  }

  /**
   * Menunggu salah satu tugas tercepat dalam grup selesai dieksekusi (Join Any).
   */
  public async joinAny(): Promise<any> {
    const promises = this.tasks.map((t) => t.result());
    return Promise.race(promises);
  }

  /**
   * Membatalkan seluruh tugas dalam grup.
   */
  public cancelAll(reason?: string): void {
    this.cts.cancel(reason);
    for (const task of this.tasks) {
      task.cancel(reason);
    }
  }

  public get length(): number {
    return this.tasks.length;
  }
}
