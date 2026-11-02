/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 40
 * Fasad Utama Mobile App Distribution & Publishing (Distribution Manager)
 */

import {
  KonfigurasiDistribusiLengkap,
  LaporanValidasiRilis,
  LingkunganDistribusi,
  SaluranRilis,
} from '../types';
import { PengelolaKonfigurasiDistribusi } from '../config/DistributionConfig';
import { VersionManager } from './VersionManager';
import { AndroidDistributionManager } from '../android/AndroidBuildManager';
import { IOSDistributionManager } from '../ios/IOSBuildManager';
import { ReleaseValidator } from '../validation/ReleaseValidator';
import { ReleaseManager, HasilEksekusiRilis } from './ReleaseManager';
import { AssetValidator } from '../assets/AssetValidator';

export class DistributionManager {
  private static instance: DistributionManager;
  private configManager: PengelolaKonfigurasiDistribusi;

  private constructor() {
    this.configManager = PengelolaKonfigurasiDistribusi.dapatkanInstance();
  }

  public static dapatkanInstance(): DistributionManager {
    if (!DistributionManager.instance) {
      DistributionManager.instance = new DistributionManager();
    }
    return DistributionManager.instance;
  }

  public dapatkanKonfigurasi(): KonfigurasiDistribusiLengkap {
    return this.configManager.dapatkanKonfigurasi();
  }

  public aturLingkungan(env: LingkunganDistribusi): KonfigurasiDistribusiLengkap {
    return this.configManager.setLingkungan(env);
  }

  public periksaLingkunganSistem() {
    return {
      android: AndroidDistributionManager.periksaLingkungan(),
      ios: IOSDistributionManager.periksaLingkungan(),
    };
  }

  public validasiKesiapanRilis(): LaporanValidasiRilis {
    return ReleaseValidator.periksaKesiapanRilis(this.dapatkanKonfigurasi());
  }

  public validasiAset() {
    return AssetValidator.validasiAsetProyek(this.dapatkanKonfigurasi());
  }

  public naikkanVersi(tipe: 'mayor' | 'minor' | 'patch', saluran: SaluranRilis = 'produksi') {
    const konfig = this.dapatkanKonfigurasi();
    const infoBaru = VersionManager.naikkanVersi(
      konfig.aplikasi.versi,
      konfig.aplikasi.kodeVersiAndroid,
      konfig.aplikasi.nomorBuild,
      tipe,
      saluran
    );

    this.configManager.perbaruiKonfigurasi({
      aplikasi: {
        ...konfig.aplikasi,
        versi: infoBaru.versiSemantik,
        kodeVersiAndroid: infoBaru.kodeVersiAndroid,
        nomorBuild: infoBaru.nomorBuildIOS,
      },
    });

    return infoBaru;
  }

  public jalankanDistribusiRilis(): HasilEksekusiRilis {
    return ReleaseManager.jalankanPipelineRilis(this.dapatkanKonfigurasi());
  }
}
