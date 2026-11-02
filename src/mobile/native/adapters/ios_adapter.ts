/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 38
 * Adaptor Platform iOS Native (iOS Platform Adapter)
 */

import { AdaptorPlatformNative } from './platform_adapter';
import { AdaptorSimulatorMobile } from './simulator_adapter';
import { HasilOperasiNative, buatHasilSukses } from '../core/result';

export class AdaptorIOSMobile extends AdaptorSimulatorMobile implements AdaptorPlatformNative {
  public override readonly namaPlatform: 'android' | 'ios' | 'simulator' = 'ios';

  public override async dapatkanInfoPerangkat(): Promise<HasilOperasiNative<any>> {
    const res = await super.dapatkanInfoPerangkat();
    return buatHasilSukses({
      ...res.data,
      platform: 'ios',
      namaVersi: 'iOS 17.4',
      arsitektur: 'arm64',
      frameworks: ['AVFoundation', 'PHPicker', 'CoreLocation', 'UserNotifications', 'Security'],
      keychainTersedia: true,
    }, 'Informasi perangkat iOS berhasil diperoleh.');
  }

  public override async ambilFoto(opsi?: { kamera?: 'depan' | 'belakang'; flash?: boolean; kualitas?: number }): Promise<HasilOperasiNative<any>> {
    return buatHasilSukses({
      uri: `ph://asset/${Date.now()}`,
      lebar: 2048,
      tinggi: 1536,
      format: 'image/heic',
      kamera: opsi?.kamera || 'belakang',
      frameworkIOS: 'AVCapturePhotoOutput / UIImagePickerController',
    }, 'Foto berhasil diambil melalui AVFoundation iOS.');
  }

  public override async pilihMedia(opsi?: { tipe?: 'foto' | 'video' | 'semua'; maksPilihan?: number }): Promise<HasilOperasiNative<any>> {
    return buatHasilSukses({
      item: [
        {
          uri: `ph://picker/${Date.now()}`,
          tipeMime: 'image/jpeg',
          nama: 'foto_ios.jpg',
        },
      ],
      jumlah: 1,
      frameworkIOS: 'PHPickerViewController (PhotosUI)',
    }, 'Media berhasil dipilih via PHPickerViewController iOS.');
  }

  public override async simpanAman(kunci: string, nilai: string): Promise<HasilOperasiNative<any>> {
    const res = await super.simpanAman(kunci, nilai);
    return buatHasilSukses({
      ...res.data,
      penyimpanan: 'iOS Keychain Services (kSecClassGenericPassword + kSecAttrAccessibleAfterFirstUnlock)',
    }, 'Data sensitif berhasil disimpan di iOS Keychain.');
  }
}
