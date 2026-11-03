/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 41
 * Pemeriksa Kesiapan Rilis Toko Aplikasi (Store Release Readiness Checker)
 */

import { LaporanKepatuhanToko } from '../types';

export interface LaporanKesiapanRilisToko {
  siapRilis: boolean;
  skorKesiapan: number; // 0 - 100
  statusPlatform: {
    android: 'SIAP' | 'PERINGATAN' | 'BELUM_SIAP';
    ios: 'SIAP' | 'PERINGATAN' | 'BELUM_SIAP';
  };
  isuPemblokir: string[];
  catatanPeringatan: string[];
  kepatuhan: LaporanKepatuhanToko;
  waktuPemeriksaan: string;
}

export class ReleaseReadiness {
  public static periksaKesiapan(params: {
    apakahAdaBinaryAndroid: boolean;
    apakahAdaBinaryIOS: boolean;
    apakahSigningAndroidValid: boolean;
    apakahSigningIOSValid: boolean;
    apakahMetadataValid: boolean;
    laporanKepatuhan: LaporanKepatuhanToko;
  }): LaporanKesiapanRilisToko {
    const isuPemblokir: string[] = [];
    const catatanPeringatan: string[] = [];

    // Isu pemblokir
    if (!params.apakahAdaBinaryAndroid && !params.apakahAdaBinaryIOS) {
      isuPemblokir.push('Belum ada paket binary rilis (AAB Android atau Archive iOS) yang dikompilasi.');
    }

    if (params.apakahAdaBinaryAndroid && !params.apakahSigningAndroidValid) {
      isuPemblokir.push('Penandatanganan Keystore Android belum valid untuk rilis produksi.');
    }

    if (!params.apakahMetadataValid) {
      isuPemblokir.push('Metadata toko aplikasi (judul/deskripsi/kebijakan) belum memenuhi standar validasi.');
    }

    if (!params.laporanKepatuhan.siapRilis) {
      isuPemblokir.push(`Ditemukan ${params.laporanKepatuhan.melanggar} pelanggaran kebijakan toko aplikasi.`);
    }

    // Isu peringatan
    if (params.laporanKepatuhan.peringatan > 0) {
      catatanPeringatan.push(`Ada ${params.laporanKepatuhan.peringatan} item peringatan kepatuhan yang disarankan ditinjau.`);
    }

    const siapRilis = isuPemblokir.length === 0;

    let skor = 100;
    skor -= isuPemblokir.length * 25;
    skor -= catatanPeringatan.length * 5;
    skor = Math.max(0, Math.min(100, skor));

    const statusAndroid = !params.apakahAdaBinaryAndroid
      ? 'BELUM_SIAP'
      : params.apakahSigningAndroidValid
      ? 'SIAP'
      : 'PERINGATAN';

    const statusIOS = !params.apakahAdaBinaryIOS
      ? 'BELUM_SIAP'
      : params.apakahSigningIOSValid
      ? 'SIAP'
      : 'PERINGATAN';

    return {
      siapRilis,
      skorKesiapan: skor,
      statusPlatform: {
        android: statusAndroid,
        ios: statusIOS,
      },
      isuPemblokir,
      catatanPeringatan,
      kepatuhan: params.laporanKepatuhan,
      waktuPemeriksaan: new Date().toISOString(),
    };
  }
}
