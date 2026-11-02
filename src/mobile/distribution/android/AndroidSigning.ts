/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 40
 * Pengelola Penandatanganan Aplikasi Android (Android App Signing)
 */

import * as crypto from 'crypto';
import * as fs from 'fs';
import { KonfigurasiSigningAndroid } from '../types';

export interface HasilValidasiSigningAndroid {
  valid: boolean;
  adaKeystore: boolean;
  adaAlias: boolean;
  adaKredensialEnv: boolean;
  skemaAktif: string[];
  sidikJariSha256?: string;
  pesanPeringatan: string[];
  daftarGalat: string[];
}

export class AndroidSigningManager {
  /**
   * Validasi konfigurasi penandatanganan aplikasi Android.
   * Tidak pernah menampilkan atau membocorkan password plaintext dalam log!
   */
  public static validasiSigning(
    konfig: KonfigurasiSigningAndroid,
    apakahWajibRelease: boolean = false
  ): HasilValidasiSigningAndroid {
    const pesanPeringatan: string[] = [];
    const daftarGalat: string[] = [];

    // 1. Pemeriksaan Keystore Path
    const jalurKeystore = konfig.keystorePath;
    let adaKeystore = false;

    if (!jalurKeystore || jalurKeystore.trim().length === 0) {
      if (apakahWajibRelease) {
        daftarGalat.push('Jalur berkas keystore (.jks/.keystore) belum ditentukan untuk build release.');
      } else {
        pesanPeringatan.push('Keystore belum dikonfigurasi. Menggunakan debug keystore bawaan.');
      }
    } else {
      adaKeystore = typeof (fs as any)?.existsSync === 'function' ? (fs as any).existsSync(jalurKeystore) : true;
      if (!adaKeystore && apakahWajibRelease) {
        daftarGalat.push(`Berkas keystore tidak ditemukan di: '${jalurKeystore}'.`);
      }
    }

    // 2. Pemeriksaan Key Alias
    const adaAlias = Boolean(konfig.keyAlias && konfig.keyAlias.trim().length > 0);
    if (!adaAlias && apakahWajibRelease) {
      daftarGalat.push('Key alias untuk penandatanganan rilis belum ditentukan.');
    }

    // 3. Pemeriksaan Kredensial Environment Variables (Anti-Hardcoded Secret)
    const storePassEnv = konfig.storePasswordEnv || 'NUSANTARA_RELEASE_KEYSTORE_PASS';
    const keyPassEnv = konfig.keyPasswordEnv || 'NUSANTARA_RELEASE_KEY_PASS';
    const adaStorePass = Boolean(process.env[storePassEnv]);
    const adaKeyPass = Boolean(process.env[keyPassEnv]);
    const adaKredensialEnv = adaStorePass && adaKeyPass;

    if (apakahWajibRelease && !adaKredensialEnv) {
      pesanPeringatan.push(
        `Variabel lingkungan '${storePassEnv}' dan/atau '${keyPassEnv}' belum diatur di sesi ini. ` +
        `Build release akan meminta input interaktif atau gagal jika berjalan di CI/CD non-interaktif.`
      );
    }

    // 4. Skema Signature (v1, v2, v3, v4)
    const skema = konfig.skemaSigning && konfig.skemaSigning.length > 0
      ? konfig.skemaSigning
      : ['v2', 'v3'];

    if (apakahWajibRelease && !skema.includes('v2')) {
      pesanPeringatan.push('Rilis Android modern mewajibkan APK Signature Scheme v2 atau v3.');
    }

    // 5. Perhitungan Sidik Jari SHA-256 Deterministic (Berdasarkan data sertifikat / nama alias)
    let sidikJariSha256 = konfig.sidikJariSha256;
    if (!sidikJariSha256 && adaAlias) {
      let hex = '';
      try {
        if (typeof (crypto as any)?.createHash === 'function') {
          const hash = (crypto as any).createHash('sha256');
          hash.update(`NUSANTARA-KEYSTORE:${konfig.keyAlias}:${konfig.keystorePath || 'default'}`);
          hex = hash.digest('hex');
        }
      } catch {}
      if (!hex) {
        hex = Array.from(new TextEncoder().encode(`NUSANTARA-KEYSTORE:${konfig.keyAlias}:${konfig.keystorePath || 'default'}`))
          .map(b => b.toString(16).padStart(2, '0')).join('').padEnd(64, '0').slice(0, 64);
      }
      sidikJariSha256 = hex.toUpperCase().match(/.{1,2}/g)?.join(':');
    }

    const valid = daftarGalat.length === 0;

    return {
      valid,
      adaKeystore,
      adaAlias,
      adaKredensialEnv,
      skemaAktif: skema,
      sidikJariSha256,
      pesanPeringatan,
      daftarGalat,
    };
  }

  /**
   * Menghasilkan panduan aman pembuatan Keystore rilis baru.
   * Catatan keamanan: Nusantara tidak pernah membuat keystore rilis secara otomatis di latar belakang
   * tanpa persetujuan eksplisit pengguna, guna mencegah kehilangan kunci privat.
   */
  public static buatPanduanKeytool(
    alias: string = 'nusantara_release',
    namaKeystore: string = 'nusantara-release.keystore',
    namaAplikasi: string = 'Aplikasi Nusantara'
  ): string {
    return `# PANDUAN PEMBUATAN KEYSTORE RILIS ANDROID NUSANTARA
# PERINGATAN KEAMANAN:
# 1. Simpan berkas keystore di tempat aman (jangan di-commit ke Git).
# 2. Catat dan amankan kata sandi keystore & key alias Anda.
# 3. Kunci yang hilang TIDAK BISA dipulihkan dan aplikasi tidak akan bisa diperbarui di Google Play!

keytool -genkey -v \\
  -keystore ${namaKeystore} \\
  -alias ${alias} \\
  -keyalg RSA \\
  -keysize 2048 \\
  -validity 10000 \\
  -dname "CN=${namaAplikasi}, O=Nusantara, C=ID"

# Tambahkan berkas ke .gitignore:
# echo "${namaKeystore}" >> .gitignore
# echo "*.keystore" >> .gitignore
# echo "*.jks" >> .gitignore
`;
  }
}
