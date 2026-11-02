/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 40
 * Pengelola Build dan Distribusi Android Terpadu
 */

import { KonfigurasiDistribusiLengkap } from '../types';
import { APKBuilder, HasilBuildAPK } from './APKBuilder';
import { AABBuilder, HasilBuildAAB } from './AABBuilder';
import { AndroidSigningManager, HasilValidasiSigningAndroid } from './AndroidSigning';

export interface InfoLingkunganAndroidDistribusi {
  androidHome?: string;
  adaJdk: boolean;
  versiJdk?: string;
  adaGradle: boolean;
  siapBuildNative: boolean;
  catatan: string[];
}

export class AndroidDistributionManager {
  public static periksaLingkungan(): InfoLingkunganAndroidDistribusi {
    const env = typeof process !== 'undefined' && process.env ? process.env : {};
    const androidHome = env.ANDROID_HOME || env.ANDROID_SDK_ROOT;
    const adaJdk = Boolean(env.JAVA_HOME);
    const versiJdk = adaJdk ? 'JDK 17+' : undefined;
    const adaGradle = Boolean(env.GRADLE_HOME || env.PATH?.includes('gradle'));
    const siapBuildNative = Boolean(androidHome && adaJdk);

    const catatan: string[] = [];
    if (!androidHome) {
      catatan.push('Variabel ANDROID_HOME / ANDROID_SDK_ROOT belum dikonfigurasi di host.');
    } else {
      catatan.push(`Android SDK terdeteksi di: ${androidHome}`);
    }

    if (!adaJdk) {
      catatan.push('JDK (JAVA_HOME) belum terdeteksi. Gunakan OpenJDK 17 atau lebih baru.');
    } else {
      catatan.push(`Java JDK terdeteksi di: ${env.JAVA_HOME}`);
    }

    if (!siapBuildNative) {
      catatan.push('Build native APK dibatasi ke engine bundling internal Nusantara (Standalone Package Builder).');
    }

    return {
      androidHome,
      adaJdk,
      versiJdk,
      adaGradle,
      siapBuildNative,
      catatan,
    };
  }

  public static bangunDebugAPK(konfig: KonfigurasiDistribusiLengkap): HasilBuildAPK {
    return APKBuilder.bangunAPK(konfig, 'debug');
  }

  public static bangunReleaseAPK(konfig: KonfigurasiDistribusiLengkap): HasilBuildAPK {
    return APKBuilder.bangunAPK(konfig, 'release');
  }

  public static bangunReleaseAAB(konfig: KonfigurasiDistribusiLengkap): HasilBuildAAB {
    return AABBuilder.bangunAAB(konfig, true);
  }

  public static validasiSigning(konfig: KonfigurasiDistribusiLengkap, apakahRelease: boolean = true): HasilValidasiSigningAndroid {
    return AndroidSigningManager.validasiSigning(konfig.android.signing, apakahRelease);
  }
}
