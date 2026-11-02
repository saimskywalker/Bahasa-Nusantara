/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 38
 * Pengelola Kemampuan & Fitur Perangkat (Device Capability Manager)
 */

import { InfoPerangkatMobile } from '../../device/info';
import { StatusJaringanMobile } from '../../device/network';
import { StatusBateraiMobile } from '../../device/battery';

export interface KemampuanPerangkat {
  kamera: {
    tersedia: boolean;
    depan: boolean;
    belakang: boolean;
    flash: boolean;
  };
  sensor: {
    akselerometer: boolean;
    giroskop: boolean;
    magnetometer: boolean;
    kedekatan: boolean;
    cahaya: boolean;
  };
  konektivitas: {
    wifi: boolean;
    seluler: boolean;
    bluetooth: boolean;
    bluetoothLE: boolean;
    gps: boolean;
  };
  audio: {
    perekam: boolean;
    pemutar: boolean;
  };
  keamanan: {
    penyimpananAman: boolean;
    biometrik: boolean;
  };
  haptik: boolean;
  papanKlip: boolean;
  berbagi: boolean;
  sistem: {
    platform: 'android' | 'ios' | 'desktop' | 'simulator';
    versiOS: string;
    model: string;
    arsitektur: string;
    apakahSimulator: boolean;
  };
}

export class PengelolaKemampuanPerangkat {
  private static instance: PengelolaKemampuanPerangkat;
  private cacheKemampuan?: KemampuanPerangkat;

  private constructor() {}

  public static dapatkanInstance(): PengelolaKemampuanPerangkat {
    if (!PengelolaKemampuanPerangkat.instance) {
      PengelolaKemampuanPerangkat.instance = new PengelolaKemampuanPerangkat();
    }
    return PengelolaKemampuanPerangkat.instance;
  }

  public dapatkanKemampuan(paksaSegarkan: boolean = false): KemampuanPerangkat {
    if (this.cacheKemampuan && !paksaSegarkan) {
      return this.cacheKemampuan;
    }

    const info = InfoPerangkatMobile.dapatkanInfo();
    const isSim = InfoPerangkatMobile.apakahSimulator();
    const plat = info.platform as 'android' | 'ios' | 'desktop' | 'simulator';

    this.cacheKemampuan = {
      kamera: {
        tersedia: true,
        depan: true,
        belakang: true,
        flash: plat === 'android' || plat === 'ios',
      },
      sensor: {
        akselerometer: true,
        giroskop: true,
        magnetometer: plat === 'android' || plat === 'ios',
        kedekatan: plat === 'android' || plat === 'ios',
        cahaya: plat === 'android',
      },
      konektivitas: {
        wifi: true,
        seluler: plat === 'android' || plat === 'ios',
        bluetooth: true,
        bluetoothLE: true,
        gps: true,
      },
      audio: {
        perekam: true,
        pemutar: true,
      },
      keamanan: {
        penyimpananAman: true,
        biometrik: plat === 'android' || plat === 'ios',
      },
      haptik: true,
      papanKlip: true,
      berbagi: true,
      sistem: {
        platform: plat,
        versiOS: info.versiOS,
        model: info.model,
        arsitektur: typeof process !== 'undefined' ? process.arch : 'arm64',
        apakahSimulator: isSim,
      },
    };

    return this.cacheKemampuan;
  }

  public apakahMendukung(fitur: string): boolean {
    const k = this.dapatkanKemampuan();
    const bagian = fitur.toLowerCase().split('.');

    let obj: any = k;
    for (const b of bagian) {
      if (obj && typeof obj === 'object' && b in obj) {
        obj = obj[b];
      } else {
        return false;
      }
    }
    return Boolean(obj);
  }
}
