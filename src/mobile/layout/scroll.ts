/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Tampilan Gulir Mobile (Scroll View Container)
 */

import { KomponenMobile, GayaMobile } from '../ui/component';

export interface OpsiTampilanGulirMobile {
  id?: string;
  arah?: 'vertikal' | 'horizontal';
  tampilkanIndikator?: boolean;
  bouncing?: boolean;
  anak?: KomponenMobile[];
  gaya?: GayaMobile;
  padaGulir?: (posisi: { x: number; y: number }) => void;
}

export class TampilanGulirMobile extends KomponenMobile {
  public arah: 'vertikal' | 'horizontal' = 'vertikal';
  public tampilkanIndikator: boolean = true;
  public bouncing: boolean = true;
  public posisiX: number = 0;
  public posisiY: number = 0;
  private penanganGulir?: (posisi: { x: number; y: number }) => void;

  constructor(opsi?: OpsiTampilanGulirMobile) {
    super('tampilan_gulir', opsi?.id, {
      fleksibel: 1,
      ...opsi?.gaya,
    });

    if (opsi?.arah) this.arah = opsi.arah;
    if (opsi?.tampilkanIndikator !== undefined) this.tampilkanIndikator = opsi.tampilkanIndikator;
    if (opsi?.bouncing !== undefined) this.bouncing = opsi.bouncing;
    if (opsi?.padaGulir) this.penanganGulir = opsi.padaGulir;
    if (opsi?.anak) {
      opsi.anak.forEach(a => this.tambahAnak(a));
    }
  }

  public gulirKe(x: number, y: number): void {
    this.posisiX = Math.max(0, x);
    this.posisiY = Math.max(0, y);
    if (this.penanganGulir) {
      this.penanganGulir({ x: this.posisiX, y: this.posisiY });
    }
  }

  public override toJson(): Record<string, any> {
    return {
      ...super.toJson(),
      arah: this.arah,
      tampilkanIndikator: this.tampilkanIndikator,
      bouncing: this.bouncing,
      posisiX: this.posisiX,
      posisiY: this.posisiY,
    };
  }
}
