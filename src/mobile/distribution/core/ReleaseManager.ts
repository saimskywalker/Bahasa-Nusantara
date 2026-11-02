/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 40
 * Manajer Pipeline Rilis & Distribusi (Release Manager)
 */

import {
  ArtefakHasilDistribusi,
  KonfigurasiDistribusiLengkap,
  LaporanValidasiRilis,
} from '../types';
import { ReleaseValidator } from '../validation/ReleaseValidator';
import { AssetValidator } from '../assets/AssetValidator';
import { BuildManager } from './BuildManager';
import { ReleaseReportGenerator } from '../reports/ReleaseReport';

export interface HasilEksekusiRilis {
  sukses: boolean;
  validasi: LaporanValidasiRilis;
  artefak: ArtefakHasilDistribusi[];
  jalurLaporanMarkdown: string;
  pesan: string;
}

export class ReleaseManager {
  public static jalankanPipelineRilis(konfig: KonfigurasiDistribusiLengkap): HasilEksekusiRilis {
    // 1. Validasi Aset
    AssetValidator.validasiAsetProyek(konfig);

    // 2. Validasi Kesiapan Rilis
    const validasi = ReleaseValidator.periksaKesiapanRilis(konfig);

    // 3. Bangun Artefak
    const hasilBuild = BuildManager.bangunSemua(konfig, true);

    // 4. Generate Laporan Markdown
    const laporanMd = ReleaseReportGenerator.buatLaporanMarkdown(
      konfig,
      validasi,
      hasilBuild.artefak
    );
    const jalurLaporanMarkdown = ReleaseReportGenerator.simpanLaporanMarkdown(laporanMd);

    const sukses = validasi.siapRilis && hasilBuild.sukses;

    return {
      sukses,
      validasi,
      artefak: hasilBuild.artefak,
      jalurLaporanMarkdown,
      pesan: sukses
        ? 'Pipeline rilis selesai dengan sukses. Semua artefak siap didistribusikan.'
        : 'Pipeline rilis selesai dengan beberapa catatan atau peringatan yang perlu ditinjau.',
    };
  }
}
