/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA CONCURRENCY RUNTIME - Pengelola Sumber Daya (Resource Manager)
 * Target Milestone: Phase 46 (v0.46.0)
 */

import { ResourceExhaustedError } from '../actor/errors';

export interface ResourceLimits {
  /** Batas maksimum total aktor aktif */
  maxActors: number;
  /** Batas maksimum kapasitas antrean per mailbox */
  maxMailboxCapacity: number;
  /** Batas maksimum jumlah worker thread/task simultan */
  maxWorkers: number;
  /** Batas maksimum tugas asinkron aktif */
  maxTasks: number;
}

export const DEFAULT_RESOURCE_LIMITS: Readonly<ResourceLimits> = Object.freeze({
  maxActors: 100000,
  maxMailboxCapacity: 10000,
  maxWorkers: 64,
  maxTasks: 50000,
});

export class ResourceManager {
  private activeActors = 0;
  private activeTasks = 0;
  private activeWorkers = 0;

  private readonly limits: ResourceLimits;

  constructor(limits: Partial<ResourceLimits> = {}) {
    this.limits = { ...DEFAULT_RESOURCE_LIMITS, ...limits };
  }

  public acquireActorSlot(): void {
    if (this.activeActors >= this.limits.maxActors) {
      throw new ResourceExhaustedError('aktor', this.limits.maxActors);
    }
    this.activeActors++;
  }

  public releaseActorSlot(): void {
    if (this.activeActors > 0) {
      this.activeActors--;
    }
  }

  public acquireTaskSlot(): void {
    if (this.activeTasks >= this.limits.maxTasks) {
      throw new ResourceExhaustedError('tugas', this.limits.maxTasks);
    }
    this.activeTasks++;
  }

  public releaseTaskSlot(): void {
    if (this.activeTasks > 0) {
      this.activeTasks--;
    }
  }

  public acquireWorkerSlot(): void {
    if (this.activeWorkers >= this.limits.maxWorkers) {
      throw new ResourceExhaustedError('worker', this.limits.maxWorkers);
    }
    this.activeWorkers++;
  }

  public releaseWorkerSlot(): void {
    if (this.activeWorkers > 0) {
      this.activeWorkers--;
    }
  }

  public getStats() {
    return {
      activeActors: this.activeActors,
      maxActors: this.limits.maxActors,
      activeTasks: this.activeTasks,
      maxTasks: this.limits.maxTasks,
      activeWorkers: this.activeWorkers,
      maxWorkers: this.limits.maxWorkers,
    };
  }

  // Indonesian Aliases
  public alokasiAktor(): void {
    this.acquireActorSlot();
  }

  public bebaskanAktor(): void {
    this.releaseActorSlot();
  }

  public dapatkanStatistik() {
    const s = this.getStats();
    return {
      currentActors: s.activeActors,
      maxActors: s.maxActors,
      currentTasks: s.activeTasks,
      maxTasks: s.maxTasks,
      currentWorkers: s.activeWorkers,
      maxWorkers: s.maxWorkers,
    };
  }
}
