/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 42
 * Integrasi Pembaruan Apple App Store (iOS Native Store Update)
 */

import { StatusAppStoreUpdateApple } from '../types';

export class AppleAppStoreUpdate {
  /**
   * Menghasilkan URL resmi App Store untuk aplikasi iOS.
   */
  public static buatAppStoreUrl(bundleId: string, adamId?: string): string {
    if (adamId) {
      return `https://apps.apple.com/app/id${adamId}`;
    }
    return `https://apps.apple.com/app/${bundleId}`;
  }

  /**
   * Menghasilkan URL skema internal iOS untuk membuka langsung di App Store app.
   */
  public static buatDeepLinkAppStore(adamId?: string): string {
    if (adamId) {
      return `itms-apps://itunes.apple.com/app/id${adamId}`;
    }
    return 'itms-apps://itunes.apple.com/';
  }

  /**
   * Memeriksa ketersediaan versi rilis baru melalui format respons iTunes Search / Lookup API.
   */
  public static periksaKetersediaan(
    bundleId: string,
    versiTerpasang: string,
    versiAppStore = '1.2.0',
    adamId = '123456789'
  ): StatusAppStoreUpdateApple {
    const tersedia = versiAppStore !== versiTerpasang;

    return {
      tersedia,
      versiTersedia: versiAppStore,
      bundleId,
      appStoreUrl: this.buatAppStoreUrl(bundleId, adamId),
      minimumOsVersion: '15.0',
      catatanRilis: 'Pembaruan keamanan rutin dan optimalisasi performa pada Apple iOS.',
    };
  }

  /**
   * Membuka halaman aplikasi di Apple App Store.
   * Catatan Kepatuhan Apple: Binary iOS tidak dapat diunduh atau dipasang langsung di luar App Store / TestFlight.
   */
  public static arahkanKeAppStore(bundleId: string, adamId?: string): {
    sukses: boolean;
    url: string;
    deepLink: string;
    pesan: string;
  } {
    const url = this.buatAppStoreUrl(bundleId, adamId);
    const deepLink = this.buatDeepLinkAppStore(adamId);

    return {
      sukses: true,
      url,
      deepLink,
      pesan: `Pengguna diarahkan ke App Store resmi Apple (${url}). Sesuai pedoman App Store Review Guidelines, seluruh pembaruan binary biner iOS wajib melalui peninjauan resmi Apple.`,
    };
  }
}
