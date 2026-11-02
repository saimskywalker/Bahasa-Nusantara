/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 40
 * Pengelola Spesifikasi & Aset Ikon Aplikasi Mobile (Icon Manager)
 */

import { SpesifikasiIkonAset } from '../types';

export class IconManager {
  /**
   * Daftar spesifikasi ukuran ikon resmi untuk Android dan iOS.
   */
  public static dapatkanDaftarKebutuhanIkon(): SpesifikasiIkonAset[] {
    return [
      // Android Legacy / Base
      { nama: 'android-mdpi', lebar: 48, tinggi: 48, platform: 'android', skala: 'mdpi', wajib: true },
      { nama: 'android-hdpi', lebar: 72, tinggi: 72, platform: 'android', skala: 'hdpi', wajib: true },
      { nama: 'android-xhdpi', lebar: 96, tinggi: 96, platform: 'android', skala: 'xhdpi', wajib: true },
      { nama: 'android-xxhdpi', lebar: 144, tinggi: 144, platform: 'android', skala: 'xxhdpi', wajib: true },
      { nama: 'android-xxxhdpi', lebar: 192, tinggi: 192, platform: 'android', skala: 'xxxhdpi', wajib: true },
      // Android Play Store Icon
      { nama: 'android-playstore', lebar: 512, tinggi: 512, platform: 'android', skala: 'playstore', wajib: true },
      // Android Adaptive Icon Layers (432x432 px = 108dp @ 4x)
      { nama: 'android-adaptive-foreground', lebar: 432, tinggi: 432, platform: 'android', skala: 'adaptive', wajib: true },
      { nama: 'android-adaptive-background', lebar: 432, tinggi: 432, platform: 'android', skala: 'adaptive', wajib: true },

      // iOS App Store Icon
      { nama: 'ios-appstore', lebar: 1024, tinggi: 1024, platform: 'ios', skala: '1024x1024', wajib: true },
      // iOS iPhone Icons
      { nama: 'ios-iphone-60@2x', lebar: 120, tinggi: 120, platform: 'ios', skala: '2x', wajib: true },
      { nama: 'ios-iphone-60@3x', lebar: 180, tinggi: 180, platform: 'ios', skala: '3x', wajib: true },
      { nama: 'ios-iphone-notification@2x', lebar: 40, tinggi: 40, platform: 'ios', skala: '2x', wajib: false },
      { nama: 'ios-iphone-settings@2x', lebar: 58, tinggi: 58, platform: 'ios', skala: '2x', wajib: false },
      { nama: 'ios-iphone-spotlight@2x', lebar: 80, tinggi: 80, platform: 'ios', skala: '2x', wajib: false },
    ];
  }

  public static buatIsiContentsJsonIOS(): string {
    const assets = [
      { size: '20x20', idiom: 'iphone', scale: '2x', filename: 'icon-20@2x.png' },
      { size: '20x20', idiom: 'iphone', scale: '3x', filename: 'icon-20@3x.png' },
      { size: '29x29', idiom: 'iphone', scale: '2x', filename: 'icon-29@2x.png' },
      { size: '29x29', idiom: 'iphone', scale: '3x', filename: 'icon-29@3x.png' },
      { size: '40x40', idiom: 'iphone', scale: '2x', filename: 'icon-40@2x.png' },
      { size: '40x40', idiom: 'iphone', scale: '3x', filename: 'icon-40@3x.png' },
      { size: '60x60', idiom: 'iphone', scale: '2x', filename: 'icon-60@2x.png' },
      { size: '60x60', idiom: 'iphone', scale: '3x', filename: 'icon-60@3x.png' },
      { size: '1024x1024', idiom: 'ios-marketing', scale: '1x', filename: 'icon-1024.png' },
    ];

    return JSON.stringify(
      {
        images: assets,
        info: { version: 1, author: 'nusantara-mobile-builder' },
      },
      null,
      2
    );
  }
}
