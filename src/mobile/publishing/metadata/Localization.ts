/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 41
 * Sistem Lokalisasi & Multibahasa Toko Aplikasi (Store Localization)
 */

import { BahasaListing, MetadataListingLocale } from '../types';

export interface InfoBahasaToko {
  kode: BahasaListing;
  namaLokal: string;
  namaInternasional: string;
  arahTeks: 'ltr' | 'rtl';
  localePlayStore: string;
  localeAppStore: string;
}

export const DAFTAR_BAHASA_TOKO: Record<BahasaListing, InfoBahasaToko> = {
  id: {
    kode: 'id',
    namaLokal: 'Bahasa Indonesia',
    namaInternasional: 'Indonesian',
    arahTeks: 'ltr',
    localePlayStore: 'id',
    localeAppStore: 'id',
  },
  en: {
    kode: 'en',
    namaLokal: 'English (US)',
    namaInternasional: 'English (US)',
    arahTeks: 'ltr',
    localePlayStore: 'en-US',
    localeAppStore: 'en-US',
  },
  ms: {
    kode: 'ms',
    namaLokal: 'Bahasa Melayu',
    namaInternasional: 'Malay',
    arahTeks: 'ltr',
    localePlayStore: 'ms',
    localeAppStore: 'ms',
  },
  ar: {
    kode: 'ar',
    namaLokal: 'العربية',
    namaInternasional: 'Arabic',
    arahTeks: 'rtl',
    localePlayStore: 'ar',
    localeAppStore: 'ar-SA',
  },
  ja: {
    kode: 'ja',
    namaLokal: '日本語',
    namaInternasional: 'Japanese',
    arahTeks: 'ltr',
    localePlayStore: 'ja-JP',
    localeAppStore: 'ja',
  },
  zh: {
    kode: 'zh',
    namaLokal: '简体中文',
    namaInternasional: 'Chinese (Simplified)',
    arahTeks: 'ltr',
    localePlayStore: 'zh-CN',
    localeAppStore: 'zh-Hans',
  },
  es: {
    kode: 'es',
    namaLokal: 'Español',
    namaInternasional: 'Spanish',
    arahTeks: 'ltr',
    localePlayStore: 'es-419',
    localeAppStore: 'es-MX',
  },
};

export class LocalizationManager {
  public static dapatkanDaftarBahasa(): InfoBahasaToko[] {
    return Object.values(DAFTAR_BAHASA_TOKO);
  }

  public static dapatkanInfoBahasa(kode: string): InfoBahasaToko | undefined {
    return DAFTAR_BAHASA_TOKO[kode as BahasaListing];
  }

  /**
   * Memeriksa kelengkapan terjemahan untuk semua locale yang didaftarkan.
   */
  public static validasiKelengkapan(
    listingPerLocale: Record<string, MetadataListingLocale>,
    bahasaWajib: BahasaListing[] = ['id', 'en']
  ): {
    lengkap: boolean;
    bahasaHilang: BahasaListing[];
    terjemahanPerluDitinjau: string[];
    detail: Record<string, { adaNama: boolean; adaDeskripsi: boolean; adaCatatanRilis: boolean }>;
  } {
    const bahasaHilang: BahasaListing[] = [];
    const terjemahanPerluDitinjau: string[] = [];
    const detail: Record<string, any> = {};

    for (const b of bahasaWajib) {
      if (!listingPerLocale[b]) {
        bahasaHilang.push(b);
      }
    }

    for (const [loc, listing] of Object.entries(listingPerLocale)) {
      const adaNama = Boolean(listing.namaAplikasi && listing.namaAplikasi.trim().length > 0);
      const adaDeskripsi = Boolean(listing.deskripsiLengkap && listing.deskripsiLengkap.trim().length > 0);
      const adaCatatanRilis = Boolean(listing.catatanRilis && listing.catatanRilis.trim().length > 0);

      detail[loc] = { adaNama, adaDeskripsi, adaCatatanRilis };

      // Deteksi jika masih memuat teks placeholder otomatis
      if (
        listing.namaAplikasi?.toLowerCase().includes('placeholder') ||
        listing.deskripsiLengkap?.toLowerCase().includes('lorem ipsum') ||
        listing.deskripsiLengkap?.toLowerCase().includes('tulis deskripsi')
      ) {
        terjemahanPerluDitinjau.push(
          `Locale '${loc}' memuat placeholder yang belum ditinjau oleh penerjemah.`
        );
      }
    }

    return {
      lengkap: bahasaHilang.length === 0,
      bahasaHilang,
      terjemahanPerluDitinjau,
      detail,
    };
  }

  /**
   * Membuat fallback metadata otomatis dari bahasa utama (Indonesian) ke bahasa target jika belum ada.
   */
  public static buatListingFallback(
    sumber: MetadataListingLocale,
    targetLocale: BahasaListing
  ): MetadataListingLocale {
    const info = this.dapatkanInfoBahasa(targetLocale);
    const labelBahasa = info ? ` [${info.namaInternasional}]` : '';

    return {
      locale: targetLocale,
      namaAplikasi: sumber.namaAplikasi,
      judulSubtitle: sumber.judulSubtitle,
      deskripsiSingkat: sumber.deskripsiSingkat,
      deskripsiLengkap: sumber.deskripsiLengkap,
      kataKunci: sumber.kataKunci ? [...sumber.kataKunci] : [],
      catatanRilis: `${sumber.catatanRilis}${labelBahasa}`,
      kebijakanPrivasiUrl: sumber.kebijakanPrivasiUrl,
      dukunganUrl: sumber.dukunganUrl,
      pemasaranUrl: sumber.pemasaranUrl,
    };
  }
}
