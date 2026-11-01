/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Komponen Kartu & Pemisah Mobile (Mobile Card & Divider Component)
 */

import { KomponenMobile, GayaMobile } from './component';

export class KartuMobile extends KomponenMobile {
  public judul?: string;

  constructor(anakAwal: KomponenMobile[] = [], gaya?: GayaMobile, id?: string) {
    super('kartu', id, {
      warnaLatar: '#ffffff',
      radiusSudut: 12,
      padding: 16,
      elevasi: 2,
      ...gaya,
    });
    for (const a of anakAwal) {
      this.tambahAnak(a);
    }
  }

  public setJudul(judul: string): this {
    this.judul = judul;
    return this;
  }

  public override serialisasi(): Record<string, any> {
    return {
      ...super.serialisasi(),
      judul: this.judul,
    };
  }
}

export class PemisahMobile extends KomponenMobile {
  public ketebalan: number = 1;
  public warna: string = '#e2e8f0';

  constructor(ketebalan: number = 1, warna: string = '#e2e8f0', gaya?: GayaMobile, id?: string) {
    super('pemisah', id, gaya);
    this.ketebalan = ketebalan;
    this.warna = warna;
  }

  public override serialisasi(): Record<string, any> {
    return {
      ...super.serialisasi(),
      ketebalan: this.ketebalan,
      warna: this.warna,
    };
  }
}
