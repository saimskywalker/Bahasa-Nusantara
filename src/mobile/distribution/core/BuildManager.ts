/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 40
 * Manajer Orkestrasi Build Mobile (Build Manager)
 */

import { ArtefakHasilDistribusi, KonfigurasiDistribusiLengkap, LaporanBuildMobile } from '../types';
import { AndroidDistributionManager } from '../android/AndroidBuildManager';
import { IOSDistributionManager } from '../ios/IOSBuildManager';
import { BuildReportGenerator } from '../reports/BuildReport';

export class BuildManager {
  public static bangunSemua(
    konfig: KonfigurasiDistribusiLengkap,
    apakahRelease: boolean = true
  ): {
    sukses: boolean;
    artefak: ArtefakHasilDistribusi[];
    laporan: LaporanBuildMobile;
    pesan: string;
  } {
    const semuaArtefak: ArtefakHasilDistribusi[] = [];
    const semuaPeringatan: string[] = [];
    const semuaGalat: string[] = [];

    // 1. Bangun Android APK
    const hasilAPK = apakahRelease
      ? AndroidDistributionManager.bangunReleaseAPK(konfig)
      : AndroidDistributionManager.bangunDebugAPK(konfig);

    semuaPeringatan.push(...hasilAPK.daftarPeringatan);
    if (hasilAPK.artefak) semuaArtefak.push(hasilAPK.artefak);
    if (!hasilAPK.sukses) semuaGalat.push(...hasilAPK.daftarGalat);

    // 2. Bangun Android AAB (Hanya jika release)
    if (apakahRelease) {
      const hasilAAB = AndroidDistributionManager.bangunReleaseAAB(konfig);
      semuaPeringatan.push(...hasilAAB.daftarPeringatan);
      if (hasilAAB.artefak) semuaArtefak.push(hasilAAB.artefak);
      if (!hasilAAB.sukses) semuaGalat.push(...hasilAAB.daftarGalat);
    }

    // 3. Persiapkan iOS Archive
    const hasilIOS = IOSDistributionManager.siapkanArchive(konfig);
    semuaPeringatan.push(...hasilIOS.daftarPeringatan);
    if (hasilIOS.artefak) semuaArtefak.push(hasilIOS.artefak);
    if (!hasilIOS.sukses) semuaGalat.push(...hasilIOS.daftarGalat);

    const sukses = semuaGalat.length === 0;
    const pesan = sukses
      ? `Proses build ${apakahRelease ? 'RELEASE' : 'DEBUG'} berhasil dengan ${semuaArtefak.length} artefak resmi.`
      : `Proses build menemui ${semuaGalat.length} kendala.`;

    const laporan = BuildReportGenerator.buatLaporan(
      'keduanya',
      apakahRelease ? 'release' : 'debug',
      konfig.lingkungan,
      sukses,
      pesan,
      semuaArtefak,
      semuaPeringatan,
      semuaGalat
    );

    BuildReportGenerator.simpanLaporanKeFile(laporan);

    return {
      sukses,
      artefak: semuaArtefak,
      laporan,
      pesan,
    };
  }
}
