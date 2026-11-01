/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Komponen Indikator Progres & Loading Mobile (Mobile Progress & Activity Indicator)
 */

import { KomponenMobile, GayaMobile } from './component';

export class IndikatorProgresMobile extends KomponenMobile {
  public nilai: number;
  public nilaiMaks: number;

  constructor(
    nilaiAtauOpsi: number | { nilai?: number; nilaiMaksimum?: number; nilaiMaks?: number; gaya?: GayaMobile; id?: string } = 0,
    nilaiMaks: number = 100,
    gaya?: GayaMobile,
    id?: string
  ) {
    const isObj = typeof nilaiAtauOpsi === 'object' && nilaiAtauOpsi !== null;
    super(
      'progres',
      isObj ? (nilaiAtauOpsi as any).id || id : id,
      isObj ? (nilaiAtauOpsi as any).gaya || gaya : gaya
    );
    if (isObj) {
      this.nilaiMaks = (nilaiAtauOpsi as any).nilaiMaksimum ?? (nilaiAtauOpsi as any).nilaiMaks ?? 100;
      this.nilai = Math.min(Math.max(0, (nilaiAtauOpsi as any).nilai ?? 0), this.nilaiMaks);
    } else {
      this.nilai = Math.min(Math.max(0, Number(nilaiAtauOpsi) || 0), nilaiMaks);
      this.nilaiMaks = nilaiMaks;
    }
  }

  public getNilai(): number {
    return this.nilai;
  }

  public setNilai(nilaiBaru: number): this {
    this.nilai = Math.min(Math.max(0, nilaiBaru), this.nilaiMaks);
    return this;
  }

  public getPersentase(): number {
    if (this.nilaiMaks <= 0) return 0;
    return Math.round((this.nilai / this.nilaiMaks) * 100);
  }

  public dapatkanPersentase(): number {
    return this.getPersentase();
  }

  public override serialisasi(): Record<string, any> {
    return {
      ...super.serialisasi(),
      nilai: this.nilai,
      nilaiMaks: this.nilaiMaks,
      persentase: this.getPersentase(),
    };
  }
}

export class IndikatorMemuatMobile extends KomponenMobile {
  public ukuran: 'kecil' | 'sedang' | 'besar' = 'sedang';
  public warna?: string;
  public sedangMemuat: boolean = true;

  constructor(
    ukuranAtauOpsi: ('kecil' | 'sedang' | 'besar') | { sedangMemuat?: boolean; aktif?: boolean; ukuran?: 'kecil' | 'sedang' | 'besar' | number; warna?: string; gaya?: GayaMobile; id?: string } = 'sedang',
    warna?: string,
    gaya?: GayaMobile,
    id?: string
  ) {
    const isObj = typeof ukuranAtauOpsi === 'object' && ukuranAtauOpsi !== null;
    super(
      'memuat',
      isObj ? (ukuranAtauOpsi as any).id || id : id,
      isObj ? (ukuranAtauOpsi as any).gaya || gaya : gaya
    );
    if (isObj) {
      const uk = (ukuranAtauOpsi as any).ukuran;
      this.ukuran = typeof uk === 'string' ? (uk as any) : uk && uk > 32 ? 'besar' : 'sedang';
      this.warna = (ukuranAtauOpsi as any).warna || warna;
      this.sedangMemuat = (ukuranAtauOpsi as any).sedangMemuat ?? (ukuranAtauOpsi as any).aktif ?? true;
    } else {
      this.ukuran = ukuranAtauOpsi;
      this.warna = warna;
    }
  }

  public override serialisasi(): Record<string, any> {
    return {
      ...super.serialisasi(),
      ukuran: this.ukuran,
      warna: this.warna,
    };
  }
}
