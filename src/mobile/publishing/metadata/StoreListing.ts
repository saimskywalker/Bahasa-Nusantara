/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 41
 * Manajer Berkas Listing Toko Aplikasi (Store Listing File Manager)
 */

import * as fs from 'fs';
import * as path from 'path';
import { MetadataListingLocale, MetadataTokoLengkap } from '../types';
import { AppMetadataManager } from './AppMetadata';

export class StoreListingManager {
  private metadataAktif: MetadataTokoLengkap;

  constructor(metadataAwal?: MetadataTokoLengkap) {
    this.metadataAktif = metadataAwal || AppMetadataManager.buatDefaultMetadata();
  }

  public dapatkanMetadata(): MetadataTokoLengkap {
    return JSON.parse(JSON.stringify(this.metadataAktif));
  }

  public perbaruiListingLocale(locale: string, listing: Partial<MetadataListingLocale>): void {
    const existing = this.metadataAktif.listingPerLocale[locale] || {
      locale: locale as any,
      namaAplikasi: this.metadataAktif.listingPerLocale.id?.namaAplikasi || 'Aplikasi Nusantara',
      deskripsiSingkat: '',
      deskripsiLengkap: '',
      catatanRilis: '',
      kebijakanPrivasiUrl: this.metadataAktif.privasi.kebijakanUrl,
      dukunganUrl: this.metadataAktif.kontak.situsWebResmi,
    };

    this.metadataAktif.listingPerLocale[locale] = {
      ...existing,
      ...listing,
    };
  }

  public hapusListingLocale(locale: string): boolean {
    if (locale === this.metadataAktif.bahasaUtama) return false;
    delete this.metadataAktif.listingPerLocale[locale];
    return true;
  }

  /**
   * Menyimpan struktur metadata toko ke direktori lokal store-metadata/
   */
  public simpanKeDirektori(direktoriUtama = 'store-metadata'): boolean {
    const isNode = typeof window === 'undefined' && typeof process !== 'undefined' && Boolean(process?.versions?.node);
    if (!isNode) return true;

    try {
      const rootDir = typeof process !== 'undefined' && typeof process.cwd === 'function' ? process.cwd() : '.';
      const targetDir = path.resolve(rootDir, direktoriUtama);

      const commonDir = path.join(targetDir, 'common');
      const androidDir = path.join(targetDir, 'android');
      const iosDir = path.join(targetDir, 'ios');

      for (const d of [commonDir, androidDir, iosDir]) {
        if (!(fs as any).existsSync(d)) {
          (fs as any).mkdirSync(d, { recursive: true });
        }
      }

      // 1. Common Files
      (fs as any).writeFileSync(
        path.join(commonDir, 'support.json'),
        JSON.stringify(this.metadataAktif.kontak, null, 2),
        'utf-8'
      );
      (fs as any).writeFileSync(
        path.join(commonDir, 'privacy.json'),
        JSON.stringify(this.metadataAktif.privasi, null, 2),
        'utf-8'
      );

      // 2. Platform Listing Files
      (fs as any).writeFileSync(
        path.join(androidDir, 'listing.json'),
        JSON.stringify(
          {
            kategori: this.metadataAktif.kategoriAndroid,
            bahasaUtama: this.metadataAktif.bahasaUtama,
            listing: this.metadataAktif.listingPerLocale,
          },
          null,
          2
        ),
        'utf-8'
      );

      (fs as any).writeFileSync(
        path.join(iosDir, 'listing.json'),
        JSON.stringify(
          {
            kategori: this.metadataAktif.kategoriIOS,
            ratingUsia: this.metadataAktif.ratingUsia,
            bahasaUtama: this.metadataAktif.bahasaUtama,
            listing: this.metadataAktif.listingPerLocale,
          },
          null,
          2
        ),
        'utf-8'
      );

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Membaca konfigurasi metadata dari direktori lokal jika ada.
   */
  public muatDariDirektori(direktoriUtama = 'store-metadata'): MetadataTokoLengkap {
    const isNode = typeof window === 'undefined' && typeof process !== 'undefined' && Boolean(process?.versions?.node);
    if (!isNode) return this.dapatkanMetadata();

    try {
      const rootDir = typeof process !== 'undefined' && typeof process.cwd === 'function' ? process.cwd() : '.';
      const targetDir = path.resolve(rootDir, direktoriUtama);

      const fileAndroid = path.join(targetDir, 'android', 'listing.json');
      if ((fs as any).existsSync(fileAndroid)) {
        const raw = (fs as any).readFileSync(fileAndroid, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.listing) {
          this.metadataAktif.listingPerLocale = parsed.listing;
        }
        if (parsed.kategori) {
          this.metadataAktif.kategoriAndroid = parsed.kategori;
        }
      }

      const fileSupport = path.join(targetDir, 'common', 'support.json');
      if ((fs as any).existsSync(fileSupport)) {
        const raw = (fs as any).readFileSync(fileSupport, 'utf-8');
        this.metadataAktif.kontak = JSON.parse(raw);
      }

      const filePrivacy = path.join(targetDir, 'common', 'privacy.json');
      if ((fs as any).existsSync(filePrivacy)) {
        const raw = (fs as any).readFileSync(filePrivacy, 'utf-8');
        this.metadataAktif.privasi = JSON.parse(raw);
      }
    } catch {
      // Fallback ke default
    }

    return this.dapatkanMetadata();
  }
}
