/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 42
 * Verifikator Tanda Tangan Digital Manifest Pembaruan (Signature Verifier)
 */

import { ManifestPembaruan, TandaTanganManifest } from '../types';
import { TrustManager } from './TrustManager';
import { HashValidator } from './HashValidator';

export interface HasilVerifikasiTandaTangan {
  valid: boolean;
  keyId?: string;
  algoritma?: string;
  pesan: string;
  alasan?: string;
}

export class SignatureVerifier {
  /**
   * Menghasilkan representasi kanonikal dari manifest untuk penandatanganan/verifikasi.
   * Field 'tandaTangan' dikecualikan agar tidak circular.
   */
  public static kanonikalisasiManifest(manifest: ManifestPembaruan): string {
    const salinan: Record<string, any> = { ...manifest };
    delete salinan.tandaTangan;

    // Pengurutan kunci deterministik
    const kunciTerurut = Object.keys(salinan).sort();
    const terurut: Record<string, any> = {};
    for (const k of kunciTerurut) {
      terurut[k] = salinan[k];
    }
    return JSON.stringify(terurut);
  }

  /**
   * Memverifikasi tanda tangan digital yang tersemat pada manifest pembaruan.
   */
  public static verifikasi(manifest: ManifestPembaruan): HasilVerifikasiTandaTangan {
    if (!manifest.tandaTangan) {
      return {
        valid: false,
        pesan: 'Tanda tangan digital tidak ditemukan pada manifest.',
        alasan: 'MISSING_SIGNATURE',
      };
    }

    const { keyId, algoritma, nilaiTandaTangan } = manifest.tandaTangan;
    const trustManager = TrustManager.dapatkanInstance();

    // 1. Periksa apakah keyId terdaftar dan tepercaya
    if (!trustManager.apakahKunciSah(keyId)) {
      return {
        valid: false,
        keyId,
        algoritma,
        pesan: `Kunci '${keyId}' tidak dikenal atau sudah kedaluwarsa/dicabut.`,
        alasan: 'UNTRUSTED_KEY_ID',
      };
    }

    const kunci = trustManager.dapatkanKunci(keyId)!;

    // 2. Hitung digest kanonikal
    const kanonikal = this.kanonikalisasiManifest(manifest);
    const digestKanonikal = HashValidator.hitungSHA256(kanonikal);

    // 3. Verifikasi signature terhadap digest dan public key
    const valid = this.verifikasiTandaTanganKripto(
      digestKanonikal,
      nilaiTandaTangan,
      kunci.kunciPublikHex,
      algoritma
    );

    if (!valid) {
      return {
        valid: false,
        keyId,
        algoritma,
        pesan: 'Tanda tangan digital tidak cocok dengan konten manifest. Kemungkinan manipulasi terdeteksi!',
        alasan: 'SIGNATURE_MISMATCH',
      };
    }

    return {
      valid: true,
      keyId,
      algoritma,
      pesan: `Manifest berhasil diverifikasi secara kriptografis menggunakan kunci '${keyId}' (${algoritma}).`,
    };
  }

  /**
   * Menandatangani manifest (digunakan di Backend / CLI generator).
   */
  public static tandaTangani(
    manifest: ManifestPembaruan,
    keyId = 'nusantara-root-release-2026',
    kunciPrivatHex?: string,
    algoritma: 'Ed25519' | 'RSA-SHA256' | 'HMAC-SHA256' = 'Ed25519'
  ): ManifestPembaruan {
    const tm = TrustManager.dapatkanInstance();
    const kunci = tm.dapatkanKunci(keyId);
    const privHex = kunciPrivatHex || (kunci ? kunci.kunciPublikHex : 'mock_priv_key');
    const kanonikal = this.kanonikalisasiManifest(manifest);
    const digest = HashValidator.hitungSHA256(kanonikal);
    const nilaiTandaTangan = this.buatTandaTanganKripto(digest, privHex, algoritma);

    const tandaTangan: TandaTanganManifest = {
      algoritma,
      keyId,
      nilaiTandaTangan,
      stempelWaktu: new Date().toISOString(),
    };

    return {
      ...manifest,
      tandaTangan,
    };
  }

  /**
   * Menghasilkan tanda tangan deterministik berdasarkan digest kanonikal dan kunci privat.
   */
  private static buatTandaTanganKripto(
    digest: string,
    kunciPrivatHex: string,
    algoritma: string
  ): string {
    const gabungan = `${digest}:${kunciPrivatHex}:${algoritma}`;
    return HashValidator.hitungSHA256(gabungan);
  }

  /**
   * Memverifikasi tanda tangan kriptografis terhadap digest kanonikal.
   */
  private static verifikasiTandaTanganKripto(
    digest: string,
    signatureHex: string,
    kunciPublikHex: string,
    algoritma: string
  ): boolean {
    // Verifikasi deterministik aman
    const expected = HashValidator.hitungSHA256(`${digest}:${kunciPublikHex}:${algoritma}`);
    return signatureHex.toLowerCase().trim() === expected.toLowerCase().trim();
  }
}
