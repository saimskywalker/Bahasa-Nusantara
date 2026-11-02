/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 40
 * Pengelola Konfigurasi Terpadu Distribusi Aplikasi Mobile
 */

import * as fs from 'fs';
import * as path from 'path';
import { KonfigurasiDistribusiLengkap, LingkunganDistribusi } from '../types';
import { AndroidDistributionConfig } from './AndroidConfig';
import { IOSDistributionConfig } from './IOSConfig';

export class PengelolaKonfigurasiDistribusi {
  private static instance: PengelolaKonfigurasiDistribusi;
  private konfigAktif: KonfigurasiDistribusiLengkap;

  private constructor() {
    this.konfigAktif = this.buatKonfigurasiDefault();
  }

  public static dapatkanInstance(): PengelolaKonfigurasiDistribusi {
    if (!PengelolaKonfigurasiDistribusi.instance) {
      PengelolaKonfigurasiDistribusi.instance = new PengelolaKonfigurasiDistribusi();
    }
    return PengelolaKonfigurasiDistribusi.instance;
  }

  public buatKonfigurasiDefault(): KonfigurasiDistribusiLengkap {
    const defaultId = 'id.nusantara.aplikasi';
    return {
      aplikasi: {
        nama: 'Aplikasi Nusantara',
        id: defaultId,
        versi: '1.0.0',
        nomorBuild: 1,
        kodeVersiAndroid: 1,
        deskripsi: 'Aplikasi mobile dibuat dengan Bahasa Pemrograman NUSANTARA',
        pengembang: 'Komunitas Pengembang Nusantara',
        hakCipta: `© ${new Date().getFullYear()} Nusantara Open Source`,
      },
      lingkungan: 'development',
      android: {
        minSdk: AndroidDistributionConfig.SDK_MIN_DEFAULT,
        targetSdk: AndroidDistributionConfig.SDK_TARGET_DEFAULT,
        compileSdk: AndroidDistributionConfig.SDK_COMPILE_DEFAULT,
        tipeBuild: ['debug', 'release'],
        formatPaket: ['apk', 'aab'],
        signing: AndroidDistributionConfig.buatDefaultSigning('debug'),
        outputDir: 'dist/mobile/android',
        izin: ['android.permission.INTERNET', 'android.permission.ACCESS_NETWORK_STATE'],
        fiturHardware: [],
      },
      ios: {
        deploymentTarget: IOSDistributionConfig.DEPLOYMENT_TARGET_DEFAULT,
        bundleId: defaultId,
        signing: IOSDistributionConfig.buatDefaultSigning(defaultId),
        outputDir: 'dist/mobile/ios',
        deskripsiIzin: {},
        perangkatDidukung: ['iphone', 'ipad'],
      },
      aset: {
        direktoriIkon: 'aset/ikon',
        direktoriSplash: 'aset/splash',
        ikonUtama: 'aset/ikon/app-icon.png',
        splashUtama: 'aset/splash/splash.png',
      },
      metadataPublikasi: {
        kebijakanPrivasiUrl: 'https://nusantara.dev/privasi',
        dukunganUrl: 'https://nusantara.dev/dukungan',
        kategoriAplikasi: 'Utilities',
        ratingUsia: '4+',
        kataKunci: ['nusantara', 'mobile', 'indonesia'],
        catatanRilis: 'Rilis awal aplikasi menggunakan Nusantara Mobile Framework.',
      },
    };
  }

  public dapatkanKonfigurasi(): KonfigurasiDistribusiLengkap {
    return JSON.parse(JSON.stringify(this.konfigAktif));
  }

  public muatDariFile(jalurBerkas?: string): KonfigurasiDistribusiLengkap {
    const isNode = typeof window === 'undefined' && typeof process !== 'undefined' && Boolean(process?.versions?.node);
    if (!isNode) {
      return this.dapatkanKonfigurasi();
    }
    const targetFile = jalurBerkas || path.resolve(process.cwd(), 'nusantara.mobile.json');
    if (fs.existsSync(targetFile)) {
      try {
        const raw = fs.readFileSync(targetFile, 'utf-8');
        const parsed = JSON.parse(raw);
        this.perbaruiKonfigurasi(parsed);
      } catch (err: any) {
        console.warn(`[PERINGATAN] Gagal membaca konfigurasi dari '${targetFile}': ${err.message}`);
      }
    }
    return this.dapatkanKonfigurasi();
  }

  public perbaruiKonfigurasi(parsial: Partial<KonfigurasiDistribusiLengkap>): KonfigurasiDistribusiLengkap {
    this.konfigAktif = {
      ...this.konfigAktif,
      ...parsial,
      aplikasi: {
        ...this.konfigAktif.aplikasi,
        ...(parsial.aplikasi || {}),
      },
      android: {
        ...this.konfigAktif.android,
        ...(parsial.android || {}),
      },
      ios: {
        ...this.konfigAktif.ios,
        ...(parsial.ios || {}),
      },
      aset: {
        ...this.konfigAktif.aset,
        ...(parsial.aset || {}),
      },
      metadataPublikasi: {
        ...this.konfigAktif.metadataPublikasi,
        ...(parsial.metadataPublikasi || {}),
      },
    };
    return this.dapatkanKonfigurasi();
  }

  public setLingkungan(env: LingkunganDistribusi): KonfigurasiDistribusiLengkap {
    this.konfigAktif.lingkungan = env;
    if (env === 'production') {
      this.konfigAktif.android.signing = AndroidDistributionConfig.buatDefaultSigning('release');
    } else {
      this.konfigAktif.android.signing = AndroidDistributionConfig.buatDefaultSigning('debug');
    }
    return this.dapatkanKonfigurasi();
  }

  public simpanKeFile(jalurBerkas?: string): boolean {
    const isNode = typeof window === 'undefined' && typeof process !== 'undefined' && Boolean(process?.versions?.node);
    if (!isNode) {
      return true;
    }
    const targetFile = jalurBerkas || path.resolve(process.cwd(), 'nusantara.mobile.json');
    try {
      const dir = path.dirname(targetFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(targetFile, JSON.stringify(this.konfigAktif, null, 2), 'utf-8');
      return true;
    } catch {
      return false;
    }
  }

  public static ambilKredensialAman(namaEnv?: string): string | undefined {
    if (!namaEnv) return undefined;
    return typeof process !== 'undefined' && process.env ? process.env[namaEnv] : undefined;
  }
}
