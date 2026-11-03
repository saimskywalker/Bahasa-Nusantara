/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 41
 * Perencana Pemulihan & Rollback Rilis (Release Rollback & Recovery Planner)
 */

export interface RencanaPemulihanRilis {
  platform: 'android' | 'ios' | 'keduanya';
  versiBermasalah: string;
  versionCodeBermasalah: number;
  versiTargetPulih: string;
  versionCodeBaruWajib: number;
  dapatDitarikLangsung: boolean;
  prosedurPemulihan: string[];
  catatanBatasanToko: string[];
}

export class RollbackPlanner {
  /**
   * Menyusun rencana pemulihan jika terjadi insiden pada rilis produksi.
   */
  public static susunRencanaRollback(params: {
    platform: 'android' | 'ios' | 'keduanya';
    versiBermasalah: string;
    versionCodeBermasalah: number;
    versiStabilSebelumnya: string;
    trackAtauChannel: string;
  }): RencanaPemulihanRilis {
    const versionCodeBaruWajib = params.versionCodeBermasalah + 1;

    // Versi patch baru (contoh: 1.0.1 jika bermasalah 1.0.0)
    const bagian = params.versiBermasalah.split('.');
    const mayor = bagian[0] || '1';
    const minor = bagian[1] || '0';
    const patch = parseInt(bagian[2] || '0', 10) + 1;
    const versiTargetPulih = `${mayor}.${minor}.${patch}`;

    const prosedurPemulihan: string[] = [
      `1. [STOP ROLLOUT] Hentikan (Halt) peluncuran bertahap versi v${params.versiBermasalah} di Google Play Console atau batalkan rilis di App Store Connect jika masih dalam antrean peninjauan.`,
      `2. [HOTFIX BRANCH] Buat branch hotfix dari commit versi stabil terakhir (v${params.versiStabilSebelumnya}).`,
      `3. [BUMP VERSION] Naikkan versi ke v${versiTargetPulih} dengan versionCode/buildNumber ${versionCodeBaruWajib} (Toko aplikasi menolak penurunan nomor versi).`,
      `4. [RECOMPILE] Bangun ulang paket binary resmi (.aab untuk Android, .xcarchive untuk iOS).`,
      `5. [VALIDATE] Jalankan pengujian regresi dan verifikasi kepatuhan rilis.`,
      `6. [EXPEDITED SUBMISSION] Ajukan rilis darurat ke Google Play (Internal -> Production) dan ajukan permohonan 'Expedited Review' di Apple App Store.`,
    ];

    const catatanBatasanToko: string[] = [
      '• Google Play Store: Berkas AAB yang sudah berstatus Completed pada track Production TIDAK DAPAT dihapus atau diturunkan version code-nya. Rollback dilakukan via rilis hotfix maju.',
      '• Apple App Store: Versi aplikasi yang sudah berstatus "Ready for Sale" tidak dapat digantikan langsung oleh versi lama. Pengembang wajib mengunggah build nomor lebih tinggi.',
      '• Pengguna yang telah mengunduh versi bermasalah akan tetap menggunakannya sampai mereka memperbarui ke versi hotfix baru.',
    ];

    return {
      platform: params.platform,
      versiBermasalah: params.versiBermasalah,
      versionCodeBermasalah: params.versionCodeBermasalah,
      versiTargetPulih,
      versionCodeBaruWajib,
      dapatDitarikLangsung: false, // Jujur: toko aplikasi tidak mengizinkan penarikan biner downgrade langsung
      prosedurPemulihan,
      catatanBatasanToko,
    };
  }
}
