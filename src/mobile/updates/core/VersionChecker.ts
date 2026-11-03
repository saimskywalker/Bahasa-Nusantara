/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 42
 * Pemeriksa & Pembanding Versi Semantik Aplikasi Mobile (Version Checker)
 */

import { HasilPemeriksaanVersi, ManifestPembaruan, PlatformMobile, SaluranPembaruan } from '../types';

export interface VersiSemantik {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  buildMetadata?: string;
}

export class VersionChecker {
  /**
   * Mengurai string versi SemVer (contoh: "1.2.3", "v1.2.3-beta.1").
   */
  public static uraiSemver(versiStr: string): VersiSemantik | null {
    if (!versiStr || typeof versiStr !== 'string') return null;

    let bersih = versiStr.trim();
    if (bersih.startsWith('v') || bersih.startsWith('V')) {
      bersih = bersih.slice(1);
    }

    const reg = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/;
    const match = bersih.match(reg);
    if (!match) return null;

    return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      patch: parseInt(match[3], 10),
      prerelease: match[4],
      buildMetadata: match[5],
    };
  }

  /**
   * Membandingkan dua versi semantik.
   * Return:
   *   1 jika v1 > v2
   *  -1 jika v1 < v2
   *   0 jika v1 == v2
   */
  public static bandingkan(versi1: string, versi2: string): number {
    const s1 = this.uraiSemver(versi1);
    const s2 = this.uraiSemver(versi2);

    if (!s1 || !s2) {
      throw new Error(`Format versi tidak valid untuk dibandingkan: '${versi1}' vs '${versi2}'`);
    }

    if (s1.major !== s2.major) return s1.major > s2.major ? 1 : -1;
    if (s1.minor !== s2.minor) return s1.minor > s2.minor ? 1 : -1;
    if (s1.patch !== s2.patch) return s1.patch > s2.patch ? 1 : -1;

    // Evaluasi prerelease (versi tanpa prerelease memiliki prioritas lebih tinggi daripada prerelease)
    if (!s1.prerelease && s2.prerelease) return 1;
    if (s1.prerelease && !s2.prerelease) return -1;
    if (s1.prerelease && s2.prerelease) {
      if (s1.prerelease > s2.prerelease) return 1;
      if (s1.prerelease < s2.prerelease) return -1;
    }

    return 0;
  }

  /**
   * Memeriksa apakah format versi SemVer valid.
   */
  public static isValid(versiStr: string): boolean {
    return this.uraiSemver(versiStr) !== null;
  }

  /**
   * Alias bahasa inggris untuk bandingkan.
   */
  public static compare(versi1: string, versi2: string): number {
    return this.bandingkan(versi1, versi2);
  }

  /**
   * Memeriksa apakah versi berada di bawah batas minimum.
   */
  public static isBelowMinimum(versiTerpasang: string, versiMinimum: string): boolean {
    return !this.apakahMemenuhiMinimum(versiTerpasang, versiMinimum);
  }

  /**
   * Mendeteksi level perbedaan antara dua versi.
   */
  public static diff(versi1: string, versi2: string): 'major' | 'minor' | 'patch' | 'prerelease' | 'identical' | null {
    const s1 = this.uraiSemver(versi1);
    const s2 = this.uraiSemver(versi2);
    if (!s1 || !s2) return null;

    if (s1.major !== s2.major) return 'major';
    if (s1.minor !== s2.minor) return 'minor';
    if (s1.patch !== s2.patch) return 'patch';
    if (s1.prerelease !== s2.prerelease) return 'prerelease';
    return 'identical';
  }

  /**
   * Memeriksa apakah versi terpasang memenuhi syarat versi minimum yang didukung.
   */
  public static apakahMemenuhiMinimum(versiTerpasang: string, versiMinimum: string): boolean {
    return this.bandingkan(versiTerpasang, versiMinimum) >= 0;
  }

  /**
   * Mengevaluasi status pembaruan berdasarkan manifest server dan konfigurasi lokal.
   */
  public static periksaKetersediaan(
    versiLokal: string,
    applicationIdLokal: string,
    platformLokal: PlatformMobile,
    manifest: ManifestPembaruan
  ): HasilPemeriksaanVersi {
    // 1. Validasi Application ID
    if (manifest.applicationId !== applicationIdLokal) {
      return {
        adaPembaruan: false,
        status: 'GALAT_SERVER',
        versiTerpasang: versiLokal,
        versiTerbaru: manifest.releaseVersion,
        versiMinimum: manifest.minimumSupportedVersion,
        perluPembaruanWajib: false,
        jenisPembaruan: manifest.updateType,
        saluran: manifest.channel,
        kebijakan: manifest.policy,
        catatanRilis: manifest.releaseNotes,
        totalUkuranResourceByte: 0,
        pesan: `Mismatched Application ID: '${manifest.applicationId}' tidak cocok dengan aplikasi lokal '${applicationIdLokal}'.`,
      };
    }

    // 2. Validasi Platform
    if (manifest.platform !== 'keduanya' && manifest.platform !== platformLokal) {
      return {
        adaPembaruan: false,
        status: 'TIDAK_KOMPATIBEL',
        versiTerpasang: versiLokal,
        versiTerbaru: manifest.releaseVersion,
        versiMinimum: manifest.minimumSupportedVersion,
        perluPembaruanWajib: false,
        jenisPembaruan: manifest.updateType,
        saluran: manifest.channel,
        kebijakan: manifest.policy,
        catatanRilis: manifest.releaseNotes,
        totalUkuranResourceByte: 0,
        pesan: `Platform target manifest '${manifest.platform}' tidak kompatibel dengan perangkat lokal '${platformLokal}'.`,
      };
    }

    // 3. Periksa versi minimum
    const memenuhiMin = this.apakahMemenuhiMinimum(versiLokal, manifest.minimumSupportedVersion);
    const adaVersiBaru = this.bandingkan(manifest.releaseVersion, versiLokal) > 0;

    const totalUkuran = (manifest.resources || []).reduce((acc, r) => acc + (r.ukuranByte || 0), 0);
    const storeUrl = platformLokal === 'android' ? manifest.storeUrl?.googlePlay : manifest.storeUrl?.appStore;

    if (!memenuhiMin) {
      return {
        adaPembaruan: true,
        status: 'PEMBARUAN_WAJIB',
        versiTerpasang: versiLokal,
        versiTerbaru: manifest.releaseVersion,
        versiMinimum: manifest.minimumSupportedVersion,
        perluPembaruanWajib: true,
        jenisPembaruan: manifest.updateType,
        saluran: manifest.channel,
        kebijakan: 'wajib',
        catatanRilis: manifest.releaseNotes,
        storeUrl,
        totalUkuranResourceByte: totalUkuran,
        pesan: `Versi aplikasi Anda (v${versiLokal}) berada di bawah batas minimum yang didukung (v${manifest.minimumSupportedVersion}). Pembaruan wajib diperlukan.`,
      };
    }

    if (adaVersiBaru) {
      return {
        adaPembaruan: true,
        status: 'PEMBARUAN_TERSEDIA',
        versiTerpasang: versiLokal,
        versiTerbaru: manifest.releaseVersion,
        versiMinimum: manifest.minimumSupportedVersion,
        perluPembaruanWajib: manifest.policy === 'wajib',
        jenisPembaruan: manifest.updateType,
        saluran: manifest.channel,
        kebijakan: manifest.policy,
        catatanRilis: manifest.releaseNotes,
        storeUrl,
        totalUkuranResourceByte: totalUkuran,
        pesan: `Versi baru v${manifest.releaseVersion} tersedia (kebijakan: ${manifest.policy}).`,
      };
    }

    return {
      adaPembaruan: false,
      status: 'TERBARU',
      versiTerpasang: versiLokal,
      versiTerbaru: manifest.releaseVersion,
      versiMinimum: manifest.minimumSupportedVersion,
      perluPembaruanWajib: false,
      jenisPembaruan: manifest.updateType,
      saluran: manifest.channel,
      kebijakan: manifest.policy,
      catatanRilis: manifest.releaseNotes,
      storeUrl,
      totalUkuranResourceByte: 0,
      pesan: `Aplikasi Anda sudah menggunakan versi terkini (v${versiLokal}).`,
    };
  }
}
