/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Komponen Bilah Navigasi Bawah Mobile (Bottom Navigation Bar)
 */

import { KomponenMobile, GayaMobile } from '../ui/component';

export interface ItemNavigasiBawah {
  kunci: string;
  label: string;
  ikon: string;
  lencana?: string | number;
}

export interface OpsiNavigasiBawahMobile {
  id?: string;
  items: ItemNavigasiBawah[];
  kunciAktif?: string;
  padaPilih?: (kunci: string) => void;
  warnaAktif?: string;
  warnaTidakAktif?: string;
  gaya?: GayaMobile;
}

export class NavigasiBawahMobile extends KomponenMobile {
  public items: ItemNavigasiBawah[] = [];
  public kunciAktif: string = '';
  public warnaAktif: string = '#1976d2';
  public warnaTidakAktif: string = '#757575';
  private penanganPilih?: (kunci: string) => void;

  constructor(opsi: OpsiNavigasiBawahMobile) {
    super('navigasi_bawah', opsi.id, {
      tinggi: 56,
      warnaLatar: '#ffffff',
      elevasi: 8,
      ...opsi.gaya,
    });

    this.items = [...opsi.items];
    if (opsi.warnaAktif) this.warnaAktif = opsi.warnaAktif;
    if (opsi.warnaTidakAktif) this.warnaTidakAktif = opsi.warnaTidakAktif;
    if (opsi.padaPilih) this.penanganPilih = opsi.padaPilih;
    if (opsi.kunciAktif) {
      this.kunciAktif = opsi.kunciAktif;
    } else if (this.items.length > 0) {
      this.kunciAktif = this.items[0].kunci;
    }
  }

  public pilih(kunci: string): void {
    this.kunciAktif = kunci;
    if (this.penanganPilih) {
      this.penanganPilih(kunci);
    }
  }

  public override toJson(): Record<string, any> {
    return {
      ...super.toJson(),
      kunciAktif: this.kunciAktif,
      warnaAktif: this.warnaAktif,
      warnaTidakAktif: this.warnaTidakAktif,
      items: this.items,
    };
  }
}
