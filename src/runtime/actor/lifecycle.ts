/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA CONCURRENCY RUNTIME - Siklus Hidup Aktor (Actor Lifecycle)
 * Target Milestone: Phase 46 (v0.46.0)
 */

export enum ActorStatus {
  /** Aktor baru dibuat, belum menerima atau memproses pesan */
  CREATED = 'CREATED',
  /** Aktor aktif dan siap memproses pesan dari antrean */
  RUNNING = 'RUNNING',
  /** Pemrosesan aktor ditunda sementara */
  SUSPENDED = 'SUSPENDED',
  /** Aktor dalam proses terminasi aman, menyelesaikan pesan saat ini */
  STOPPING = 'STOPPING',
  /** Aktor telah berhenti total, tidak menerima pesan baru */
  STOPPED = 'STOPPED',
  /** Aktor mengalami kegagalan fatal saat memproses pesan */
  FAILED = 'FAILED',
}

/**
 * Matriks transisi status yang diizinkan untuk menjamin integritas siklus hidup.
 */
const TRANSISI_VALID: Readonly<Record<ActorStatus, readonly ActorStatus[]>> = {
  [ActorStatus.CREATED]: [ActorStatus.RUNNING, ActorStatus.STOPPING, ActorStatus.STOPPED],
  [ActorStatus.RUNNING]: [ActorStatus.SUSPENDED, ActorStatus.STOPPING, ActorStatus.FAILED],
  [ActorStatus.SUSPENDED]: [ActorStatus.RUNNING, ActorStatus.STOPPING, ActorStatus.FAILED],
  [ActorStatus.STOPPING]: [ActorStatus.STOPPED, ActorStatus.FAILED],
  [ActorStatus.FAILED]: [ActorStatus.RUNNING, ActorStatus.STOPPING, ActorStatus.STOPPED],
  [ActorStatus.STOPPED]: [], // Terminal, tidak ada transisi lanjutan
};

/**
 * Memvalidasi apakah transisi dari status lama ke status baru sah.
 */
export function validasiTransisiStatus(statusLama: ActorStatus, statusBaru: ActorStatus): boolean {
  if (statusLama === statusBaru) {
    return true;
  }
  const targetValid = TRANSISI_VALID[statusLama];
  return targetValid ? targetValid.includes(statusBaru) : false;
}
