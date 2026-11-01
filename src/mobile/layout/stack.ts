/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Tata Letak Bertumpuk Mobile (Stack / Z-Index Layer Layout)
 */

import { KomponenMobile, GayaMobile } from '../ui/component';

export interface PosisiTumpuk {
  atas?: number;
  bawah?: number;
  kiri?: number;
  kanan?: number;
  zIndex?: number;
}

export interface OpsiTataLetakTumpukMobile {
  id?: string;
  anak?: KomponenMobile[];
  perataan?: 'tengah' | 'kiri_atas' | 'kanan_atas' | 'kiri_bawah' | 'kanan_bawah';
  gaya?: GayaMobile;
}

export class TataLetakTumpukMobile extends KomponenMobile {
  public perataan: 'tengah' | 'kiri_atas' | 'kanan_atas' | 'kiri_bawah' | 'kanan_bawah' = 'kiri_atas';
  private posisiItem: Map<string, PosisiTumpuk> = new Map();

  constructor(opsi?: OpsiTataLetakTumpukMobile) {
    super('tata_letak_tumpuk', opsi?.id, {
      fleksibel: 1,
      ...opsi?.gaya,
    });

    if (opsi?.perataan) this.perataan = opsi.perataan;
    if (opsi?.anak) {
      opsi.anak.forEach(a => this.tambahAnak(a));
    }
  }

  public tambahAnakBerposisi(anak: KomponenMobile, posisi: PosisiTumpuk): this {
    this.tambahAnak(anak);
    this.posisiItem.set(anak.id, posisi);
    return this;
  }

  public dapatkanPosisi(idAnak: string): PosisiTumpuk | undefined {
    return this.posisiItem.get(idAnak);
  }

  public override toJson(): Record<string, any> {
    const posisiObj: Record<string, PosisiTumpuk> = {};
    this.posisiItem.forEach((val, key) => {
      posisiObj[key] = val;
    });

    return {
      ...super.toJson(),
      perataan: this.perataan,
      posisiItem: posisiObj,
    };
  }
}
