/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 23
 * Tipe Data Sistem Build & Distribusi
 */

export type PlatformTarget =
  | 'windows'
  | 'linux'
  | 'macos'
  | 'semua'
  | 'linux-x64'
  | 'windows-x64'
  | 'macos-x64'
  | 'macos-arm64';

export const PLATFORM_SEMUA: PlatformTarget[] = [
  'windows',
  'linux',
  'macos',
  'linux-x64',
  'windows-x64',
  'macos-x64',
  'macos-arm64',
];

export type ModeBuild = 'debug' | 'release';

export interface ArtefakBuild {
  namaBerkas: string;
  platform: PlatformTarget;
  ukuranByte: number;
  sha256: string;
  jalur: string;
  format?: string;
}

export interface ManifestRilis {
  versiNusantara: string;
  namaPaket: string;
  versi: string;
  stempelWaktu: string;
  mode: ModeBuild;
  artefak: ArtefakBuild[];
}

export interface OpsiBuild {
  mode?: ModeBuild;
  target?: PlatformTarget[];
  verifikasiUji?: boolean;
  verbose?: boolean;
  direktoriKeluaran?: string;
  tanpaUji?: boolean;
  reproducible?: boolean;
}

export interface HasilBuild {
  sukses: boolean;
  pesan: string;
  artefak: ArtefakBuild[];
  manifest?: ManifestRilis;
  galat?: string;
  sha256sums?: string;
  berkasChecksum?: string;
  durasiMs?: number;
  mode?: ModeBuild;
  tahap?: string[];
  validasi?: any[];
}
