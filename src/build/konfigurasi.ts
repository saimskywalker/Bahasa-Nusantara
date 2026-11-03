/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 23
 * Pengelola Konfigurasi Build
 */

import { ModeBuild, PlatformTarget, PLATFORM_SEMUA } from './types';

export interface KonfigurasiBuild {
  nama: string;
  versi: string;
  entriUtama: string;
  direktoriKeluaran: string;
  platformTarget: PlatformTarget[];
  modeDefault: ModeBuild;
  optimasi: boolean;
}

export function buatKonfigurasiBuildDefault(): KonfigurasiBuild {
  return {
    nama: 'aplikasi-nusantara',
    versi: '0.1.0',
    entriUtama: 'src/main.nusantara',
    direktoriKeluaran: 'dist',
    platformTarget: [...PLATFORM_SEMUA],
    modeDefault: 'release',
    optimasi: true,
  };
}

export function muatKonfigurasiBuild(): KonfigurasiBuild {
  return buatKonfigurasiBuildDefault();
}
