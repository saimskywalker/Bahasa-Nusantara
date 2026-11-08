/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA CONCURRENCY RUNTIME - Konteks Aktor (Actor Context)
 * Target Milestone: Phase 46 (v0.46.0)
 */

import { ActorRef } from './actor-ref';
import { ActorStatus } from './lifecycle';
import { CancellationToken } from '../async/cancellation';
import { Message } from './message';

export interface ActorContext {
  /** Referensi ke diri sendiri */
  readonly self: ActorRef;
  /** Referensi ke aktor pengirim pesan saat ini (jika ada) */
  readonly sender?: ActorRef;
  /** Pesan yang sedang diproses */
  readonly currentMessage?: Message;
  /** Status siklus hidup aktor saat ini */
  readonly status: ActorStatus;
  /** Token pembatalan untuk operasi asinkron dalam aktor */
  readonly cancellationToken: CancellationToken;

  /**
   * Meneruskan pesan saat ini ke aktor lain dengan mempertahankan pengirim asli.
   */
  forward(target: ActorRef): Promise<boolean>;

  /**
   * Membuat aktor anak di bawah pengawasan aktor ini.
   */
  spawn<TState, TMsg>(options: any): ActorRef;

  /**
   * Menghentikan aktor anak atau diri sendiri.
   */
  stop(target?: ActorRef): Promise<void>;
}
