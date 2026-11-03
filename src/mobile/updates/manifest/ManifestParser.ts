/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 42
 * Parser Manifest Pembaruan Aman (Manifest Parser)
 */

import { ManifestPembaruan } from '../types';
import { ManifestValidator, HasilValidasiManifest } from './ManifestValidator';

export interface HasilUraiManifest {
  sukses: boolean;
  manifest?: ManifestPembaruan;
  validasi?: HasilValidasiManifest;
  galat?: string;
}

export class ManifestParser {
  /**
   * Mengurai string JSON manifest pembaruan dan memvalidasinya secara ketat.
   */
  public static urai(jsonStr: string): HasilUraiManifest {
    if (!jsonStr || typeof jsonStr !== 'string') {
      return {
        sukses: false,
        galat: 'String konten manifest pembaruan tidak boleh kosong.',
      };
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (err: any) {
      return {
        sukses: false,
        galat: `Gagal mengurai JSON manifest: ${err.message}`,
      };
    }

    const val = ManifestValidator.validasi(parsed);
    if (!val.valid) {
      return {
        sukses: false,
        validasi: val,
        galat: `Manifest tidak valid: ${val.kesalahan.join('; ')}`,
      };
    }

    return {
      sukses: true,
      manifest: parsed as ManifestPembaruan,
      validasi: val,
    };
  }

  /**
   * Serialisasi manifest ke JSON terformat rapi.
   */
  public static stringify(manifest: ManifestPembaruan): string {
    return JSON.stringify(manifest, null, 2);
  }
}
