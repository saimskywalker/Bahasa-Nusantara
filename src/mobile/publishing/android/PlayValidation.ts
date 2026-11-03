/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 41
 * Validasi Kepatuhan & Kelayakan Rilis Google Play (Play Store Release Validation)
 */

import { GooglePlayTrack } from '../types';

export interface HasilValidasiRilisPlay {
  valid: boolean;
  packageSah: boolean;
  targetSdkSah: boolean;
  versionCodeSah: boolean;
  trackSah: boolean;
  daftarGalat: string[];
  pesanPeringatan: string[];
}

export class PlayValidation {
  public static readonly TARGET_SDK_MINIMAL_GOOGLE_PLAY = 34; // Kebijakan Google Play 2024/2025

  /**
   * Memvalidasi parameter rilis Android terhadap kebijakan Google Play.
   */
  public static validasiKelayakan(params: {
    packageName: string;
    versionCode: number;
    targetSdk: number;
    track: GooglePlayTrack;
    versiLamaMaxCode?: number;
    namaBerkasAAB?: string;
    ukuranAabBytes?: number;
  }): HasilValidasiRilisPlay {
    const daftarGalat: string[] = [];
    const pesanPeringatan: string[] = [];

    // 1. Validasi Package Name
    const packageRegex = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/;
    const packageSah = packageRegex.test(params.packageName);
    if (!packageSah) {
      daftarGalat.push(`Package name '${params.packageName}' tidak valid (format reverse-DNS wajib).`);
    }

    // 2. Validasi Target SDK Google Play
    const targetSdkSah = params.targetSdk >= this.TARGET_SDK_MINIMAL_GOOGLE_PLAY;
    if (!targetSdkSah) {
      daftarGalat.push(
        `targetSdkVersion (${params.targetSdk}) tidak memenuhi kebijakan Google Play saat ini (minimal SDK ${this.TARGET_SDK_MINIMAL_GOOGLE_PLAY}).`
      );
    }

    // 3. Validasi Version Code (Harus Integer positif dan lebih tinggi dari versi lama)
    let versionCodeSah = true;
    if (!Number.isInteger(params.versionCode) || params.versionCode <= 0) {
      daftarGalat.push(`versionCode (${params.versionCode}) harus bilangan bulat positif > 0.`);
      versionCodeSah = false;
    } else if (params.versiLamaMaxCode && params.versionCode <= params.versiLamaMaxCode) {
      daftarGalat.push(
        `versionCode (${params.versionCode}) harus lebih besar dari rilis sebelumnya (${params.versiLamaMaxCode}) agar Google Play menerima pembaruan.`
      );
      versionCodeSah = false;
    }

    // 4. Validasi Track
    const trackTersedia: GooglePlayTrack[] = ['internal', 'closed', 'open', 'production'];
    const trackSah = trackTersedia.includes(params.track);
    if (!trackSah) {
      daftarGalat.push(`Track '${params.track}' tidak dikenali. Pilihan sah: ${trackTersedia.join(', ')}.`);
    }

    // 5. Validasi Berkas AAB
    if (params.namaBerkasAAB && !params.namaBerkasAAB.endsWith('.aab')) {
      daftarGalat.push(`Google Play mewajibkan format paket rilis .aab (Android App Bundle). Format ditemukan: '${params.namaBerkasAAB}'.`);
    }

    // Peringatan jika rilis langsung ke production
    if (params.track === 'production') {
      pesanPeringatan.push(
        'Rilis langsung ke Production disarankan didahului uji coba di Internal Testing atau Closed Testing.'
      );
    }

    return {
      valid: daftarGalat.length === 0,
      packageSah,
      targetSdkSah,
      versionCodeSah,
      trackSah,
      daftarGalat,
      pesanPeringatan,
    };
  }
}
