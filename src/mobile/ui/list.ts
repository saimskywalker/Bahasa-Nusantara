/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Komponen Daftar & Grid Antarmuka Mobile (List & Grid Views)
 */

import { KomponenMobile, GayaMobile } from './component';

export interface OpsiDaftarMobile {
  id?: string;
  data?: any[];
  pembuatItem?: (item: any, indeks: number) => KomponenMobile;
  pemisah?: boolean;
  dapatDitarikRefresh?: boolean;
  padaRefresh?: () => void | Promise<void>;
  gaya?: GayaMobile;
}

export class DaftarMobile extends KomponenMobile {
  public data: any[] = [];
  public pembuatItem?: (item: any, indeks: number) => KomponenMobile;
  public pemisah: boolean = true;
  public dapatDitarikRefresh: boolean = false;
  public sedangRefresh: boolean = false;
  private penanganRefresh?: () => void | Promise<void>;

  constructor(opsi?: OpsiDaftarMobile) {
    super('daftar', opsi?.id, {
      fleksibel: 1,
      ...opsi?.gaya,
    });

    if (opsi?.data) {
      this.data = [...opsi.data];
    }
    if (opsi?.pembuatItem) {
      this.pembuatItem = opsi.pembuatItem;
      this.bangunUlangItem();
    }
    if (opsi?.pemisah !== undefined) {
      this.pemisah = opsi.pemisah;
    }
    if (opsi?.dapatDitarikRefresh !== undefined) {
      this.dapatDitarikRefresh = opsi.dapatDitarikRefresh;
    }
    if (opsi?.padaRefresh) {
      this.penanganRefresh = opsi.padaRefresh;
    }
  }

  public setData(dataBaru: any[]): this {
    this.data = [...dataBaru];
    this.bangunUlangItem();
    return this;
  }

  public tambahItem(item: any): this {
    this.data.push(item);
    if (this.pembuatItem) {
      const komp = this.pembuatItem(item, this.data.length - 1);
      this.tambahAnak(komp);
    }
    return this;
  }

  public setPembuatItem(pembuat: (item: any, indeks: number) => KomponenMobile): this {
    this.pembuatItem = pembuat;
    this.bangunUlangItem();
    return this;
  }

  public bangunUlangItem(): void {
    this.anak = [];
    if (!this.pembuatItem) return;
    this.data.forEach((item, idx) => {
      const komp = this.pembuatItem!(item, idx);
      this.tambahAnak(komp);
    });
  }

  public async picuRefresh(): Promise<void> {
    if (!this.dapatDitarikRefresh || this.sedangRefresh) return;
    this.sedangRefresh = true;
    try {
      if (this.penanganRefresh) {
        await this.penanganRefresh();
      }
      await this.picuPeristiwa('refresh', {
        idKomponen: this.id,
        jenis: 'refresh',
        stempelWaktu: Date.now(),
      });
    } finally {
      this.sedangRefresh = false;
    }
  }

  public override toJson(): Record<string, any> {
    return {
      ...super.toJson(),
      jumlahData: this.data.length,
      pemisah: this.pemisah,
      dapatDitarikRefresh: this.dapatDitarikRefresh,
      sedangRefresh: this.sedangRefresh,
    };
  }
}

export interface OpsiGridMobile {
  id?: string;
  jumlahKolom?: number;
  jarakAntarItem?: number;
  data?: any[];
  pembuatItem?: (item: any, indeks: number) => KomponenMobile;
  gaya?: GayaMobile;
}

export class GridMobile extends KomponenMobile {
  public jumlahKolom: number = 2;
  public jarakAntarItem: number = 8;
  public data: any[] = [];
  public pembuatItem?: (item: any, indeks: number) => KomponenMobile;

  constructor(opsi?: OpsiGridMobile) {
    super('grid', opsi?.id, {
      fleksibel: 1,
      ...opsi?.gaya,
    });

    if (opsi?.jumlahKolom) {
      this.jumlahKolom = opsi.jumlahKolom;
    }
    if (opsi?.jarakAntarItem !== undefined) {
      this.jarakAntarItem = opsi.jarakAntarItem;
    }
    if (opsi?.data) {
      this.data = [...opsi.data];
    }
    if (opsi?.pembuatItem) {
      this.pembuatItem = opsi.pembuatItem;
      this.bangunUlangItem();
    }
  }

  public setData(dataBaru: any[]): this {
    this.data = [...dataBaru];
    this.bangunUlangItem();
    return this;
  }

  public setJumlahKolom(kolom: number): this {
    this.jumlahKolom = Math.max(1, kolom);
    return this;
  }

  public bangunUlangItem(): void {
    this.anak = [];
    if (!this.pembuatItem) return;
    this.data.forEach((item, idx) => {
      const komp = this.pembuatItem!(item, idx);
      this.tambahAnak(komp);
    });
  }

  public override toJson(): Record<string, any> {
    return {
      ...super.toJson(),
      jumlahKolom: this.jumlahKolom,
      jarakAntarItem: this.jarakAntarItem,
      jumlahData: this.data.length,
    };
  }
}
