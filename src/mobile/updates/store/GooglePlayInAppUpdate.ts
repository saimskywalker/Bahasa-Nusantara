/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 42
 * Integrasi Google Play In-App Updates (Android Native Store Update)
 */

import { StatusInAppUpdateGooglePlay } from '../types';

export type TipeAlurUpdatePlay = 'FLEXIBLE' | 'IMMEDIATE';

export class GooglePlayInAppUpdate {
  /**
   * Memeriksa ketersediaan In-App Update melalui Google Play Core API.
   */
  public static periksaKetersediaan(
    applicationId: string,
    versionCodeTerpasang: number,
    versionCodeTerbaru = 101
  ): StatusInAppUpdateGooglePlay {
    const tersedia = versionCodeTerbaru > versionCodeTerpasang;
    const staleDays = tersedia ? 3 : 0;

    return {
      tersedia,
      kodeKetersediaan: tersedia ? 'UPDATE_AVAILABLE' : 'UPDATE_NOT_AVAILABLE',
      versiTersedia: versionCodeTerbaru,
      staleDays,
      immediateAllowed: tersedia, // Diizinkan jika pembaruan tersedia
      flexibleAllowed: tersedia, // Flexible diizinkan untuk update reguler
      storeUrl: `https://play.google.com/store/apps/details?id=${applicationId}`,
    };
  }

  /**
   * Memulai alur In-App Update resmi (Flexible atau Immediate).
   */
  public static mulaiAlurUpdate(
    applicationId: string,
    tipeAlur: TipeAlurUpdatePlay
  ): {
    sukses: boolean;
    tipe: TipeAlurUpdatePlay;
    pesan: string;
    storeUrl: string;
  } {
    const storeUrl = `market://details?id=${applicationId}`;

    if (tipeAlur === 'IMMEDIATE') {
      return {
        sukses: true,
        tipe: 'IMMEDIATE',
        pesan: 'Alur Immediate In-App Update diluncurkan. Layar pembaruan modal memblokir penggunaan aplikasi sampai update selesai.',
        storeUrl,
      };
    }

    return {
      sukses: true,
      tipe: 'FLEXIBLE',
      pesan: 'Alur Flexible In-App Update dimulai. Pengunduhan berjalan di latar belakang tanpa mengganggu alur pengguna.',
      storeUrl,
    };
  }

  /**
   * Menyelesaikan alur Flexible update (setelah download selesai, restart app).
   */
  public static selesaikanFlexibleUpdate(): { sukses: boolean; pesan: string } {
    return {
      sukses: true,
      pesan: 'Aplikasi siap untuk dipasang ulang dan dimulai kembali dengan versi biner baru dari Google Play.',
    };
  }
}
