/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Sistem Desain Responsif & Breakpoint Mobile
 */

import { BreakpointMobile, OrientasiLayar, InsetAreaAman } from '../types';

export interface InfoUkuranLayar {
  lebar: number;
  tinggi: number;
  skala: number;
  orientasi: OrientasiLayar;
  breakpoint: BreakpointMobile;
  areaAman: InsetAreaAman;
}

export class PengelolaResponsifMobile {
  private lebar: number;
  private tinggi: number;
  private skala: number;
  private areaAman: InsetAreaAman;

  constructor(lebar: number = 390, tinggi: number = 844, skala: number = 3, areaAman?: Partial<InsetAreaAman>) {
    this.lebar = lebar;
    this.tinggi = tinggi;
    this.skala = skala;
    this.areaAman = {
      atas: areaAman?.atas ?? 47,
      bawah: areaAman?.bawah ?? 34,
      kiri: areaAman?.kiri ?? 0,
      kanan: areaAman?.kanan ?? 0,
    };
  }

  public perbaruiDimensi(lebar: number, tinggi: number, skala?: number, areaAman?: InsetAreaAman): void {
    this.lebar = lebar;
    this.tinggi = tinggi;
    if (skala !== undefined) this.skala = skala;
    if (areaAman) this.areaAman = areaAman;
  }

  public dapatkanOrientasi(): OrientasiLayar {
    return this.lebar > this.tinggi ? 'lanskap' : 'potret';
  }

  public dapatkanBreakpoint(): BreakpointMobile {
    const lebarEfektif = Math.min(this.lebar, this.tinggi);
    if (lebarEfektif < 360) return 'ponsel_kecil';
    if (lebarEfektif < 600) return 'ponsel_standar';
    if (lebarEfektif < 840) return 'ponsel_besar';
    return 'tablet';
  }

  public dapatkanInfo(): InfoUkuranLayar {
    return {
      lebar: this.lebar,
      tinggi: this.tinggi,
      skala: this.skala,
      orientasi: this.dapatkanOrientasi(),
      breakpoint: this.dapatkanBreakpoint(),
      areaAman: { ...this.areaAman },
    };
  }

  public pilihSesuaiBreakpoint<T>(pilihan: {
    ponsel_kecil?: T;
    ponsel_standar: T;
    ponsel_besar?: T;
    tablet?: T;
  }): T {
    const bp = this.dapatkanBreakpoint();
    if (bp === 'ponsel_kecil' && pilihan.ponsel_kecil !== undefined) return pilihan.ponsel_kecil;
    if (bp === 'tablet' && pilihan.tablet !== undefined) return pilihan.tablet;
    if (bp === 'ponsel_besar' && pilihan.ponsel_besar !== undefined) return pilihan.ponsel_besar;
    return pilihan.ponsel_standar;
  }

  public skalaUkuran(nilai: number): number {
    return Math.round(nilai * (this.lebar / 390));
  }
}
