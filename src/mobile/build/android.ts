/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Pengelola Kompilasi & Build Android (Android Build Manager)
 */

import { KonfigurasiAplikasiMobile } from '../types';

export class AndroidBuildManager {
  public static periksaLingkungan(): {
    androidHome?: string;
    javaHome?: string;
    adaSdk: boolean;
    adaJdk: boolean;
    siapBuild: boolean;
    siapBuildNative: boolean;
    pesan: string;
    catatan: string[];
  } {
    const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
    const javaHome = process.env.JAVA_HOME;
    const adaSdk = Boolean(androidHome);
    const adaJdk = Boolean(javaHome);
    const siap = adaSdk && adaJdk;
    return {
      androidHome,
      javaHome,
      adaSdk,
      adaJdk,
      siapBuild: siap,
      siapBuildNative: siap,
      pesan: siap
        ? 'Lingkungan build Android SDK dan Java JDK terkonfigurasi dengan benar.'
        : 'ANDROID_HOME atau JAVA_HOME belum disetel. Kompilasi Android biner berjalan dalam mode simulasi aman.',
      catatan: siap
        ? ['SDK dan JDK siap untuk proses build native.']
        : ['Mode simulasi diaktifkan secara otomatis.'],
    };
  }

  public static buatAndroidManifest(konfig: KonfigurasiAplikasiMobile): string {
    const pkg = konfig.id || 'id.nusantara.aplikasi';
    const label = konfig.nama || 'Aplikasi Nusantara';
    const izinPeta: Record<string, string[]> = {
      kamera: ['android.permission.CAMERA'],
      lokasi: ['android.permission.ACCESS_FINE_LOCATION', 'android.permission.ACCESS_COARSE_LOCATION'],
      notifikasi: ['android.permission.POST_NOTIFICATIONS'],
      mikrofon: ['android.permission.RECORD_AUDIO'],
      penyimpanan: ['android.permission.READ_EXTERNAL_STORAGE', 'android.permission.WRITE_EXTERNAL_STORAGE'],
    };

    const izinEkstra: string[] = [];
    if (Array.isArray(konfig.daftarIzin)) {
      for (const iz of konfig.daftarIzin) {
        const k = String(iz).toLowerCase();
        if (izinPeta[k]) {
          izinEkstra.push(...izinPeta[k]);
        }
      }
    }

    const xmlIzin = Array.from(new Set(izinEkstra))
      .map(p => `    <uses-permission android:name="${p}" />`)
      .join('\n');

    return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${pkg}">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
${xmlIzin ? xmlIzin + '\n' : ''}
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="${label}"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.NusantaraApp">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
  }

  public static buatBuildGradleApp(konfig: KonfigurasiAplikasiMobile): string {
    const appId = konfig.id || 'id.nusantara.aplikasi';
    const versionCode = (konfig as any).kodeVersiAndroid || konfig.nomorBuild || 1;
    const versionName = konfig.versi || '1.0.0';
    return `plugins {
    id 'com.android.application'
    id 'kotlin-android'
}

android {
    namespace '${appId}'
    compileSdk 34

    defaultConfig {
        applicationId "${appId}"
        minSdk 24
        targetSdk 34
        versionCode ${versionCode}
        versionName "${versionName}"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
}`;
  }
}
