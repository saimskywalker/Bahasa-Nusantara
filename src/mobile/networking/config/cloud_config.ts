/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 39
 * Pengelola Konfigurasi Layanan Cloud Mobile (Cloud Configuration Manager)
 */

import { KonfigurasiCloudMobile } from '../types';
import { LapisanKeamananMobile } from '../security/cloud_security';

export class PengelolaKonfigurasiCloud {
  private static instance: PengelolaKonfigurasiCloud;
  private konfigurasiAktif: KonfigurasiCloudMobile;

  private constructor() {
    this.konfigurasiAktif = {
      namaLingkungan: 'pengembangan',
      apiUrl: 'http://localhost:3000/api',
      timeoutMs: 15000,
      cobaUlangMaks: 3,
      validasiSertifikatTLS: true,
      kebijakanSinkronisasi: 'otomatis',
      penyediaCloud: 'mock_local',
      storageEndpoint: 'http://localhost:3000/storage',
      pushNotificationProvider: 'fcm',
      databaseRestUrl: 'http://localhost:3000/api/db',
    };
  }

  public static dapatkanInstance(): PengelolaKonfigurasiCloud {
    if (!this.instance) {
      this.instance = new PengelolaKonfigurasiCloud();
    }
    return this.instance;
  }

  public dapatkanKonfigurasi(): KonfigurasiCloudMobile {
    return { ...this.konfigurasiAktif };
  }

  public muatKonfigurasi(konfigBaru: Partial<KonfigurasiCloudMobile>): { sukses: boolean; pesan: string } {
    const hasil = { ...this.konfigurasiAktif, ...konfigBaru };

    // Validasi URL dan TLS pada produksi
    if (hasil.namaLingkungan === 'produksi') {
      const cekApi = LapisanKeamananMobile.validasiUrlAman(hasil.apiUrl, 'produksi');
      if (!cekApi.valid) {
        return { sukses: false, pesan: cekApi.pesan || 'URL API tidak aman untuk produksi.' };
      }
      if (!hasil.validasiSertifikatTLS) {
        return {
          sukses: false,
          pesan: 'Validasi sertifikat TLS wajib aktif pada lingkungan produksi.',
        };
      }
    }

    this.konfigurasiAktif = hasil;
    return { sukses: true, pesan: 'Konfigurasi cloud berhasil diperbarui.' };
  }

  public beralihKeProduksi(apiUrl: string): { sukses: boolean; pesan: string } {
    return this.muatKonfigurasi({
      namaLingkungan: 'produksi',
      apiUrl,
      validasiSertifikatTLS: true,
    });
  }

  public beralihKePengembangan(): void {
    this.muatKonfigurasi({
      namaLingkungan: 'pengembangan',
      apiUrl: 'http://localhost:3000/api',
      validasiSertifikatTLS: false,
      penyediaCloud: 'mock_local',
    });
  }
}
