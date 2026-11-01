/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Navigator Tab & Antarmuka Bawah Mobile (Tab Navigator)
 */

import { KomponenMobile, GayaMobile } from '../ui/component';

export interface ItemTabMobile {
  kunci: string;
  label: string;
  ikon?: string;
  lencana?: string | number;
  pembuatKonten: () => KomponenMobile;
}

export interface OpsiNavigatorTabMobile {
  id?: string;
  daftarTab: ItemTabMobile[];
  tabAwal?: string;
  posisiBilah?: 'bawah' | 'atas';
  warnaAktif?: string;
  warnaTidakAktif?: string;
  gaya?: GayaMobile;
}

export class NavigatorTabMobile extends KomponenMobile {
  public daftarTab: ItemTabMobile[] = [];
  public tabAktif: string = '';
  public posisiBilah: 'bawah' | 'atas' = 'bawah';
  public warnaAktif: string = '#1976d2';
  public warnaTidakAktif: string = '#757575';
  private kontenCache: Map<string, KomponenMobile> = new Map();
  private pendengarPerubahanTab: Array<(kunciTab: string) => void> = [];

  constructor(opsi: OpsiNavigatorTabMobile) {
    super('navigator_tab', opsi.id, {
      fleksibel: 1,
      ...opsi.gaya,
    });

    this.daftarTab = [...opsi.daftarTab];
    if (opsi.posisiBilah) this.posisiBilah = opsi.posisiBilah;
    if (opsi.warnaAktif) this.warnaAktif = opsi.warnaAktif;
    if (opsi.warnaTidakAktif) this.warnaTidakAktif = opsi.warnaTidakAktif;

    const tabAwal = opsi.tabAwal || (this.daftarTab.length > 0 ? this.daftarTab[0].kunci : '');
    this.pilihTab(tabAwal);
  }

  public pilihTab(kunci: string): boolean {
    const target = this.daftarTab.find(t => t.kunci === kunci);
    if (!target) return false;

    this.tabAktif = kunci;
    let konten = this.kontenCache.get(kunci);
    if (!konten) {
      konten = target.pembuatKonten();
      this.kontenCache.set(kunci, konten);
    }

    this.anak = [konten];

    for (const p of this.pendengarPerubahanTab) {
      p(kunci);
    }
    return true;
  }

  public padaPerubahanTab(pendengar: (kunciTab: string) => void): () => void {
    this.pendengarPerubahanTab.push(pendengar);
    return () => {
      const idx = this.pendengarPerubahanTab.indexOf(pendengar);
      if (idx !== -1) this.pendengarPerubahanTab.splice(idx, 1);
    };
  }

  public perbaruiLencana(kunci: string, lencana?: string | number): void {
    const tab = this.daftarTab.find(t => t.kunci === kunci);
    if (tab) {
      tab.lencana = lencana;
    }
  }

  public override toJson(): Record<string, any> {
    return {
      ...super.toJson(),
      tabAktif: this.tabAktif,
      posisiBilah: this.posisiBilah,
      daftarTab: this.daftarTab.map(t => ({
        kunci: t.kunci,
        label: t.label,
        ikon: t.ikon,
        lencana: t.lencana,
      })),
    };
  }
}
