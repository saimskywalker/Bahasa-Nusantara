/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA CONCURRENCY RUNTIME - Token & Sumber Pembatalan (Cancellation Token)
 * Target Milestone: Phase 46 (v0.46.0)
 */

import { TaskCancelledError } from '../actor/errors';

export interface CancellationToken {
  readonly isCancelled: boolean;
  readonly reason?: string;
  throwIfCancelled(): void;
  onCancelled(callback: (reason?: string) => void): () => void;
}

export class CancellationTokenSource {
  private _isCancelled = false;
  private _reason?: string;
  private callbacks: Array<(reason?: string) => void> = [];

  public get token(): CancellationToken {
    const self = this;
    return {
      get isCancelled() {
        return self._isCancelled;
      },
      get reason() {
        return self._reason;
      },
      throwIfCancelled: () => {
        if (self._isCancelled) {
          throw new TaskCancelledError('token', self._reason);
        }
      },
      onCancelled: (callback: (reason?: string) => void) => {
        if (self._isCancelled) {
          callback(self._reason);
          return () => {};
        }
        self.callbacks.push(callback);
        return () => {
          const idx = self.callbacks.indexOf(callback);
          if (idx !== -1) {
            self.callbacks.splice(idx, 1);
          }
        };
      },
    };
  }

  public cancel(reason?: string): void {
    if (this._isCancelled) {
      return;
    }
    this._isCancelled = true;
    this._reason = reason;
    for (const cb of this.callbacks) {
      try {
        cb(reason);
      } catch {
        // Abaikan galat dalam callback listener pembatalan
      }
    }
    this.callbacks = [];
  }
}
