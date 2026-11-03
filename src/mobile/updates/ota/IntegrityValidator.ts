/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 42
 * Validator Integritas Paket Resource OTA (Integrity Validator)
 */

import { ItemResourceOTA } from '../types';
import { HashValidator } from '../security/HashValidator';

export interface HasilVerifikasiIntegritasResource {
  id: string;
  jalurRelatif: string;
  sha256Diharapkan: string;
  sha256Aktual: string;
  ukuranDiharapkan: number;
  ukuranAktual: number;
  valid: boolean;
  pesan?: string;
}

export interface HasilVerifikasiIntegritasPaket {
  valid: boolean;
  totalResource: number;
  totalValid: number;
  totalGagal: number;
  hasilPerResource: HasilVerifikasiIntegritasResource[];
  pesan: string;
}

export class IntegrityValidator {
  /**
   * Memvalidasi apakah satu item resource cocok dengan hash SHA-256 dan ukuran yang diharapkan.
   */
  public static validasiSatuResource(
    resource: ItemResourceOTA,
    konten: string | Uint8Array
  ): HasilVerifikasiIntegritasResource {
    const bytes = typeof konten === 'string' ? new TextEncoder().encode(konten) : konten;
    const sha256Aktual = HashValidator.hitungSHA256(bytes);
    const ukuranAktual = bytes.length;

    const hashCocok = sha256Aktual.toLowerCase().trim() === resource.sha256.toLowerCase().trim();
    const ukuranCocok = ukuranAktual === resource.ukuranByte;

    const valid = hashCocok && ukuranCocok;
    let pesan = 'Integritas berkas valid.';
    if (!hashCocok) pesan = `Hash SHA-256 tidak cocok (Harapan: ${resource.sha256}, Ditemukan: ${sha256Aktual})`;
    else if (!ukuranCocok) pesan = `Ukuran berkas tidak cocok (Harapan: ${resource.ukuranByte}B, Ditemukan: ${ukuranAktual}B)`;

    return {
      id: resource.id,
      jalurRelatif: resource.jalurRelatif,
      sha256Diharapkan: resource.sha256,
      sha256Aktual,
      ukuranDiharapkan: resource.ukuranByte,
      ukuranAktual,
      valid,
      pesan,
    };
  }

  /**
   * Memvalidasi integritas konten langsung tanpa memerlukan obyek ItemResourceOTA.
   */
  public static verifikasiKonten(
    jalurRelatif: string,
    konten: string | Uint8Array,
    sha256Harapan: string,
    ukuranHarapan: number
  ): { valid: boolean; pesan: string } {
    const bytes = typeof konten === 'string' ? new TextEncoder().encode(konten) : konten;
    const sha = HashValidator.hitungSHA256(bytes);
    const hashCocok = sha.toLowerCase().trim() === sha256Harapan.toLowerCase().trim();
    const ukuranCocok = bytes.length === ukuranHarapan;
    return {
      valid: hashCocok && ukuranCocok,
      pesan: hashCocok && ukuranCocok ? 'Integritas valid.' : 'Integritas berkas tidak cocok!',
    };
  }

  /**
   * Memvalidasi seluruh kumpulan resource terhadap manifest.
   */
  public static validasiSemuaResource(
    daftarResource: ItemResourceOTA[],
    petaKonten: Map<string, string | Uint8Array>
  ): HasilVerifikasiIntegritasPaket {
    const hasilPerResource: HasilVerifikasiIntegritasResource[] = [];
    let validCount = 0;

    for (const res of daftarResource) {
      const konten = petaKonten.get(res.jalurRelatif) || petaKonten.get(res.id);
      if (!konten) {
        hasilPerResource.push({
          id: res.id,
          jalurRelatif: res.jalurRelatif,
          sha256Diharapkan: res.sha256,
          sha256Aktual: '',
          ukuranDiharapkan: res.ukuranByte,
          ukuranAktual: 0,
          valid: false,
          pesan: `Berkas resource '${res.jalurRelatif}' tidak ditemukan dalam unduhan.`,
        });
        continue;
      }

      const h = this.validasiSatuResource(res, konten);
      if (h.valid) validCount++;
      hasilPerResource.push(h);
    }

    const semuaValid = validCount === daftarResource.length;
    return {
      valid: semuaValid,
      totalResource: daftarResource.length,
      totalValid: validCount,
      totalGagal: daftarResource.length - validCount,
      hasilPerResource,
      pesan: semuaValid
        ? `Seluruh ${daftarResource.length} resource terverifikasi integritas SHA-256 dan ukuran byte.`
        : `Ditemukan ${daftarResource.length - validCount} dari ${daftarResource.length} resource yang gagal verifikasi integritas!`,
    };
  }
}
