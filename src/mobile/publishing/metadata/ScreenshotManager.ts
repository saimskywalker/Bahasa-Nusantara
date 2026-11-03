/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 41
 * Manajer Aset Grafis & Screenshot Toko Aplikasi (Store Screenshot & Asset Manager)
 */

import {
  TipeAsetToko,
  SpesifikasiAsetToko,
  BerkasAsetToko,
  HasilValidasiAsetToko,
  BahasaListing,
} from '../types';

export const SPESIFIKASI_ASET_RESMI: Record<TipeAsetToko, SpesifikasiAsetToko> = {
  ikon_aplikasi: {
    tipe: 'ikon_aplikasi',
    platform: 'android',
    lebarMin: 512,
    lebarMax: 512,
    tinggiMin: 512,
    tinggiMax: 512,
    rasioDiperlukan: '1:1',
    formatDidukung: ['png'],
    ukuranMaksKb: 1024,
    wajib: true,
    deskripsi: 'Ikon aplikasi resolusi tinggi 512x512 PNG 32-bit.',
  },
  grafik_fitur_android: {
    tipe: 'grafik_fitur_android',
    platform: 'android',
    lebarMin: 1024,
    lebarMax: 1024,
    tinggiMin: 500,
    tinggiMax: 500,
    rasioDiperlukan: '1024:500',
    formatDidukung: ['jpeg', 'png'],
    ukuranMaksKb: 15360,
    wajib: true,
    deskripsi: 'Grafik fitur Google Play Store ukuran tepat 1024x500.',
  },
  screenshot_ponsel_android: {
    tipe: 'screenshot_ponsel_android',
    platform: 'android',
    lebarMin: 320,
    lebarMax: 3840,
    tinggiMin: 320,
    tinggiMax: 3840,
    formatDidukung: ['jpeg', 'png'],
    ukuranMaksKb: 8192,
    wajib: true,
    deskripsi: 'Tangkapan layar ponsel Android (minimal 2, maksimal 8 buah).',
  },
  screenshot_tablet_7_android: {
    tipe: 'screenshot_tablet_7_android',
    platform: 'android',
    lebarMin: 600,
    lebarMax: 3840,
    tinggiMin: 600,
    tinggiMax: 3840,
    formatDidukung: ['jpeg', 'png'],
    ukuranMaksKb: 8192,
    wajib: false,
    deskripsi: 'Tangkapan layar tablet Android 7 inci.',
  },
  screenshot_tablet_10_android: {
    tipe: 'screenshot_tablet_10_android',
    platform: 'android',
    lebarMin: 1024,
    lebarMax: 3840,
    tinggiMin: 1024,
    tinggiMax: 3840,
    formatDidukung: ['jpeg', 'png'],
    ukuranMaksKb: 8192,
    wajib: false,
    deskripsi: 'Tangkapan layar tablet Android 10 inci.',
  },
  screenshot_iphone_6_7: {
    tipe: 'screenshot_iphone_6_7',
    platform: 'ios',
    lebarMin: 1290,
    lebarMax: 1290,
    tinggiMin: 2796,
    tinggiMax: 2796,
    rasioDiperlukan: '1290:2796',
    formatDidukung: ['jpeg', 'png'],
    ukuranMaksKb: 10240,
    wajib: true,
    deskripsi: 'Tangkapan layar iPhone 6.7" (iPhone 14/15/16 Pro Max - 1290x2796).',
  },
  screenshot_iphone_6_5: {
    tipe: 'screenshot_iphone_6_5',
    platform: 'ios',
    lebarMin: 1242,
    lebarMax: 1284,
    tinggiMin: 2688,
    tinggiMax: 2778,
    formatDidukung: ['jpeg', 'png'],
    ukuranMaksKb: 10240,
    wajib: false,
    deskripsi: 'Tangkapan layar iPhone 6.5" (1242x2688 atau 1284x2778).',
  },
  screenshot_iphone_5_5: {
    tipe: 'screenshot_iphone_5_5',
    platform: 'ios',
    lebarMin: 1242,
    lebarMax: 1242,
    tinggiMin: 2208,
    tinggiMax: 2208,
    rasioDiperlukan: '1242:2208',
    formatDidukung: ['jpeg', 'png'],
    ukuranMaksKb: 10240,
    wajib: false,
    deskripsi: 'Tangkapan layar iPhone 5.5" (1242x2208).',
  },
  screenshot_ipad_pro_12_9: {
    tipe: 'screenshot_ipad_pro_12_9',
    platform: 'ios',
    lebarMin: 2048,
    lebarMax: 2048,
    tinggiMin: 2732,
    tinggiMax: 2732,
    rasioDiperlukan: '2048:2732',
    formatDidukung: ['jpeg', 'png'],
    ukuranMaksKb: 10240,
    wajib: false,
    deskripsi: 'Tangkapan layar iPad Pro 12.9" (2048x2732).',
  },
};

export class ScreenshotManager {
  /**
   * Validasi spesifikasi berkas gambar terhadap standar toko aplikasi.
   */
  public static validasiBerkasAset(aset: BerkasAsetToko): { valid: boolean; daftarGalat: string[] } {
    const spec = SPESIFIKASI_ASET_RESMI[aset.tipe];
    const daftarGalat: string[] = [];

    if (!spec) {
      return { valid: false, daftarGalat: [`Tipe aset '${aset.tipe}' tidak dikenali.`] };
    }

    // 1. Validasi format
    if (!spec.formatDidukung.includes(aset.format)) {
      daftarGalat.push(
        `Format '${aset.format}' tidak didukung untuk ${spec.deskripsi}. Format sah: ${spec.formatDidukung.join(', ')}.`
      );
    }

    // 2. Validasi dimensi lebar
    if (aset.lebar < spec.lebarMin || aset.lebar > spec.lebarMax) {
      daftarGalat.push(
        `Lebar (${aset.lebar}px) tidak memenuhi syarat (${spec.lebarMin}px - ${spec.lebarMax}px).`
      );
    }

    // 3. Validasi dimensi tinggi
    if (aset.tinggi < spec.tinggiMin || aset.tinggi > spec.tinggiMax) {
      daftarGalat.push(
        `Tinggi (${aset.tinggi}px) tidak memenuhi syarat (${spec.tinggiMin}px - ${spec.tinggiMax}px).`
      );
    }

    // 4. Validasi ukuran file
    if (aset.ukuranKb > spec.ukuranMaksKb) {
      daftarGalat.push(
        `Ukuran berkas (${aset.ukuranKb} KB) melebihi batas maksimal (${spec.ukuranMaksKb} KB).`
      );
    }

    return {
      valid: daftarGalat.length === 0,
      daftarGalat,
    };
  }

  /**
   * Memeriksa kumpulan aset proyek terhadap checklist kelayakan toko aplikasi.
   */
  public static validasiSemuaAset(
    daftarAset: BerkasAsetToko[],
    platformTarget: 'android' | 'ios' | 'keduanya' = 'keduanya'
  ): HasilValidasiAsetToko {
    const pesanPeringatan: string[] = [];
    const daftarGalat: string[] = [];
    const asetWajibKurang: TipeAsetToko[] = [];

    let asetValid = 0;
    let asetTidakValid = 0;

    // Periksa aset wajib
    const wajibAndroid: TipeAsetToko[] = ['ikon_aplikasi', 'grafik_fitur_android', 'screenshot_ponsel_android'];
    const wajibIOS: TipeAsetToko[] = ['ikon_aplikasi', 'screenshot_iphone_6_7'];

    const asetTersediaTipe = new Set(daftarAset.map((a) => a.tipe));

    if (platformTarget === 'android' || platformTarget === 'keduanya') {
      for (const w of wajibAndroid) {
        if (!asetTersediaTipe.has(w)) {
          asetWajibKurang.push(w);
          daftarGalat.push(`Aset wajib Android '${w}' (${SPESIFIKASI_ASET_RESMI[w].deskripsi}) belum tersedia.`);
        }
      }
    }

    if (platformTarget === 'ios' || platformTarget === 'keduanya') {
      for (const w of wajibIOS) {
        if (!asetTersediaTipe.has(w)) {
          if (!asetWajibKurang.includes(w)) {
            asetWajibKurang.push(w);
          }
          daftarGalat.push(`Aset wajib iOS '${w}' (${SPESIFIKASI_ASET_RESMI[w].deskripsi}) belum tersedia.`);
        }
      }
    }

    // Hitung validasi masing-masing aset
    for (const aset of daftarAset) {
      const res = this.validasiBerkasAset(aset);
      if (res.valid) {
        asetValid++;
      } else {
        asetTidakValid++;
        for (const g of res.daftarGalat) {
          daftarGalat.push(`[${aset.jalurBerkas}] ${g}`);
        }
      }
    }

    return {
      valid: daftarGalat.length === 0 && asetWajibKurang.length === 0,
      totalAset: daftarAset.length,
      asetValid,
      asetTidakValid,
      asetWajibKurang,
      daftarAset,
      pesanPeringatan,
      daftarGalat,
    };
  }

  /**
   * Membuat daftar mock aset standar untuk simulator dan pengujian.
   */
  public static buatMockDaftarAset(locale: BahasaListing = 'id'): BerkasAsetToko[] {
    return [
      {
        tipe: 'ikon_aplikasi',
        platform: 'android',
        locale,
        jalurBerkas: 'aset/ikon/app-icon-512.png',
        lebar: 512,
        tinggi: 512,
        ukuranKb: 180,
        format: 'png',
        valid: true,
        pesanValidasi: [],
      },
      {
        tipe: 'grafik_fitur_android',
        platform: 'android',
        locale,
        jalurBerkas: 'aset/grafik/feature-graphic.png',
        lebar: 1024,
        tinggi: 500,
        ukuranKb: 450,
        format: 'png',
        valid: true,
        pesanValidasi: [],
      },
      {
        tipe: 'screenshot_ponsel_android',
        platform: 'android',
        locale,
        jalurBerkas: 'aset/screenshots/android-1.png',
        lebar: 1080,
        tinggi: 1920,
        ukuranKb: 620,
        format: 'png',
        valid: true,
        pesanValidasi: [],
      },
      {
        tipe: 'screenshot_iphone_6_7',
        platform: 'ios',
        locale,
        jalurBerkas: 'aset/screenshots/iphone-6-7-1.png',
        lebar: 1290,
        tinggi: 2796,
        ukuranKb: 890,
        format: 'png',
        valid: true,
        pesanValidasi: [],
      },
    ];
  }
}
