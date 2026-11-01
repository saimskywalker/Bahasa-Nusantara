/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Navigator Tumpukan Mobile (Mobile Stack Navigator)
 */

import { KomponenMobile, GayaMobile } from '../ui/component';
import { RuteMobile } from './route';

export interface EntriTumpukanNavigasi {
  namaRute: string;
  parameter: Record<string, any>;
  halaman: KomponenMobile;
  stempelWaktu: number;
}

export interface OpsiNavigatorTumpukan {
  id?: string;
  ruteAwal?: string;
  rute?: RuteMobile[];
  gaya?: GayaMobile;
}

export class NavigatorTumpukanMobile extends KomponenMobile {
  private daftarRute: Map<string, RuteMobile> = new Map();
  private riwayatTumpukan: EntriTumpukanNavigasi[] = [];
  private pendengarPerubahanRute: Array<(ruteAktif: EntriTumpukanNavigasi | null) => void> = [];

  constructor(opsi?: OpsiNavigatorTumpukan) {
    super('navigator_tumpukan', opsi?.id, {
      fleksibel: 1,
      ...opsi?.gaya,
    });

    if (opsi?.rute) {
      opsi.rute.forEach(r => this.daftarkanRute(r));
    }
    if (opsi?.ruteAwal) {
      this.dorong(opsi.ruteAwal);
    }
  }

  public daftarkanRute(rute: RuteMobile): this {
    this.daftarRute.set(rute.nama, rute);
    return this;
  }

  public dorong(namaRute: string, parameter: Record<string, any> = {}): boolean {
    const rute = this.daftarRute.get(namaRute);
    if (!rute) {
      return false;
    }

    const halaman = rute.pembuatHalaman(parameter);
    const entri: EntriTumpukanNavigasi = {
      namaRute,
      parameter,
      halaman,
      stempelWaktu: Date.now(),
    };

    this.riwayatTumpukan.push(entri);
    this.perbaruiAnakAktif();
    this.beritahuPerubahan();
    return true;
  }

  public kembali(): boolean {
    if (this.riwayatTumpukan.length <= 1) {
      return false; // Tidak bisa kembali jika di halaman awal
    }
    this.riwayatTumpukan.pop();
    this.perbaruiAnakAktif();
    this.beritahuPerubahan();
    return true;
  }

  public ganti(namaRute: string, parameter: Record<string, any> = {}): boolean {
    if (this.riwayatTumpukan.length > 0) {
      this.riwayatTumpukan.pop();
    }
    return this.dorong(namaRute, parameter);
  }

  public reset(namaRute: string, parameter: Record<string, any> = {}): boolean {
    this.riwayatTumpukan = [];
    return this.dorong(namaRute, parameter);
  }

  public bisaKembali(): boolean {
    return this.riwayatTumpukan.length > 1;
  }

  public dapatkanRuteAktif(): EntriTumpukanNavigasi | null {
    if (this.riwayatTumpukan.length === 0) return null;
    return this.riwayatTumpukan[this.riwayatTumpukan.length - 1];
  }

  public dapatkanKedalaman(): number {
    return this.riwayatTumpukan.length;
  }

  public padaPerubahanRute(pendengar: (ruteAktif: EntriTumpukanNavigasi | null) => void): () => void {
    this.pendengarPerubahanRute.push(pendengar);
    return () => {
      const idx = this.pendengarPerubahanRute.indexOf(pendengar);
      if (idx !== -1) this.pendengarPerubahanRute.splice(idx, 1);
    };
  }

  private perbaruiAnakAktif(): void {
    const aktif = this.dapatkanRuteAktif();
    this.anak = aktif ? [aktif.halaman] : [];
  }

  private beritahuPerubahan(): void {
    const aktif = this.dapatkanRuteAktif();
    for (const p of this.pendengarPerubahanRute) {
      p(aktif);
    }
  }

  public override toJson(): Record<string, any> {
    const aktif = this.dapatkanRuteAktif();
    return {
      ...super.toJson(),
      ruteAktif: aktif?.namaRute ?? null,
      kedalaman: this.riwayatTumpukan.length,
      daftarNamaRute: Array.from(this.daftarRute.keys()),
    };
  }
}
