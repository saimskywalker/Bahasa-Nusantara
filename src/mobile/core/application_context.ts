/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Konteks Global Aplikasi Mobile (Mobile Application Context)
 */

import { KonfigurasiAplikasiMobile, InfoPerangkat, InsetAreaAman } from '../types';
import { PengelolaLifecycleMobile } from './lifecycle';
import { PengelolaStateMobile } from './state';
import { PengelolaIzinMobile } from '../security/permission';

export class KonteksAplikasiMobile {
  private static instance: KonteksAplikasiMobile | null = null;

  public readonly lifecycle: PengelolaLifecycleMobile = new PengelolaLifecycleMobile();
  public readonly state: PengelolaStateMobile = new PengelolaStateMobile();
  public readonly izin: PengelolaIzinMobile = new PengelolaIzinMobile();
  public get pengelolaIzin(): PengelolaIzinMobile {
    return this.izin;
  }
  public konfigurasi?: KonfigurasiAplikasiMobile;
  public temaAktif: 'terang' | 'gelap' | 'sistem' = 'terang';
  public infoPerangkat: InfoPerangkat;
  public navigatorAktif: any = null;

  constructor() {
    this.infoPerangkat = KonteksAplikasiMobile.buatInfoPerangkatBawaan();
  }

  public static dapatkanKonteks(): KonteksAplikasiMobile {
    if (!KonteksAplikasiMobile.instance) {
      KonteksAplikasiMobile.instance = new KonteksAplikasiMobile();
    }
    return KonteksAplikasiMobile.instance;
  }

  public static resetKonteks(): void {
    if (KonteksAplikasiMobile.instance) {
      KonteksAplikasiMobile.instance.bersihkan();
      KonteksAplikasiMobile.instance = null;
    }
  }

  public static buatInfoPerangkatBawaan(): InfoPerangkat {
    const areaAman: InsetAreaAman = { atas: 44, bawah: 34, kiri: 0, kanan: 0 };
    return {
      namaPerangkat: 'Nusantara Mobile Virtual Device',
      model: 'Nusantara-Phone-v37',
      produsen: 'NUSANTARA Open Source',
      platform: 'desktop_preview',
      versiOS: '14.0',
      apakahSimulator: true,
      lebarLayar: 390,
      tinggiLayar: 844,
      skalaPiksel: 3,
      orientasi: 'potret',
      areaAman,
    };
  }

  public setInfoPerangkat(info: Partial<InfoPerangkat>): void {
    this.infoPerangkat = { ...this.infoPerangkat, ...info };
  }

  public setTema(tema: 'terang' | 'gelap' | 'sistem'): void {
    this.temaAktif = tema;
  }

  public bersihkan(): void {
    this.lifecycle.bersihkan();
    this.state.bersihkan();
    this.izin.bersihkan();
    this.navigatorAktif = null;
  }
}
