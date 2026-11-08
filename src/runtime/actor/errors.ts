/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA CONCURRENCY RUNTIME - Sistem Galat Konkurensi & Aktor
 * Target Milestone: Phase 46 (v0.46.0)
 */

export enum ConcurrencyErrorCode {
  AKTOR_TIDAK_DITEMUKAN = 'KOR4001',
  AKTOR_SUDAH_BERHENTI = 'KOR4002',
  MAILBOX_PENUH = 'KOR4003',
  PESAN_TIDAK_VALID = 'KOR4004',
  TRANSISI_STATUS_ILEGAL = 'KOR4005',
  SUPERVISI_GAGAL = 'KOR4006',
  BATAS_SUMBER_DAYA_TERLAMPAUI = 'KOR4007',
  DEADLOCK_TERDETEKSI = 'KOR4008',
  TASK_DIBATALKAN = 'KOR4009',
  TIMEOUT_TERLAMPAUI = 'KOR4010',
  AKTOR_ID_DUPLIKAT = 'KOR4011',
}

export class ConcurrencyError extends Error {
  public readonly timestamp: number;

  constructor(
    public readonly code: ConcurrencyErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(`[${code}] ${message}`);
    this.name = 'ConcurrencyError';
    this.timestamp = Date.now();
  }
}

export class ActorNotFoundError extends ConcurrencyError {
  constructor(actorId: string) {
    super(
      ConcurrencyErrorCode.AKTOR_TIDAK_DITEMUKAN,
      `Aktor dengan ID '${actorId}' tidak ditemukan di registri sistem.`,
      { actorId }
    );
  }
}

export class ActorTerminatedError extends ConcurrencyError {
  constructor(actorId: string, status: string) {
    super(
      ConcurrencyErrorCode.AKTOR_SUDAH_BERHENTI,
      `Aktor '${actorId}' telah berhenti atau gagal (${status}) dan tidak dapat menerima pesan baru.`,
      { actorId, status }
    );
  }
}

export class MailboxOverflowError extends ConcurrencyError {
  constructor(actorId: string, kapasitas: number) {
    super(
      ConcurrencyErrorCode.MAILBOX_PENUH,
      `Mailbox aktor '${actorId}' telah melampaui batas kapasitas (${kapasitas} pesan). Pesan ditolak (backpressure reject).`,
      { actorId, kapasitas }
    );
  }
}

export class ResourceExhaustedError extends ConcurrencyError {
  constructor(resourceType: string, limit: number) {
    super(
      ConcurrencyErrorCode.BATAS_SUMBER_DAYA_TERLAMPAUI,
      `Batas alokasi sumber daya '${resourceType}' telah tercapai (${limit}).`,
      { resourceType, limit }
    );
  }
}

export class TaskTimeoutError extends ConcurrencyError {
  constructor(taskId: string, timeoutMs: number) {
    super(
      ConcurrencyErrorCode.TIMEOUT_TERLAMPAUI,
      `Tugas asinkron '${taskId}' melebihi batas waktu eksekusi (${timeoutMs} ms).`,
      { taskId, timeoutMs }
    );
  }
}

export class TaskCancelledError extends ConcurrencyError {
  constructor(taskId: string, reason?: string) {
    super(
      ConcurrencyErrorCode.TASK_DIBATALKAN,
      `Tugas asinkron '${taskId}' telah dibatalkan.${reason ? ` Alasan: ${reason}` : ''}`,
      { taskId, reason }
    );
  }
}
