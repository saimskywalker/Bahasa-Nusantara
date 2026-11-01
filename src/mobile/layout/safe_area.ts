/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Wadah Area Aman Mobile (Safe Area Insets Container)
 */

import { KomponenMobile, GayaMobile } from '../ui/component';
import { InsetAreaAman } from '../types';

export interface OpsiAreaAmanMobile {
  id?: string;
  inset?: Partial<InsetAreaAman>;
  gaya?: GayaMobile;
  abaikanAtas?: boolean;
  abaikanBawah?: boolean;
  abaikanKiri?: boolean;
  abaikanKanan?: boolean;
}

export class AreaAmanMobile extends KomponenMobile {
  public inset: InsetAreaAman = {
    atas: 47,
    bawah: 34,
    kiri: 0,
    kanan: 0,
  };
  public abaikanAtas: boolean = false;
  public abaikanBawah: boolean = false;
  public abaikanKiri: boolean = false;
  public abaikanKanan: boolean = false;

  constructor(opsi?: OpsiAreaAmanMobile) {
    super('area_aman', opsi?.id, {
      fleksibel: 1,
      ...opsi?.gaya,
    });

    if (opsi?.inset) {
      this.inset = {
        atas: opsi.inset.atas ?? this.inset.atas,
        bawah: opsi.inset.bawah ?? this.inset.bawah,
        kiri: opsi.inset.kiri ?? this.inset.kiri,
        kanan: opsi.inset.kanan ?? this.inset.kanan,
      };
    }
    if (opsi?.abaikanAtas !== undefined) this.abaikanAtas = opsi.abaikanAtas;
    if (opsi?.abaikanBawah !== undefined) this.abaikanBawah = opsi.abaikanBawah;
    if (opsi?.abaikanKiri !== undefined) this.abaikanKiri = opsi.abaikanKiri;
    if (opsi?.abaikanKanan !== undefined) this.abaikanKanan = opsi.abaikanKanan;
  }

  public dapatkanPaddingEfektif(): [number, number, number, number] {
    const atas = this.abaikanAtas ? 0 : this.inset.atas;
    const kanan = this.abaikanKanan ? 0 : this.inset.kanan;
    const bawah = this.abaikanBawah ? 0 : this.inset.bawah;
    const kiri = this.abaikanKiri ? 0 : this.inset.kiri;
    return [atas, kanan, bawah, kiri];
  }

  public override toJson(): Record<string, any> {
    return {
      ...super.toJson(),
      inset: this.inset,
      paddingEfektif: this.dapatkanPaddingEfektif(),
    };
  }
}
