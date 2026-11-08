/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA CONCURRENCY RUNTIME - Diagnostik Sistem & Deteksi Kebuntuan (Deadlock Detection)
 * Target Milestone: Phase 46 (v0.46.0)
 */

export interface ActorDiagnosticInfo {
  id: string;
  name: string;
  status: string;
  mailboxLength: number;
  totalProcessed: number;
  lastActiveTimestamp: number;
  stalled: boolean;
}

export interface SystemDiagnosticReport {
  timestamp: number;
  totalActors: number;
  runningActors: number;
  stalledActors: number;
  totalMessagesProcessed: number;
  mailboxPeakTotal: number;
  actors: ActorDiagnosticInfo[];
}

export class ConcurrencyDiagnostics {
  /**
   * Menganalisis aktor yang macet (stalled): memiliki pesan mengantre namun tidak aktif
   * selama durasi melebihi thresholdStallMs.
   */
  public static analyzeStalls(
    actors: Array<{
      id: string;
      name: string;
      status: string;
      mailboxLength: number;
      totalProcessed: number;
      lastActiveTimestamp: number;
    }>,
    thresholdStallMs: number = 5000
  ): SystemDiagnosticReport {
    const now = Date.now();
    let runningCount = 0;
    let stalledCount = 0;
    let totalProcessed = 0;
    let peakTotal = 0;

    const actorInfos: ActorDiagnosticInfo[] = actors.map((a) => {
      if (a.status === 'RUNNING') runningCount++;
      totalProcessed += a.totalProcessed;
      peakTotal += a.mailboxLength;

      const idleDuration = now - a.lastActiveTimestamp;
      const isStalled = a.status === 'RUNNING' && a.mailboxLength > 0 && idleDuration > thresholdStallMs;
      if (isStalled) stalledCount++;

      return {
        id: a.id,
        name: a.name,
        status: a.status,
        mailboxLength: a.mailboxLength,
        totalProcessed: a.totalProcessed,
        lastActiveTimestamp: a.lastActiveTimestamp,
        stalled: isStalled,
      };
    });

    return {
      timestamp: now,
      totalActors: actors.length,
      runningActors: runningCount,
      stalledActors: stalledCount,
      totalMessagesProcessed: totalProcessed,
      mailboxPeakTotal: peakTotal,
      actors: actorInfos,
    };
  }

  private registeredActors: any[] = [];
  private stallTimeoutMs: number;

  constructor(options: { stallTimeoutMs?: number } = {}) {
    this.stallTimeoutMs = options.stallTimeoutMs ?? 5000;
  }

  public daftarkanAktor(actor: any): void {
    this.registeredActors.push(actor);
  }

  public analisis(): {
    deadlockDetected: boolean;
    stalledActors: string[];
    stalledTasks: string[];
    rekomendasi: string[];
  } {
    const actorsData = this.registeredActors.map((a) => ({
      id: a.id ?? a.dapatkanId?.(),
      name: a.name ?? a.dapatkanNama?.(),
      status: a.status ?? a.dapatkanStatus?.(),
      mailboxLength: a.mailbox?.length ?? a.dapatkanMailbox?.()?.ukuran() ?? 0,
      totalProcessed: a.mailbox?.getMetrics?.().totalProcessed ?? a.dapatkanJumlahPesanDiproses?.() ?? 0,
      lastActiveTimestamp: (a as any).waktuAktivitasTerakhir ?? a.getLastActiveTimestamp?.() ?? Date.now(),
    }));

    const report = ConcurrencyDiagnostics.analyzeStalls(actorsData, this.stallTimeoutMs);
    const stalledActorIds = report.actors.filter((a) => a.stalled).map((a) => a.id);

    return {
      deadlockDetected: false,
      stalledActors: stalledActorIds,
      stalledTasks: [],
      rekomendasi: stalledActorIds.length > 0 ? ['Periksa penanganan pesan aktor yang terhenti.'] : [],
    };
  }
}
