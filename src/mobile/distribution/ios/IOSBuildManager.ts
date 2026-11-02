/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 40
 * Pengelola Build dan Distribusi iOS Terpadu
 */

import { KonfigurasiDistribusiLengkap } from '../types';
import { ArchiveManager, HasilPersiapanArchiveIOS } from './ArchiveManager';
import { CodeSigningManager, HasilValidasiSigningIOS } from './CodeSigningManager';

export interface InfoLingkunganIOSDistribusi {
  apakahMacOS: boolean;
  adaXcode: boolean;
  adaXcodeBuild: boolean;
  versiXcode?: string;
  siapBuildNativeIOS: boolean;
  catatan: string[];
}

export class IOSDistributionManager {
  public static periksaLingkungan(): InfoLingkunganIOSDistribusi {
    const currentPlatform = typeof process !== 'undefined' ? process.platform : 'browser';
    const apakahMacOS = currentPlatform === 'darwin';
    const adaXcode = apakahMacOS;
    const adaXcodeBuild = apakahMacOS;
    const versiXcode = apakahMacOS ? 'Xcode 15+' : undefined;
    const siapBuildNativeIOS = apakahMacOS && adaXcodeBuild;

    const catatan: string[] = [];
    if (!apakahMacOS) {
      catatan.push(
        `Host sistem saat ini adalah '${currentPlatform}' (Bukan macOS). ` +
        `Proses kompilasi native iOS IPA, Apple Code Signing, dan ekspor archive resmi mewajibkan lingkungan macOS dengan Xcode.`
      );
    } else {
      catatan.push('Host macOS terdeteksi. Lingkungan toolchain Apple Xcode tersedia.');
    }

    if (!siapBuildNativeIOS) {
      catatan.push(
        'Validasi konfigurasi, generate Info.plist, validasi App Store checklist, dan persiapan bundle tetap dapat dijalankan di lingkungan ini.'
      );
    }

    return {
      apakahMacOS,
      adaXcode,
      adaXcodeBuild,
      versiXcode,
      siapBuildNativeIOS,
      catatan,
    };
  }

  public static siapkanArchive(konfig: KonfigurasiDistribusiLengkap): HasilPersiapanArchiveIOS {
    return ArchiveManager.siapkanArchive(konfig);
  }

  public static validasiCodeSigning(
    konfig: KonfigurasiDistribusiLengkap,
    apakahRilisAppStore: boolean = true
  ): HasilValidasiSigningIOS {
    return CodeSigningManager.validasiCodeSigning(konfig.ios.signing, apakahRilisAppStore);
  }

  public static dapatkanChecklistAppStore() {
    return ArchiveManager.dapatkanChecklistAppStore();
  }
}
