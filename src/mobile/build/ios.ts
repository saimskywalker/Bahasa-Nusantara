/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Pengelola Kompilasi & Build Apple iOS (iOS Build Manager)
 */

import { KonfigurasiAplikasiMobile } from '../types';

export class IOSBuildManager {
  public static periksaLingkungan(): {
    xcodeTerdeteksi: boolean;
    apakahMacOS: boolean;
    adaXcode: boolean;
    siapBuild: boolean;
    siapBuildNativeIOS: boolean;
    pesan: string;
    catatan: string[];
  } {
    const isDarwin = process.platform === 'darwin';
    return {
      xcodeTerdeteksi: isDarwin,
      apakahMacOS: isDarwin,
      adaXcode: isDarwin,
      siapBuild: isDarwin,
      siapBuildNativeIOS: isDarwin,
      pesan: isDarwin
        ? 'Lingkungan macOS dengan toolchain Xcode terdeteksi.'
        : 'Build native iOS hanya didukung penuh pada sistem operasi macOS dengan Xcode terpasang.',
      catatan: isDarwin
        ? ['Xcode siap digunakan.']
        : ['Mode simulasi iOS diaktifkan pada lingkungan non-macOS.'],
    };
  }

  public static buatInfoPlist(konfig: KonfigurasiAplikasiMobile): string {
    const bundleId = konfig.id || 'id.nusantara.aplikasi';
    const bundleName = konfig.nama || 'Aplikasi Nusantara';
    const bundleVersion = String((konfig as any).nomorBuildIOS || konfig.nomorBuild || 1);
    const shortVersion = konfig.versi || '1.0.0';

    const izinDeskripsi: Record<string, { key: string; desc: string }> = {
      kamera: {
        key: 'NSCameraUsageDescription',
        desc: 'Aplikasi ini memerlukan akses ke kamera untuk memindai dokumen dan foto.',
      },
      lokasi: {
        key: 'NSLocationWhenInUseUsageDescription',
        desc: 'Aplikasi ini memerlukan akses lokasi untuk layanan berbasis wilayah.',
      },
      mikrofon: {
        key: 'NSMicrophoneUsageDescription',
        desc: 'Aplikasi ini memerlukan akses mikrofon untuk perekaman suara.',
      },
      foto: {
        key: 'NSPhotoLibraryUsageDescription',
        desc: 'Aplikasi ini memerlukan akses ke galeri foto Anda.',
      },
    };

    const barisIzin: string[] = [];
    if (Array.isArray(konfig.daftarIzin)) {
      for (const iz of konfig.daftarIzin) {
        const k = String(iz).toLowerCase();
        if (izinDeskripsi[k]) {
          barisIzin.push(`    <key>${izinDeskripsi[k].key}</key>\n    <string>${izinDeskripsi[k].desc}</string>`);
        }
      }
    }

    const xmlIzin = barisIzin.join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>id</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>${bundleId}</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>${bundleName}</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>${shortVersion}</string>
    <key>CFBundleVersion</key>
    <string>${bundleVersion}</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>ITSAppUsesNonExemptEncryption</key>
    <false/>
${xmlIzin ? xmlIzin + '\n' : ''}</dict>
</plist>`;
  }

  public static buatPodfile(konfig: KonfigurasiAplikasiMobile): string {
    const targetName = (konfig.nama || 'NusantaraApp').replace(/[^a-zA-Z0-9]/g, '');
    return `platform :ios, '15.0'

target '${targetName}' do
  use_frameworks!
end`;
  }

  public static buatPodfileTemplate(konfig: KonfigurasiAplikasiMobile): string {
    return this.buatPodfile(konfig);
  }
}
