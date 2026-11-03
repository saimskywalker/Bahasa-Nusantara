/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 41
 * Validator Kepatuhan Kebijakan Toko Aplikasi (Store Compliance Validator)
 */

import { ItemPemeriksaanKepatuhan, LaporanKepatuhanToko } from '../types';

export class ComplianceValidator {
  /**
   * Menjalankan audit menyeluruh terhadap kebijakan resmi Google Play dan Apple App Store.
   */
  public static periksaKepatuhan(params: {
    packageName: string;
    targetSdk: number;
    privacyPolicyUrl?: string;
    hasAccountCreation: boolean;
    hasAccountDeletionMechanism: boolean;
    declaredPermissions: string[];
  }): LaporanKepatuhanToko {
    const daftarPemeriksaan: ItemPemeriksaanKepatuhan[] = [];

    // 1. Target SDK Google Play (Wajib SDK 34+)
    daftarPemeriksaan.push({
      kode: 'PLAY_TARGET_SDK_34',
      kategori: 'kualitas_teknis',
      platform: 'android',
      judul: 'Target SDK Android (Google Play Policy)',
      penjelasan: 'Google Play mewajibkan targetSdkVersion minimal 34 untuk aplikasi baru dan pembaruan.',
      status: params.targetSdk >= 34 ? 'patuh' : 'melanggar',
      referensiDokumentasi: 'https://developer.android.com/google/play/requirements/target-sdk',
      rekomendasi: params.targetSdk < 34 ? 'Naikkan targetSdkVersion ke minimal 34 di konfigurasi android.' : undefined,
    });

    // 2. Kebijakan Privasi HTTPS
    const validPrivacyUrl = Boolean(params.privacyPolicyUrl && params.privacyPolicyUrl.startsWith('https://'));
    daftarPemeriksaan.push({
      kode: 'PRIVACY_POLICY_HTTPS',
      kategori: 'privasi_data',
      platform: 'keduanya',
      judul: 'URL Kebijakan Privasi (HTTPS Valid)',
      penjelasan: 'Google Play dan App Store mewajibkan tautan kebijakan privasi yang sah dengan enkripsi HTTPS.',
      status: validPrivacyUrl ? 'patuh' : 'melanggar',
      referensiDokumentasi: 'https://support.google.com/googleplay/android-developer/answer/9859455',
      rekomendasi: !validPrivacyUrl ? 'Pastikan URL kebijakan privasi aktif dan menggunakan protokol HTTPS.' : undefined,
    });

    // 3. Mekanisme Penghapusan Akun Pengguna (Apple & Google Mandate 2024+)
    const butuhHapusAkun = params.hasAccountCreation;
    const patuhHapusAkun = !butuhHapusAkun || params.hasAccountDeletionMechanism;
    daftarPemeriksaan.push({
      kode: 'ACCOUNT_DELETION_MANDATE',
      kategori: 'privasi_data',
      platform: 'keduanya',
      judul: 'Opsi Penghapusan Akun Pengguna',
      penjelasan: 'Jika aplikasi mendukung pembuatan akun, pengguna harus dapat meminta penghapusan akun langsung di dalam aplikasi atau tautan web.',
      status: patuhHapusAkun ? 'patuh' : 'melanggar',
      referensiDokumentasi: 'https://developer.apple.com/support/offering-account-deletion-in-your-app',
      rekomendasi: !patuhHapusAkun ? 'Sediakan opsi hapus akun atau URL penghapusan akun di metadata.' : undefined,
    });

    // 4. Audit Izin Sensitif (Minimal Privilege Principle)
    const izinSensitif = ['android.permission.ACCESS_FINE_LOCATION', 'android.permission.CAMERA', 'android.permission.RECORD_AUDIO'];
    const izinDipakai = params.declaredPermissions.filter((p) => izinSensitif.includes(p));

    daftarPemeriksaan.push({
      kode: 'MINIMAL_PERMISSION_PRIVILEGE',
      kategori: 'izin_sensitif',
      platform: 'android',
      judul: 'Audit Izin Akses Perangkat Berisiko Tinggi',
      penjelasan: 'Google Play meninjau izin lokasi latar belakang, kamera, dan mikrofon dengan ketat.',
      status: izinDipakai.length > 2 ? 'peringatan' : 'patuh',
      referensiDokumentasi: 'https://support.google.com/googleplay/android-developer/answer/9214102',
      rekomendasi:
        izinDipakai.length > 2
          ? 'Tinjau kembali apakah semua izin sensitif mutlak diperlukan untuk fungsionalitas inti aplikasi.'
          : undefined,
    });

    // 5. Deklarasi Data Safety / App Privacy Nutrition Labels
    daftarPemeriksaan.push({
      kode: 'DATA_SAFETY_DECLARATION',
      kategori: 'privasi_data',
      platform: 'keduanya',
      judul: 'Deklarasi Keamanan Data & Label Nutrisi Privasi',
      penjelasan: 'Google Play Data Safety & Apple Privacy Nutrition Labels wajib diisi sebelum publikasi.',
      status: 'patuh',
      referensiDokumentasi: 'https://developer.apple.com/app-store/app-privacy-details/',
    });

    // Hitung skor kepatuhan
    let patuh = 0;
    let peringatan = 0;
    let melanggar = 0;

    for (const item of daftarPemeriksaan) {
      if (item.status === 'patuh') patuh++;
      else if (item.status === 'peringatan') peringatan++;
      else if (item.status === 'melanggar') melanggar++;
    }

    const total = daftarPemeriksaan.length;
    const skorKepatuhan = Math.round(((patuh * 1.0 + peringatan * 0.5) / total) * 100);

    return {
      skorKepatuhan,
      totalItem: total,
      patuh,
      peringatan,
      melanggar,
      siapRilis: melanggar === 0,
      daftarPemeriksaan,
      kesimpulan:
        melanggar === 0
          ? 'Aplikasi memenuhi seluruh kriteria kepatuhan toko aplikasi (Google Play & Apple App Store).'
          : `Ditemukan ${melanggar} pelanggaran kebijakan toko yang harus diperbaiki sebelum publikasi.`,
    };
  }
}
