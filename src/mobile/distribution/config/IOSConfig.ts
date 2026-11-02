/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 40
 * Pengelola Konfigurasi iOS untuk Distribusi
 */

import { KonfigurasiSigningIOS } from '../types';

export class IOSDistributionConfig {
  public static readonly DEPLOYMENT_TARGET_DEFAULT = '15.0';

  public static validasiBundleIdentifier(bundleId: string): { valid: boolean; pesan?: string } {
    if (!bundleId || typeof bundleId !== 'string') {
      return { valid: false, pesan: 'Bundle Identifier tidak boleh kosong.' };
    }
    // iOS Bundle Identifier: reverse-DNS, alphanumeric and hyphens
    const regex = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;
    if (!regex.test(bundleId)) {
      return {
        valid: false,
        pesan: `Format iOS Bundle Identifier '${bundleId}' tidak valid. Harus format reverse-DNS (misal: id.nusantara.aplikasi).`,
      };
    }
    return { valid: true };
  }

  public static validasiBuildNumber(buildNumber: number): { valid: boolean; pesan?: string } {
    if (!Number.isInteger(buildNumber) || buildNumber <= 0) {
      return {
        valid: false,
        pesan: `iOS Build Number (CFBundleVersion) harus berupa bilangan bulat positif (diberikan: ${buildNumber}).`,
      };
    }
    return { valid: true };
  }

  public static buatDefaultSigning(bundleId: string): KonfigurasiSigningIOS {
    return {
      bundleIdentifier: bundleId,
      metodeEkspor: 'app-store',
      identitasSigning: 'Apple Distribution',
      apakahTervalidasi: false,
    };
  }

  public static dapatkanDaftarKebutuhanIzin(): Record<string, string> {
    return {
      kamera: 'NSCameraUsageDescription',
      lokasi: 'NSLocationWhenInUseUsageDescription',
      mikrofon: 'NSMicrophoneUsageDescription',
      foto_media: 'NSPhotoLibraryUsageDescription',
      bluetooth: 'NSBluetoothAlwaysUsageDescription',
      sensor: 'NSMotionUsageDescription',
    };
  }
}
