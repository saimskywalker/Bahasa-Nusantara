/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 23
 * Penata Berkas Rilis & Checksum
 */

import { ManifestRilis, ArtefakBuild, ModeBuild } from './types';
import { VERSI_NUSANTARA } from '../konstanta/versi';

export class PenataRilis {
  public static susunManifest(
    namaPaket: string,
    versi: string,
    mode: ModeBuild,
    artefak: ArtefakBuild[]
  ): ManifestRilis {
    return {
      versiNusantara: VERSI_NUSANTARA,
      namaPaket,
      versi,
      stempelWaktu: new Date().toISOString(),
      mode,
      artefak,
    };
  }

  public static buatTeksChecksum(artefak: ArtefakBuild[]): string {
    return artefak.map((a) => `${a.sha256}  ${a.namaBerkas}`).join('\n');
  }
}
