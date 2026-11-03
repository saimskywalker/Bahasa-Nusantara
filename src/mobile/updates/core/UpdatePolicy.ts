/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 42
 * Pengelola Kebijakan Pembaruan Aplikasi (Update Policy Manager)
 */

import { KebijakanPembaruan, HasilPemeriksaanVersi } from '../types';

export interface EvaluasiKebijakan {
  kebijakan: KebijakanPembaruan;
  dapatDilewati: boolean;
  dapatDitunda: boolean;
  intervalPengingatJam: number;
  perluBlokirInteraksi: boolean;
  rekomendasiAksi: 'lanjutkan_penggunaan' | 'tampilkan_dialog_opsional' | 'tampilkan_dialog_wajib' | 'unduh_latar_belakang';
  penjelasan: string;
}

export class UpdatePolicyManager {
  /**
   * Mengevaluasi implikasi kebijakan rilis terhadap UX aplikasi.
   */
  public static evaluasi(hasil: HasilPemeriksaanVersi): EvaluasiKebijakan {
    if (!hasil.adaPembaruan) {
      return {
        kebijakan: hasil.kebijakan,
        dapatDilewati: true,
        dapatDitunda: true,
        intervalPengingatJam: 0,
        perluBlokirInteraksi: false,
        rekomendasiAksi: 'lanjutkan_penggunaan',
        penjelasan: 'Aplikasi sudah versi terbaru.',
      };
    }

    if (hasil.perluPembaruanWajib || hasil.kebijakan === 'wajib') {
      return {
        kebijakan: 'wajib',
        dapatDilewati: false,
        dapatDitunda: false,
        intervalPengingatJam: 0,
        perluBlokirInteraksi: true,
        rekomendasiAksi: 'tampilkan_dialog_wajib',
        penjelasan: 'Versi aplikasi tidak lagi didukung oleh server. Wajib memperbarui sebelum melanjutkan.',
      };
    }

    if (hasil.kebijakan === 'keamanan') {
      return {
        kebijakan: 'keamanan',
        dapatDilewati: false,
        dapatDitunda: true,
        intervalPengingatJam: 4, // Ingatkan setiap 4 jam
        perluBlokirInteraksi: false,
        rekomendasiAksi: 'tampilkan_dialog_opsional',
        penjelasan: 'Terdapat perbaikan keamanan kritis yang sangat disarankan untuk segera diperbarui.',
      };
    }

    if (hasil.kebijakan === 'resource_saja') {
      return {
        kebijakan: 'resource_saja',
        dapatDilewati: true,
        dapatDitunda: true,
        intervalPengingatJam: 0,
        perluBlokirInteraksi: false,
        rekomendasiAksi: 'unduh_latar_belakang',
        penjelasan: 'Pembaruan hanya mencakup aset non-eksekusi (tema/font/bahasa), dapat diunduh di latar belakang.',
      };
    }

    if (hasil.kebijakan === 'disarankan') {
      return {
        kebijakan: 'disarankan',
        dapatDilewati: true,
        dapatDitunda: true,
        intervalPengingatJam: 24, // Ingatkan 1x sehari
        perluBlokirInteraksi: false,
        rekomendasiAksi: 'tampilkan_dialog_opsional',
        penjelasan: 'Pembaruan disarankan untuk meningkatkan stabilitas dan performa aplikasi.',
      };
    }

    // Default: 'opsional'
    return {
      kebijakan: 'opsional',
      dapatDilewati: true,
      dapatDitunda: true,
      intervalPengingatJam: 72, // 3 hari sekali
      perluBlokirInteraksi: false,
      rekomendasiAksi: 'tampilkan_dialog_opsional',
      penjelasan: 'Pembaruan opsional tersedia untuk dicoba.',
    };
  }
}
