/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 40
 * Validator Hasil Build Distribusi Mobile (Build Validator)
 */

import * as fs from 'fs';
import { ArtefakHasilDistribusi } from '../types';

export interface HasilValidasiBuildMobile {
  valid: boolean;
  adaBerkas: boolean;
  ukuranBytes: number;
  sha256Sah: boolean;
  pesan: string;
}

export class BuildValidator {
  public static validasiArtefak(artefak: ArtefakHasilDistribusi): HasilValidasiBuildMobile {
    if (!artefak || !artefak.jalurLokal) {
      return {
        valid: false,
        adaBerkas: false,
        ukuranBytes: 0,
        sha256Sah: false,
        pesan: 'Informasi artefak build tidak lengkap atau jalur berkas null.',
      };
    }

    if (!fs.existsSync(artefak.jalurLokal)) {
      return {
        valid: false,
        adaBerkas: false,
        ukuranBytes: 0,
        sha256Sah: false,
        pesan: `Berkas artefak '${artefak.namaBerkas}' tidak ditemukan di lokasi: ${artefak.jalurLokal}`,
      };
    }

    try {
      const stat = fs.statSync(artefak.jalurLokal);
      const adaBerkas = stat.size > 0;
      const sha256Sah = Boolean(artefak.sha256 && artefak.sha256.length === 64);

      return {
        valid: adaBerkas && sha256Sah,
        adaBerkas,
        ukuranBytes: stat.size,
        sha256Sah,
        pesan: adaBerkas && sha256Sah
          ? `Artefak '${artefak.namaBerkas}' sah (${(stat.size / 1024).toFixed(1)} KB, sha256: ${artefak.sha256.substring(0, 12)}...)`
          : `Artefak '${artefak.namaBerkas}' tidak memenuhi kriteria integritas.`,
      };
    } catch (err: any) {
      return {
        valid: false,
        adaBerkas: false,
        ukuranBytes: 0,
        sha256Sah: false,
        pesan: `Gagal membaca artefak: ${err.message}`,
      };
    }
  }
}
