/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Sistem Konfigurasi Aplikasi Mobile (Mobile App Configuration & Validation)
 */

import { KonfigurasiAplikasiMobile } from '../types';

export const POLA_PACKAGE_ID_VALID = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/i;
export const POLA_VERSI_SEMVER = /^\d+\.\d+\.\d+(-[a-z0-9.]+)?$/i;

export interface HasilValidasiKonfigurasiMobile {
  sah: boolean;
  valid: boolean;
  daftarGalat: string[];
  galat: string[];
}

export class PengelolaKonfigurasiMobile {
  public static validasi(konfig: Partial<KonfigurasiAplikasiMobile>): HasilValidasiKonfigurasiMobile {
    const daftarGalat: string[] = [];

    if (!konfig.nama || !konfig.nama.trim()) {
      daftarGalat.push("Nama aplikasi ('nama') wajib diisi.");
    }

    if (!konfig.id || !konfig.id.trim()) {
      daftarGalat.push("ID aplikasi ('id') wajib diisi.");
    } else if (!POLA_PACKAGE_ID_VALID.test(konfig.id)) {
      daftarGalat.push(`ID aplikasi '${konfig.id}' tidak valid. Format harus seperti 'id.nusantara.aplikasi' (minimal 2 segmen terpisah titik).`);
    }

    if (!konfig.versi || !konfig.versi.trim()) {
      daftarGalat.push("Versi aplikasi ('versi') wajib diisi.");
    } else if (!POLA_VERSI_SEMVER.test(konfig.versi)) {
      daftarGalat.push(`Format versi '${konfig.versi}' tidak valid. Format semver disyaratkan (misal: '1.0.0').`);
    }

    if (konfig.nomorBuild !== undefined && (typeof konfig.nomorBuild !== 'number' || konfig.nomorBuild < 1)) {
      daftarGalat.push("Nomor build ('nomorBuild') harus berupa bilangan bulat positif >= 1.");
    }

    if (konfig.platformTarget) {
      if (!konfig.platformTarget.android && !konfig.platformTarget.ios) {
        daftarGalat.push("Minimal satu platform target (android atau ios) harus diaktifkan.");
      }
    }

    return {
      sah: daftarGalat.length === 0,
      valid: daftarGalat.length === 0,
      daftarGalat,
      galat: daftarGalat,
    };
  }

  public static buatKonfigurasiBawaan(nama: string = 'Aplikasi Nusantara Mobile', id?: string): KonfigurasiAplikasiMobile {
    const idAplikasi = id || `id.nusantara.${nama.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    return {
      nama,
      id: idAplikasi,
      versi: '1.0.0',
      nomorBuild: 1,
      deskripsi: 'Aplikasi mobile dibuat dengan NUSANTARA Mobile Application Framework',
      pengembang: 'Pengembang NUSANTARA',
      orientasi: 'otomatis',
      temaAwal: 'terang',
      platformTarget: {
        android: true,
        ios: true,
      },
      versiMinPlatform: {
        androidMinSdk: 24,
        androidTargetSdk: 34,
        iosDeploymentTarget: '15.0',
      },
      daftarIzin: ['internet'],
      daftarAset: ['assets/icons/app_icon.png'],
    };
  }
}
