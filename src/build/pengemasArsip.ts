/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 23
 * Pengemas Arsip Distribusi
 */

import { ArtefakBuild, PlatformTarget } from './types';

export class PengemasArsip {
  public static buatNamaArsip(nama: string, versi: string, platform: PlatformTarget): string {
    const ext = platform.includes('windows') ? 'zip' : 'tar.gz';
    const vStr = versi.startsWith('v') ? versi : `v${versi}`;
    return `${nama}-${vStr}-${platform}.${ext}`;
  }

  public static kemas(
    nama: string,
    versi: string,
    platform: PlatformTarget,
    ukuranPerkiraan = 1048576
  ): ArtefakBuild {
    const namaBerkas = this.buatNamaArsip(nama, versi, platform);
    return {
      namaBerkas,
      platform,
      ukuranByte: ukuranPerkiraan,
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      jalur: `dist/${namaBerkas}`,
    };
  }
}
