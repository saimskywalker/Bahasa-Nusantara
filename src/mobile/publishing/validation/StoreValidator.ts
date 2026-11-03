/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 41
 * Validator Terpadu Toko Aplikasi (Store Validator Facade)
 */

import { AppMetadataManager, HasilValidasiMetadata } from '../metadata/AppMetadata';
import { ScreenshotManager } from '../metadata/ScreenshotManager';
import { ComplianceValidator } from './ComplianceValidator';
import { ReleaseReadiness, LaporanKesiapanRilisToko } from './ReleaseReadiness';
import { MetadataTokoLengkap, HasilValidasiAsetToko } from '../types';

export class StoreValidator {
  /**
   * Menjalankan audit validasi lengkap terhadap seluruh komponen rilis toko.
   */
  public static validasiKomprehensif(params: {
    metadata: MetadataTokoLengkap;
    packageName: string;
    targetSdk: number;
    apakahAdaAAB: boolean;
    apakahAdaArchiveIOS: boolean;
    apakahSigningAndroidValid: boolean;
    apakahSigningIOSValid: boolean;
    daftarAsetGambar?: any[];
  }): {
    valid: boolean;
    validasiMetadata: HasilValidasiMetadata;
    validasiAset: HasilValidasiAsetToko;
    kesiapan: LaporanKesiapanRilisToko;
    ringkasan: string;
  } {
    // 1. Validasi Metadata
    const validasiMetadata = AppMetadataManager.validasiMetadata(params.metadata);

    // 2. Validasi Aset
    const asetList = params.daftarAsetGambar || ScreenshotManager.buatMockDaftarAset();
    const validasiAset = ScreenshotManager.validasiSemuaAset(asetList);

    // 3. Validasi Kepatuhan
    const kepatuhan = ComplianceValidator.periksaKepatuhan({
      packageName: params.packageName,
      targetSdk: params.targetSdk,
      privacyPolicyUrl: params.metadata.privasi.kebijakanUrl,
      hasAccountCreation: true,
      hasAccountDeletionMechanism: params.metadata.privasi.mekanismePenghapusanAkun,
      declaredPermissions: ['android.permission.INTERNET', 'android.permission.ACCESS_NETWORK_STATE'],
    });

    // 4. Hitung Kesiapan
    const kesiapan = ReleaseReadiness.periksaKesiapan({
      apakahAdaBinaryAndroid: params.apakahAdaAAB,
      apakahAdaBinaryIOS: params.apakahAdaArchiveIOS,
      apakahSigningAndroidValid: params.apakahSigningAndroidValid,
      apakahSigningIOSValid: params.apakahSigningIOSValid,
      apakahMetadataValid: validasiMetadata.valid,
      laporanKepatuhan: kepatuhan,
    });

    const valid = validasiMetadata.valid && kesiapan.siapRilis;

    return {
      valid,
      validasiMetadata,
      validasiAset,
      kesiapan,
      ringkasan: valid
        ? `Aplikasi siap dipublikasikan ke toko aplikasi (Skor Kesiapan: ${kesiapan.skorKesiapan}%).`
        : `Aplikasi belum siap rilis (${kesiapan.isuPemblokir.length} isu pemblokir ditemukan).`,
    };
  }
}
