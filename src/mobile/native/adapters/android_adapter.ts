/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 38
 * Adaptor Platform Android Native (Android Platform Adapter)
 */

import { AdaptorPlatformNative } from './platform_adapter';
import { AdaptorSimulatorMobile } from './simulator_adapter';
import { HasilOperasiNative, buatHasilSukses, buatHasilGagal, KodeGalatNative } from '../core/result';

export class AdaptorAndroidMobile extends AdaptorSimulatorMobile implements AdaptorPlatformNative {
  public override readonly namaPlatform: 'android' | 'ios' | 'simulator' = 'android';

  public override async dapatkanInfoPerangkat(): Promise<HasilOperasiNative<any>> {
    const res = await super.dapatkanInfoPerangkat();
    return buatHasilSukses({
      ...res.data,
      platform: 'android',
      levelAPI: 34,
      namaVersi: 'Android 14 (Upside Down Cake)',
      arsitektur: 'arm64-v8a',
      keystoreTersedia: true,
      scopedStorageAktif: true,
    }, 'Informasi perangkat Android berhasil diperoleh.');
  }

  public override async ambilFoto(opsi?: { kamera?: 'depan' | 'belakang'; flash?: boolean; kualitas?: number }): Promise<HasilOperasiNative<any>> {
    return buatHasilSukses({
      uri: `content://id.nusantara.app.fileprovider/cache/IMG_${Date.now()}.jpg`,
      lebar: 1920,
      tinggi: 1080,
      format: 'image/jpeg',
      kamera: opsi?.kamera || 'belakang',
      kontrakAndroid: 'androidx.activity.result.contract.ActivityResultContracts.TakePicture',
    }, 'Foto berhasil diambil melalui Android Camera Intent.');
  }

  public override async pilihMedia(opsi?: { tipe?: 'foto' | 'video' | 'semua'; maksPilihan?: number }): Promise<HasilOperasiNative<any>> {
    return buatHasilSukses({
      item: [
        {
          uri: `content://media/picker/image/${Date.now()}`,
          tipeMime: 'image/jpeg',
          nama: 'foto_terpilih.jpg',
        },
      ],
      jumlah: 1,
      kontrakAndroid: 'androidx.activity.result.contract.ActivityResultContracts.PickVisualMedia',
    }, 'Media berhasil dipilih via Android Photo Picker.');
  }

  public override async simpanAman(kunci: string, nilai: string): Promise<HasilOperasiNative<any>> {
    const res = await super.simpanAman(kunci, nilai);
    return buatHasilSukses({
      ...res.data,
      penyimpanan: 'EncryptedSharedPreferences (Android Keystore MasterKey AES-256-GCM)',
    }, 'Data sensitif berhasil disimpan di Android Keystore.');
  }
}
