/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * API Informasi Perangkat Mobile (Device Info API)
 */

import { InfoPerangkat, OrientasiLayar, InsetAreaAman } from '../types';

export class InfoPerangkatMobile {
  private static info: InfoPerangkat = {
    namaPerangkat: 'Perangkat Seluler Nusantara',
    model: 'Nusantara-Virtual-Phone',
    produsen: 'Nusantara Labs',
    platform: 'desktop_preview',
    versiOS: '14.0',
    apakahSimulator: true,
    lebarLayar: 390,
    tinggiLayar: 844,
    skalaPiksel: 3,
    orientasi: 'potret',
    areaAman: {
      atas: 47,
      bawah: 34,
      kiri: 0,
      kanan: 0,
    },
  };

  public static dapatkanInfo(): InfoPerangkat {
    return { ...this.info };
  }

  public static setInfoKustom(kustom: Partial<InfoPerangkat>): void {
    this.info = {
      ...this.info,
      ...kustom,
    };
  }

  public static apakahAndroid(): boolean {
    return this.info.platform === 'android';
  }

  public static apakahIOS(): boolean {
    return this.info.platform === 'ios';
  }

  public static apakahSimulator(): boolean {
    return this.info.apakahSimulator;
  }

  public static dapatkanOrientasi(): OrientasiLayar {
    return this.info.orientasi;
  }

  public static dapatkanAreaAman(): InsetAreaAman {
    return { ...this.info.areaAman };
  }
}
