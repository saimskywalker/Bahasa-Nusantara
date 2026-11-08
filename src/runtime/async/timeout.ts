/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA CONCURRENCY RUNTIME - Manajemen Waktu Habis (Timeout Utility)
 * Target Milestone: Phase 46 (v0.46.0)
 */

import { TaskTimeoutError } from '../actor/errors';

/**
 * Menjalankan promise dengan batas waktu tertentu.
 * Jika melebihi batas, promise akan ditolak dengan TaskTimeoutError.
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  taskId: string = 'operasi'
): Promise<T> {
  if (ms <= 0) {
    return promise;
  }

  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new TaskTimeoutError(taskId, ms));
    }, ms);

    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * Helper jeda asinkron murni (sleep).
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
