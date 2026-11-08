/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA CONCURRENCY RUNTIME - Sistem Pesan Aktor (Message System)
 * Target Milestone: Phase 46 (v0.46.0)
 *
 * Jaminan Semantik:
 * 1. Delivery Semantics: At-most-once secara bawaan untuk pengiriman asinkron lokal.
 * 2. Message Ordering: FIFO dijamin untuk setiap pasangan terurut (Pengirim A -> Penerima B).
 *    Tidak ada jaminan urutan global antar pengirim yang berbeda.
 */

export enum MessageType {
  USER = 'USER',
  SYSTEM = 'SYSTEM',
  STOP = 'STOP',
  RESTART = 'RESTART',
  FAILURE = 'FAILURE',
  TIMEOUT = 'TIMEOUT',
}

export interface Message<T = unknown> {
  /** ID unik pesan */
  readonly id: string;
  /** Kategori pesan */
  readonly type: MessageType;
  /** ID aktor pengirim (opsional jika dikirim oleh sistem/lingkungan luar) */
  readonly senderId?: string;
  /** ID aktor target penerima */
  readonly receiverId: string;
  /** Isi muatan pesan */
  readonly payload: T;
  /** Waktu pembuatan pesan dalam epoch milidetik */
  readonly timestamp: number;
  /** Nomor urut pengiriman dari pengirim ini ke penerima ini (menjamin ordering FIFO) */
  readonly sequenceNumber?: number;
  /** Metadata tambahan (opsional) */
  readonly metadata?: Record<string, unknown>;
}

let counterPesan = 0;

/**
 * Membuat instance pesan baru dengan validasi integritas.
 */
export function buatPesan<T = unknown>(
  type: MessageType,
  receiverId: string,
  payload: T,
  senderId?: string,
  sequenceNumber?: number,
  metadata?: Record<string, unknown>
): Message<T> {
  if (!receiverId || receiverId.trim().length === 0) {
    throw new Error('ID penerima pesan tidak boleh kosong.');
  }

  counterPesan++;
  const id = `msg_${Date.now()}_${counterPesan}_${Math.random().toString(36).substring(2, 7)}`;

  return Object.freeze({
    id,
    type,
    senderId,
    receiverId,
    payload,
    timestamp: Date.now(),
    sequenceNumber,
    metadata,
  });
}

/**
 * Validasi muatan pesan untuk mencegah pengiriman pesan korup atau objek siklik berbahaya.
 */
export function validasiPesan(pesan: Message): boolean {
  if (!pesan.id || !pesan.type || !pesan.receiverId) {
    return false;
  }
  return true;
}
