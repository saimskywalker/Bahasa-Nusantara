/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 40
 * Validator Aset Gambar & Ikon Mobile (Asset Validator)
 */

import * as fs from 'fs';
import * as path from 'path';
import { KonfigurasiDistribusiLengkap } from '../types';
import { IconManager } from './IconManager';

export interface HasilValidasiAset {
  valid: boolean;
  totalAsetDiperiksa: number;
  asetLulus: number;
  asetHilang: string[];
  peringatan: string[];
  daftarGalat: string[];
}

export class AssetValidator {
  private static readonly EKSTENSI_SAH = new Set(['.png', '.webp', '.jpg', '.jpeg', '.svg']);
  private static readonly MAKS_UKURAN_IKON_BYTES = 2 * 1024 * 1024; // 2 MB
  private static readonly MAKS_UKURAN_SPLASH_BYTES = 5 * 1024 * 1024; // 5 MB

  public static validasiAsetProyek(konfig: KonfigurasiDistribusiLengkap): HasilValidasiAset {
    const asetHilang: string[] = [];
    const peringatan: string[] = [];
    const daftarGalat: string[] = [];
    let totalAsetDiperiksa = 0;
    let asetLulus = 0;

    // 1. Validasi Ikon Utama
    totalAsetDiperiksa++;
    const jalurIkon = konfig.aset.ikonUtama;
    if (!jalurIkon) {
      daftarGalat.push('Jalur berkas ikon utama (ikonUtama) belum ditentukan dalam konfigurasi.');
    } else {
      const ext = path.extname(jalurIkon).toLowerCase();
      if (!this.EKSTENSI_SAH.has(ext)) {
        daftarGalat.push(`Format file ikon utama '${ext}' tidak didukung. Gunakan PNG, WebP, atau SVG.`);
      }

      if (fs.existsSync(jalurIkon)) {
        const stat = fs.statSync(jalurIkon);
        if (stat.size > this.MAKS_UKURAN_IKON_BYTES) {
          peringatan.push(`Ukuran file ikon (${(stat.size / 1024).toFixed(1)} KB) melebihi rekomendasi 2 MB.`);
        }
        asetLulus++;
      } else {
        asetHilang.push(jalurIkon);
        peringatan.push(`File ikon utama '${jalurIkon}' belum ada di disk.`);
      }
    }

    // 2. Validasi Splash Screen Utama
    totalAsetDiperiksa++;
    const jalurSplash = konfig.aset.splashUtama;
    if (!jalurSplash) {
      peringatan.push('Jalur file splash screen utama belum ditentukan. Akan menggunakan splash default.');
    } else {
      if (fs.existsSync(jalurSplash)) {
        const stat = fs.statSync(jalurSplash);
        if (stat.size > this.MAKS_UKURAN_SPLASH_BYTES) {
          peringatan.push(`Ukuran splash screen (${(stat.size / 1024).toFixed(1)} KB) melebihi batas 5 MB.`);
        }
        asetLulus++;
      } else {
        asetHilang.push(jalurSplash);
        peringatan.push(`File splash screen '${jalurSplash}' belum ada di disk.`);
      }
    }

    // 3. Pemeriksaan Daftar Spesifikasi Ikon
    const daftarKebutuhan = IconManager.dapatkanDaftarKebutuhanIkon();
    const wajibSaja = daftarKebutuhan.filter((k) => k.wajib);

    return {
      valid: daftarGalat.length === 0,
      totalAsetDiperiksa: totalAsetDiperiksa + wajibSaja.length,
      asetLulus,
      asetHilang,
      peringatan,
      daftarGalat,
    };
  }

  public static validasiDimensi(
    lebar: number,
    tinggi: number,
    tipe: 'ikon' | 'splash'
  ): { valid: boolean; pesan?: string } {
    if (lebar <= 0 || tinggi <= 0) {
      return { valid: false, pesan: 'Dimensi lebar dan tinggi harus lebih besar dari 0.' };
    }

    if (tipe === 'ikon' && lebar !== tinggi) {
      return {
        valid: false,
        pesan: `Ikon aplikasi harus memiliki aspek rasio 1:1 (persegi). Diberikan: ${lebar}x${tinggi}.`,
      };
    }

    return { valid: true };
  }
}
