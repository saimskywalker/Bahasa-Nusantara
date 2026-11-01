/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Tata Letak Fleksibel Mobile (Vertical, Horizontal, Flex Containers)
 */

import { KomponenMobile, GayaMobile } from '../ui/component';

export type ArahTataLetak = 'vertikal' | 'horizontal';
export type PerataanUtama = 'mulai' | 'tengah' | 'akhir' | 'sebar' | 'antara' | 'rata';
export type PerataanSilang = 'mulai' | 'tengah' | 'akhir' | 'regang';

export interface OpsiTataLetakFleksibel {
  id?: string;
  arah?: ArahTataLetak;
  perataanUtama?: PerataanUtama;
  perataanSilang?: PerataanSilang;
  jarakAntarItem?: number;
  bungkus?: boolean;
  anak?: KomponenMobile[];
  gaya?: GayaMobile;
}

export class TataLetakFleksibelMobile extends KomponenMobile {
  public arah: ArahTataLetak = 'vertikal';
  public perataanUtama: PerataanUtama = 'mulai';
  public perataanSilang: PerataanSilang = 'regang';
  public jarakAntarItem: number = 0;
  public bungkus: boolean = false;

  constructor(opsi?: OpsiTataLetakFleksibel) {
    super('tata_letak_fleksibel', opsi?.id, {
      ...opsi?.gaya,
    });

    if (opsi?.arah) this.arah = opsi.arah;
    if (opsi?.perataanUtama) this.perataanUtama = opsi.perataanUtama;
    if (opsi?.perataanSilang) this.perataanSilang = opsi.perataanSilang;
    if (opsi?.jarakAntarItem !== undefined) this.jarakAntarItem = opsi.jarakAntarItem;
    if (opsi?.bungkus !== undefined) this.bungkus = opsi.bungkus;
    if (opsi?.anak) {
      opsi.anak.forEach(a => this.tambahAnak(a));
    }
  }

  public override toJson(): Record<string, any> {
    return {
      ...super.toJson(),
      arah: this.arah,
      perataanUtama: this.perataanUtama,
      perataanSilang: this.perataanSilang,
      jarakAntarItem: this.jarakAntarItem,
      bungkus: this.bungkus,
    };
  }
}

export class TataLetakVertikalMobile extends TataLetakFleksibelMobile {
  constructor(opsi?: Omit<OpsiTataLetakFleksibel, 'arah'>) {
    super({
      ...opsi,
      arah: 'vertikal',
    });
  }
}

export class TataLetakHorizontalMobile extends TataLetakFleksibelMobile {
  constructor(opsi?: Omit<OpsiTataLetakFleksibel, 'arah'>) {
    super({
      ...opsi,
      arah: 'horizontal',
    });
  }
}
