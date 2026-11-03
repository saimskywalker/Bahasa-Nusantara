/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 42
 * Pemeriksa Kompatibilitas Runtime & Sistem Operasi (Compatibility Manager)
 */

import { PlatformMobile } from '../types';

export interface InfoPerangkatLingkungan {
  platform: PlatformMobile;
  versiOS: string;
  sdkAtauTarget: number | string; // misal targetSdk 34 atau iOS 15.0
  arsitekturCPU?: string; // arm64, x86_64
  ramTersediaByte?: number;
  ruangPenyimpananTersediaByte?: number;
}

export class CompatibilityManager {
  public static readonly MIN_ANDROID_SDK = 24; // Android 7.0+
  public static readonly MIN_IOS_VERSION = '15.0'; // iOS 15.0+

  /**
   * Memeriksa apakah lingkungan perangkat memenuhi syarat minimum untuk menerima rilis ini.
   */
  public static periksaKompatibilitas(perangkat: InfoPerangkatLingkungan): {
    kompatibel: boolean;
    pesan: string;
    isu: string[];
  } {
    const isu: string[] = [];

    if (perangkat.platform === 'android') {
      const sdk = typeof perangkat.sdkAtauTarget === 'number'
        ? perangkat.sdkAtauTarget
        : parseInt(String(perangkat.sdkAtauTarget), 10) || 0;

      if (sdk < this.MIN_ANDROID_SDK) {
        isu.push(`Target SDK perangkat (${sdk}) di bawah batas minimum yang didukung (${this.MIN_ANDROID_SDK}).`);
      }
    } else if (perangkat.platform === 'ios') {
      const iosVer = String(perangkat.sdkAtauTarget || perangkat.versiOS);
      if (parseFloat(iosVer) < parseFloat(this.MIN_IOS_VERSION)) {
        isu.push(`Versi iOS (${iosVer}) di bawah versi minimum yang didukung (${this.MIN_IOS_VERSION}).`);
      }
    }

    // Periksa ruang disk (minimum butuh 150 MB untuk ekstraksi aman)
    const diskMin = 150 * 1024 * 1024;
    if (perangkat.ruangPenyimpananTersediaByte !== undefined && perangkat.ruangPenyimpananTersediaByte < diskMin) {
      isu.push(`Ruang penyimpanan tidak mencukupi (sisa ${(perangkat.ruangPenyimpananTersediaByte / 1024 / 1024).toFixed(1)} MB, dibutuhkan min 150 MB).`);
    }

    return {
      kompatibel: isu.length === 0,
      pesan: isu.length === 0
        ? 'Perangkat kompatibel dengan persyaratan sistem pembaruan.'
        : `Ditemukan ${isu.length} isu ketidakcocokan perangkat.`,
      isu,
    };
  }
}
