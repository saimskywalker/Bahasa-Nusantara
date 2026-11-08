/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA CONCURRENCY RUNTIME - Referensi Aktor (Actor Reference)
 * Target Milestone: Phase 46 (v0.46.0)
 *
 * Menyediakan pegangan aman (opaque handle) untuk berinteraksi dengan aktor.
 * Tidak mengekspos state internal mutable secara langsung (strict state isolation).
 */

export interface SendOptions {
  sender?: ActorRef;
  timeoutMs?: number;
}

export interface ActorRef {
  /** ID unik aktor */
  readonly id: string;
  /** Nama alias aktor (jika ada) */
  readonly name: string;
  /** Jalur hierarki aktor (misal: /user/penghitung_1) */
  readonly path: string;

  /**
   * Mengirim pesan asinkron "fire-and-forget" ke aktor (tell pattern).
   */
  send<T>(payload: T, options?: SendOptions): Promise<boolean>;

  /**
   * Mengirim pesan dan menunggu balasan (request-reply / ask pattern).
   */
  ask<TReq, TRes>(payload: TReq, timeoutMs?: number): Promise<TRes>;

  /**
   * Meminta terminasi aman terhadap aktor ini.
   */
  stop(): Promise<void>;
}
