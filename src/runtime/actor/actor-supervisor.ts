/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA CONCURRENCY RUNTIME - Pengawasan Aktor (Actor Supervision)
 * Target Milestone: Phase 46 (v0.46.0)
 *
 * Menentukan kebijakan pemulihan ketika aktor mengalami kegagalan/exception saat memproses pesan:
 * - RESUME: Abaikan galat, pertahankan state saat ini.
 * - RESTART: Reset state ke kondisi awal, lanjutkan pemrosesan pesan berikutnya di mailbox.
 * - STOP: Hentikan aktor secara permanen.
 * - ESCALATE: Teruskan galat ke supervisor induk atau ActorSystem.
 */

export enum SupervisorDirective {
  RESUME = 'RESUME',
  RESTART = 'RESTART',
  STOP = 'STOP',
  ESCALATE = 'ESCALATE',
}

export interface SupervisorStrategyOptions {
  maxRestarts?: number;
  withinTimeRangeMs?: number;
  decider?: (error: Error) => SupervisorDirective;
}

export class SupervisorStrategy {
  public readonly maxRestarts: number;
  public readonly withinTimeRangeMs: number;
  private readonly decider: (error: Error) => SupervisorDirective;

  // Pelacakan waktu kegagalan per aktor: actorId -> timestamp[]
  private failureTimestamps = new Map<string, number[]>();

  constructor(options: SupervisorStrategyOptions = {}) {
    this.maxRestarts = options.maxRestarts ?? 3;
    this.withinTimeRangeMs = options.withinTimeRangeMs ?? 5000;
    this.decider = options.decider ?? (() => SupervisorDirective.RESTART);
  }

  /**
   * Menentukan arahan pemulihan untuk aktor yang gagal.
   */
  public handleFailure(actorId: string, error: Error): SupervisorDirective {
    const rawDirective = this.decider(error);

    if (rawDirective === SupervisorDirective.RESTART) {
      const now = Date.now();
      const timestamps = this.failureTimestamps.get(actorId) ?? [];
      // Buang timestamp yang sudah lewat batas waktu
      const recent = timestamps.filter((t) => now - t <= this.withinTimeRangeMs);
      recent.push(now);
      this.failureTimestamps.set(actorId, recent);

      if (recent.length > this.maxRestarts) {
        // Melampaui kuota restart: eskalasikan atau hentikan
        return SupervisorDirective.STOP;
      }
    }

    return rawDirective;
  }

  public clearActor(actorId: string): void {
    this.failureTimestamps.delete(actorId);
  }
}
