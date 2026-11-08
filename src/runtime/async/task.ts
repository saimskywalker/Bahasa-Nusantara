/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA CONCURRENCY RUNTIME - Tugas Asinkron (Async Task)
 * Target Milestone: Phase 46 (v0.46.0)
 */

import { CancellationToken, CancellationTokenSource } from './cancellation';
import { TaskCancelledError } from '../actor/errors';

export enum TaskStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

let counterTask = 0;

export class Task<T = unknown> {
  public readonly id: string;
  private _status: TaskStatus = TaskStatus.PENDING;
  private _result?: T;
  private _error?: Error;
  private _startTime?: number;
  private _endTime?: number;

  private readonly cts = new CancellationTokenSource();
  private readonly promise: Promise<T>;
  private resolveFn!: (value: T) => void;
  private rejectFn!: (reason?: any) => void;

  constructor(
    private readonly action: (token: CancellationToken) => Promise<T> | T,
    idPrefix: string = 'task'
  ) {
    counterTask++;
    this.id = `${idPrefix}_${Date.now()}_${counterTask}`;
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolveFn = resolve;
      this.rejectFn = reject;
    });
  }

  public get status(): TaskStatus {
    return this._status;
  }

  public get cancellationToken(): CancellationToken {
    return this.cts.token;
  }

  public get durationMs(): number | undefined {
    if (!this._startTime) return undefined;
    const end = this._endTime ?? Date.now();
    return end - this._startTime;
  }

  public get error(): Error | undefined {
    return this._error;
  }

  /**
   * Menjalankan tugas secara asinkron.
   */
  public async execute(): Promise<T> {
    if (this._status !== TaskStatus.PENDING) {
      return this.promise;
    }

    this._status = TaskStatus.RUNNING;
    this._startTime = Date.now();

    try {
      this.cts.token.throwIfCancelled();
      const res = await this.action(this.cts.token);
      this._result = res;
      this._status = TaskStatus.COMPLETED;
      this._endTime = Date.now();
      this.resolveFn(res);
      return res;
    } catch (err: any) {
      this._endTime = Date.now();
      if (err instanceof TaskCancelledError || this.cts.token.isCancelled) {
        this._status = TaskStatus.CANCELLED;
        this._error = err instanceof TaskCancelledError ? err : new TaskCancelledError(this.id);
      } else {
        this._status = TaskStatus.FAILED;
        this._error = err instanceof Error ? err : new Error(String(err));
      }
      this.rejectFn(this._error);
      throw this._error;
    }
  }

  /**
   * Membatalkan tugas yang sedang berjalan atau antre.
   */
  public cancel(reason?: string): void {
    if (this._status === TaskStatus.COMPLETED || this._status === TaskStatus.FAILED || this._status === TaskStatus.CANCELLED) {
      return;
    }
    this.cts.cancel(reason);
    if (this._status === TaskStatus.PENDING) {
      this._status = TaskStatus.CANCELLED;
      this._error = new TaskCancelledError(this.id, reason);
      this._endTime = Date.now();
      this.rejectFn(this._error);
    }
  }

  /**
   * Menjalankan tugas secara asinkron (alias untuk execute).
   */
  public start(): Promise<T> {
    return this.execute();
  }

  /**
   * Menunggu hasil akhir tugas.
   */
  public async result(): Promise<T> {
    if (this._status === TaskStatus.PENDING) {
      return this.execute();
    }
    return this.promise;
  }
}
