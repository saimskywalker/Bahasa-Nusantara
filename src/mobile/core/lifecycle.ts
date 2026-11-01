/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Manajemen Siklus Hidup Aplikasi Mobile (Mobile Lifecycle Management)
 */

import { StatusLifecycleMobile } from '../types';

export type HookLifecycleMobile = (statusBaru: StatusLifecycleMobile, statusLama: StatusLifecycleMobile) => void | Promise<void>;

export class PengelolaLifecycleMobile {
  private status: StatusLifecycleMobile = StatusLifecycleMobile.DIBUAT;
  private paraPendengar: Set<HookLifecycleMobile> = new Set();
  private riwayatTransisi: Array<{ dari: StatusLifecycleMobile; ke: StatusLifecycleMobile; waktu: number }> = [];

  public getStatus(): StatusLifecycleMobile {
    return this.status;
  }

  public dapatkanStatus(): StatusLifecycleMobile {
    return this.status;
  }

  public apakahAktif(): boolean {
    return this.status === StatusLifecycleMobile.AKTIF;
  }

  public getRiwayat(): Array<{ dari: StatusLifecycleMobile; ke: StatusLifecycleMobile; waktu: number }> {
    return [...this.riwayatTransisi];
  }

  public pasangPendengar(fn: HookLifecycleMobile): () => void {
    this.paraPendengar.add(fn);
    return () => this.paraPendengar.delete(fn);
  }

  public padaPerubahan(fn: HookLifecycleMobile): () => void {
    return this.pasangPendengar(fn);
  }

  public async transisiKe(statusBaru: StatusLifecycleMobile): Promise<void> {
    if (this.status === statusBaru) return;

    const statusLama = this.status;
    this.status = statusBaru;
    this.riwayatTransisi.push({ dari: statusLama, ke: statusBaru, waktu: Date.now() });

    for (const fn of this.paraPendengar) {
      try {
        await fn(statusBaru, statusLama);
      } catch (err) {
        console.error(`[LifecycleMobile] Galat saat memproses transisi ${statusLama} -> ${statusBaru}:`, err);
      }
    }
  }

  public bersihkan(): void {
    this.paraPendengar.clear();
    this.riwayatTransisi = [];
    this.status = StatusLifecycleMobile.DIHANCURKAN;
  }
}
