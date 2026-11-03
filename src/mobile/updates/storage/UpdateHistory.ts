/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 42
 * Pengelola Riwayat & Jejak Audit Pembaruan (Update History)
 */

import { EntriRiwayatPembaruan } from '../types';

export class UpdateHistoryManager {
  private static instance: UpdateHistoryManager;
  private riwayat: EntriRiwayatPembaruan[] = [];

  private constructor() {
    this.inisialisasiRiwayatAwal();
  }

  public static dapatkanInstance(): UpdateHistoryManager {
    if (!UpdateHistoryManager.instance) {
      UpdateHistoryManager.instance = new UpdateHistoryManager();
    }
    return UpdateHistoryManager.instance;
  }

  private inisialisasiRiwayatAwal(): void {
    this.riwayat.push({
      id: 'upd_1793700000000_init',
      stempelWaktu: new Date(Date.now() - 86400000 * 3).toISOString(),
      platform: 'android',
      versiSebelum: '0.41.0',
      versiSesudah: '0.41.0',
      saluran: 'stable',
      jenisPembaruan: 'ota_resource',
      status: 'sukses',
      resourceIds: ['theme-garuda-dark', 'id-locales'],
      manifestHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      pesan: 'Pembaruan tema visual gelap dan katalog bahasa Indonesia berhasil diterapkan.',
      durasiMs: 1420,
    });
  }

  public catat(entri: Omit<EntriRiwayatPembaruan, 'id' | 'stempelWaktu'>): EntriRiwayatPembaruan {
    const id = `upd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const baru: EntriRiwayatPembaruan = {
      id,
      stempelWaktu: new Date().toISOString(),
      ...entri,
    };
    this.riwayat.unshift(baru);

    // Batasi retensi 100 entri terakhir
    if (this.riwayat.length > 100) {
      this.riwayat = this.riwayat.slice(0, 100);
    }

    return baru;
  }

  public dapatkanSemua(): EntriRiwayatPembaruan[] {
    return [...this.riwayat];
  }

  public dapatkanTerkini(): EntriRiwayatPembaruan | undefined {
    return this.riwayat[0];
  }

  public bersihkan(): void {
    this.riwayat = [];
  }
}
