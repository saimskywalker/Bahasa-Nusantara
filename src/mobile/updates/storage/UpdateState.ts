/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 42
 * Mesin Status & Pemulihan Keadaan Pembaruan (Update State & Recovery)
 */

import { StatusPembaruan, ManifestPembaruan } from '../types';

export interface DataKonteksStatusPembaruan {
  status: StatusPembaruan;
  versiTarget?: string;
  saluran?: string;
  manifestAktif?: ManifestPembaruan;
  bytesTerunduh: number;
  totalBytes: number;
  pesanTerakhir: string;
  stempelWaktu: string;
  galat?: string;
}

export class UpdateStateManager {
  private static instance: UpdateStateManager;
  private state: DataKonteksStatusPembaruan;
  private listeners: Array<(s: DataKonteksStatusPembaruan) => void> = [];

  private constructor() {
    this.state = {
      status: 'idle',
      bytesTerunduh: 0,
      totalBytes: 0,
      pesanTerakhir: 'Sistem pembaruan siap (idle).',
      stempelWaktu: new Date().toISOString(),
    };
  }

  public static dapatkanInstance(): UpdateStateManager {
    if (!UpdateStateManager.instance) {
      UpdateStateManager.instance = new UpdateStateManager();
    }
    return UpdateStateManager.instance;
  }

  public dapatkanStatus(): StatusPembaruan {
    return this.state.status;
  }

  public dapatkanKonteks(): Readonly<DataKonteksStatusPembaruan> {
    return { ...this.state };
  }

  public transisi(statusBaru: StatusPembaruan, pesan?: string, opsi?: Partial<DataKonteksStatusPembaruan>): void {
    this.state = {
      ...this.state,
      ...opsi,
      status: statusBaru,
      pesanTerakhir: pesan || `Status beralih ke: ${statusBaru}`,
      stempelWaktu: new Date().toISOString(),
    };
    this.beriTahuListener();
  }

  public pasangPendengar(fn: (s: DataKonteksStatusPembaruan) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private beriTahuListener(): void {
    for (const fn of this.listeners) {
      try {
        fn(this.dapatkanKonteks());
      } catch (err) {
        console.error('Galat pada pendengar status pembaruan:', err);
      }
    }
  }

  /**
   * Pemulihan keadaan setelah aplikasi restart saat sedang proses unduh/staged.
   */
  public pulihkanKeadaan(): { statusAwal: StatusPembaruan; perluAksiUlang: boolean } {
    const s = this.state.status;
    if (s === 'downloading' || s === 'verifying') {
      // Jika terputus di tengah jalan, reset ke 'available' agar user dapat mengunduh ulang dengan aman
      this.transisi('available', 'Proses unduhan sebelumnya terputus. Siap untuk diunduh ulang.');
      return { statusAwal: 'available', perluAksiUlang: true };
    }
    if (s === 'staged') {
      return { statusAwal: 'staged', perluAksiUlang: true };
    }
    return { statusAwal: s, perluAksiUlang: false };
  }

  public reset(): void {
    this.transisi('idle', 'Sistem pembaruan kembali ke status idle.');
  }
}
