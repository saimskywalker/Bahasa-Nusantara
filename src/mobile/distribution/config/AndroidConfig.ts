/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 40
 * Pengelola Konfigurasi Android untuk Distribusi
 */

import { KonfigurasiSigningAndroid } from '../types';

export class AndroidDistributionConfig {
  public static readonly SDK_MIN_DEFAULT = 24; // Android 7.0 (Nougat)
  public static readonly SDK_TARGET_DEFAULT = 34; // Android 14 (Upside Down Cake)
  public static readonly SDK_COMPILE_DEFAULT = 34;

  public static validasiPackageName(pkg: string): { valid: boolean; pesan?: string } {
    if (!pkg || typeof pkg !== 'string') {
      return { valid: false, pesan: 'Package name tidak boleh kosong.' };
    }
    // Android package name: at least two segments, start with letter, valid identifiers
    const regex = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/;
    if (!regex.test(pkg)) {
      return {
        valid: false,
        pesan: `Format package name '${pkg}' tidak valid. Harus terdiri dari minimal 2 segmen (misal: id.nusantara.aplikasi).`,
      };
    }
    if (pkg.startsWith('java.') || pkg.startsWith('javax.') || pkg.startsWith('android.')) {
      return {
        valid: false,
        pesan: `Package name tidak boleh menggunakan awalan yang dipesan sistem Android (${pkg}).`,
      };
    }
    return { valid: true };
  }

  public static validasiVersionCode(code: number): { valid: boolean; pesan?: string } {
    if (!Number.isInteger(code) || code <= 0) {
      return {
        valid: false,
        pesan: `Android versionCode harus berupa bilangan bulat positif lebih besar dari 0 (diberikan: ${code}).`,
      };
    }
    if (code > 2100000000) {
      return {
        valid: false,
        pesan: `Android versionCode (${code}) melebihi batas maksimum Google Play (2.100.000.000).`,
      };
    }
    return { valid: true };
  }

  public static validasiTargetSdk(sdk: number): { valid: boolean; pesan?: string } {
    if (!Number.isInteger(sdk) || sdk < 21) {
      return {
        valid: false,
        pesan: `Target SDK Android harus minimal 21 (diberikan: ${sdk}).`,
      };
    }
    // Kebijakan Google Play saat ini mensyaratkan target SDK minimal 33 atau 34
    if (sdk < 33) {
      return {
        valid: true,
        pesan: `Target SDK ${sdk} di bawah standar rilis Google Play terbaru (rekomendasi: SDK 34).`,
      };
    }
    return { valid: true };
  }

  public static buatDefaultSigning(tipe: 'debug' | 'release'): KonfigurasiSigningAndroid {
    if (tipe === 'debug') {
      return {
        keystorePath: 'keystore/debug.keystore',
        keyAlias: 'androiddebugkey',
        storePasswordEnv: 'NUSANTARA_DEBUG_KEYSTORE_PASS',
        keyPasswordEnv: 'NUSANTARA_DEBUG_KEY_PASS',
        skemaSigning: ['v1', 'v2'],
        apakahTervalidasi: true,
      };
    }
    return {
      keystorePath: 'keystore/release.keystore',
      keyAlias: 'nusantara_release',
      storePasswordEnv: 'NUSANTARA_RELEASE_KEYSTORE_PASS',
      keyPasswordEnv: 'NUSANTARA_RELEASE_KEY_PASS',
      skemaSigning: ['v2', 'v3'],
      apakahTervalidasi: false,
    };
  }
}
