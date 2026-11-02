/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 40
 * Pengelola Versi dan Release Channel (Version Manager)
 */

import { SaluranRilis } from '../types';

export interface InfoVersiMobile {
  versiSemantik: string;
  mayor: number;
  minor: number;
  patch: number;
  labelPrerilis?: string;
  kodeVersiAndroid: number;
  nomorBuildIOS: number;
  saluran: SaluranRilis;
  stempelWaktu: string;
}

export class VersionManager {
  private static readonly REGEX_SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?$/;

  public static periksaSemver(teksVersi: string): { valid: boolean; mayor: number; minor: number; patch: number; labelPrerilis?: string; pesan?: string } {
    if (!teksVersi || typeof teksVersi !== 'string') {
      return { valid: false, mayor: 0, minor: 0, patch: 0, pesan: 'Versi tidak boleh kosong.' };
    }
    const match = teksVersi.trim().match(this.REGEX_SEMVER);
    if (!match) {
      return {
        valid: false,
        mayor: 0,
        minor: 0,
        patch: 0,
        pesan: `Format versi '${teksVersi}' tidak mengikuti standar SemVer (contoh sah: 1.0.0, 1.2.3-beta.1).`,
      };
    }

    return {
      valid: true,
      mayor: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      patch: parseInt(match[3], 10),
      labelPrerilis: match[4] || undefined,
    };
  }

  public static validasiVersiDanKode(
    versi: string,
    kodeAndroid: number,
    buildIOS: number
  ): { valid: boolean; daftarGalat: string[] } {
    const daftarGalat: string[] = [];

    const semver = this.periksaSemver(versi);
    if (!semver.valid && semver.pesan) {
      daftarGalat.push(semver.pesan);
    }

    if (!Number.isInteger(kodeAndroid) || kodeAndroid <= 0) {
      daftarGalat.push(`Android versionCode harus bilangan bulat positif (diberikan: ${kodeAndroid}).`);
    }

    if (!Number.isInteger(buildIOS) || buildIOS <= 0) {
      daftarGalat.push(`iOS Build Number harus bilangan bulat positif (diberikan: ${buildIOS}).`);
    }

    return {
      valid: daftarGalat.length === 0,
      daftarGalat,
    };
  }

  public static naikkanVersi(
    versiSekarang: string,
    kodeAndroidSekarang: number,
    buildIOSSekarang: number,
    tipe: 'mayor' | 'minor' | 'patch',
    saluran: SaluranRilis = 'produksi'
  ): InfoVersiMobile {
    const sem = this.periksaSemver(versiSekarang);
    let { mayor, minor, patch } = sem;

    if (!sem.valid) {
      mayor = 1;
      minor = 0;
      patch = 0;
    }

    switch (tipe) {
      case 'mayor':
        mayor += 1;
        minor = 0;
        patch = 0;
        break;
      case 'minor':
        minor += 1;
        patch = 0;
        break;
      case 'patch':
      default:
        patch += 1;
        break;
    }

    let versiBaru = `${mayor}.${minor}.${patch}`;
    if (saluran === 'beta') {
      versiBaru += '-beta.1';
    } else if (saluran === 'internal') {
      versiBaru += '-alpha.1';
    }

    return {
      versiSemantik: versiBaru,
      mayor,
      minor,
      patch,
      kodeVersiAndroid: kodeAndroidSekarang + 1,
      nomorBuildIOS: buildIOSSekarang + 1,
      saluran,
      stempelWaktu: new Date().toISOString(),
    };
  }

  public static buatCatatanRilis(
    namaAplikasi: string,
    info: InfoVersiMobile,
    daftarFiturBaru: string[] = [],
    daftarPerbaikan: string[] = []
  ): string {
    const garis = '='.repeat(60);
    const fiturText = daftarFiturBaru.length > 0
      ? daftarFiturBaru.map((f) => `  * ${f}`).join('\n')
      : '  * Peningkatan performa dan optimasi sistem.';
    const bugText = daftarPerbaikan.length > 0
      ? daftarPerbaikan.map((b) => `  * ${b}`).join('\n')
      : '  * Perbaikan stabilitas dan kompatibilitas perangkat.';

    return `${garis}
CATATAN RILIS APLIKASI: ${namaAplikasi.toUpperCase()}
Versi          : ${info.versiSemantik}
Saluran Rilis  : ${info.saluran.toUpperCase()}
Android Code   : ${info.kodeVersiAndroid}
iOS Build      : ${info.nomorBuildIOS}
Tanggal Rilis  : ${info.stempelWaktu}
${garis}

[FITUR BARU & PENINGKATAN]
${fiturText}

[PERBAIKAN BUG]
${bugText}

[PETUNJUK DISTRIBUSI]
- Android : Pastikan file release AAB/APK ditandatangani dengan keystore resmi.
- iOS     : Pastikan archive (.xcarchive) divalidasi sebelum diunggah ke TestFlight.
${garis}`;
  }
}
