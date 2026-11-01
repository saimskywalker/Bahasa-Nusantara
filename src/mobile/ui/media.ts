/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Komponen Gambar & Ikon Mobile (Mobile Image & Icon Component)
 */

import { KomponenMobile, GayaMobile } from './component';

export type ModeUkuranGambar = 'isi' | 'sesuai' | 'potong' | 'pusat';

export class GambarMobile extends KomponenMobile {
  public sumber: string;
  public modeUkuran: ModeUkuranGambar = 'sesuai';
  public teksAlt?: string;

  constructor(
    sumberAtauOpsi: string | { sumber?: string; lebar?: number; tinggi?: number; modeUkuran?: ModeUkuranGambar; teksAlt?: string; gaya?: GayaMobile; id?: string },
    lebar?: number,
    tinggi?: number,
    modeUkuran: ModeUkuranGambar = 'sesuai',
    gaya?: GayaMobile,
    id?: string
  ) {
    const isObj = typeof sumberAtauOpsi === 'object' && sumberAtauOpsi !== null;
    super(
      'gambar',
      isObj ? (sumberAtauOpsi as any).id || id : id,
      isObj ? { ...(sumberAtauOpsi as any).gaya, lebar: (sumberAtauOpsi as any).lebar || lebar, tinggi: (sumberAtauOpsi as any).tinggi || tinggi } : { ...gaya, lebar, tinggi }
    );
    if (isObj) {
      this.sumber = (sumberAtauOpsi as any).sumber || '';
      this.modeUkuran = (sumberAtauOpsi as any).modeUkuran || modeUkuran;
      this.teksAlt = (sumberAtauOpsi as any).teksAlt;
    } else {
      this.sumber = String(sumberAtauOpsi || '');
      this.modeUkuran = modeUkuran;
    }
  }

  public setSumber(sumberBaru: string): this {
    this.sumber = sumberBaru;
    return this;
  }

  public override serialisasi(): Record<string, any> {
    return {
      ...super.serialisasi(),
      sumber: this.sumber,
      modeUkuran: this.modeUkuran,
      teksAlt: this.teksAlt,
    };
  }
}

export class IkonMobile extends KomponenMobile {
  public namaIkon: string;
  public ukuran: number = 24;
  public warna?: string;

  constructor(
    namaAtauOpsi: string | { nama?: string; namaIkon?: string; ukuran?: number; warna?: string; gaya?: GayaMobile; id?: string },
    ukuran: number = 24,
    warna?: string,
    gaya?: GayaMobile,
    id?: string
  ) {
    const isObj = typeof namaAtauOpsi === 'object' && namaAtauOpsi !== null;
    super(
      'ikon',
      isObj ? (namaAtauOpsi as any).id || id : id,
      isObj ? (namaAtauOpsi as any).gaya || gaya : gaya
    );
    if (isObj) {
      this.namaIkon = (namaAtauOpsi as any).nama || (namaAtauOpsi as any).namaIkon || 'info';
      this.ukuran = (namaAtauOpsi as any).ukuran ?? ukuran;
      this.warna = (namaAtauOpsi as any).warna || warna;
    } else {
      this.namaIkon = String(namaAtauOpsi || 'info');
      this.ukuran = ukuran;
      this.warna = warna;
    }
  }

  public get nama(): string {
    return this.namaIkon;
  }

  public set nama(v: string) {
    this.namaIkon = v;
  }

  public setNamaIkon(nama: string): this {
    this.namaIkon = nama;
    return this;
  }

  public override serialisasi(): Record<string, any> {
    return {
      ...super.serialisasi(),
      namaIkon: this.namaIkon,
      ukuran: this.ukuran,
      warna: this.warna,
    };
  }
}
