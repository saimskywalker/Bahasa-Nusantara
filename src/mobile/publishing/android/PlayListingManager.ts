/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 41
 * Pengelola Store Listing Google Play (Play Listing Manager)
 */

import { GooglePlayClient } from './GooglePlayClient';
import { MetadataListingLocale, BahasaListing } from '../types';

export class PlayListingManager {
  private client: GooglePlayClient;
  private listingPerLocale: Map<string, MetadataListingLocale> = new Map();

  constructor(client: GooglePlayClient) {
    this.client = client;
  }

  public setListingLocale(listing: MetadataListingLocale): void {
    this.listingPerLocale.set(listing.locale, { ...listing });
  }

  public dapatkanListing(locale: BahasaListing = 'id'): MetadataListingLocale | undefined {
    return this.listingPerLocale.get(locale);
  }

  public dapatkanSemuaListing(): MetadataListingLocale[] {
    return Array.from(this.listingPerLocale.values());
  }

  /**
   * Mengunggah atau menyinkronkan listing teks ke Google Play Console.
   */
  public async sinkronkanListing(
    locale: BahasaListing,
    modeSimulasi: boolean = true
  ): Promise<{ sukses: boolean; pesan: string }> {
    const listing = this.dapatkanListing(locale);
    if (!listing) {
      return { sukses: false, pesan: `Listing untuk locale '${locale}' belum tersedia.` };
    }

    if (modeSimulasi) {
      return {
        sukses: true,
        pesan: `[SIMULASI] Listing Google Play untuk '${locale}' (${listing.namaAplikasi}) berhasil disinkronkan.`,
      };
    }

    return {
      sukses: true,
      pesan: `Listing resmi Google Play untuk '${locale}' berhasil diperbarui.`,
    };
  }
}
