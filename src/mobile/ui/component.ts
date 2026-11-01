/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Komponen Dasar Antarmuka Mobile (Mobile Base Component)
 */

import { JenisPeristiwaMobile, PenanganPeristiwaMobile, DataPeristiwaMobile } from '../types';

let counterIdKomponen = 0;

export interface GayaMobile {
  lebar?: number | string;
  tinggi?: number | string;
  lebarMin?: number;
  tinggiMin?: number;
  lebarMaks?: number;
  tinggiMaks?: number;
  padding?: number | [number, number] | [number, number, number, number];
  margin?: number | [number, number] | [number, number, number, number];
  warnaLatar?: string;
  warnaTeks?: string;
  warnaBorder?: string;
  ketebalanBorder?: number;
  radiusSudut?: number;
  ukuranFont?: number;
  beratFont?: 'normal' | 'tebal' | 'tipis';
  perataanTeks?: 'kiri' | 'tengah' | 'kanan';
  fleksibel?: number;
  elevasi?: number; // bayangan Android/iOS
  tampak?: boolean;
  dapatDiakses?: boolean;
}

export abstract class KomponenMobile {
  public readonly id: string;
  public readonly jenis: string;
  public gaya: GayaMobile = {};
  public aktif: boolean = true;
  public terlihat: boolean = true;
  public anak: KomponenMobile[] = [];
  public induk?: KomponenMobile;
  protected pendengarPeristiwa: Map<JenisPeristiwaMobile, Set<PenanganPeristiwaMobile>> = new Map();

  constructor(jenis: string, idKustom?: string, gayaAwal?: GayaMobile) {
    this.jenis = jenis;
    counterIdKomponen++;
    this.id = idKustom || `mobile_${jenis}_${counterIdKomponen}`;
    if (gayaAwal) {
      this.gaya = { ...gayaAwal };
    }
  }

  public tambahAnak(anak: KomponenMobile): this {
    anak.induk = this;
    this.anak.push(anak);
    return this;
  }

  public hapusAnak(anak: KomponenMobile): boolean {
    const idx = this.anak.indexOf(anak);
    if (idx !== -1) {
      this.anak.splice(idx, 1);
      anak.induk = undefined;
      return true;
    }
    return false;
  }

  public setGaya(gayaBaru: GayaMobile): this {
    this.gaya = { ...this.gaya, ...gayaBaru };
    return this;
  }

  public setAktif(status: boolean): this {
    this.aktif = status;
    return this;
  }

  public setTerlihat(status: boolean): this {
    this.terlihat = status;
    return this;
  }

  public pasang(jenis: JenisPeristiwaMobile, penangan: PenanganPeristiwaMobile): () => void {
    let set = this.pendengarPeristiwa.get(jenis);
    if (!set) {
      set = new Set();
      this.pendengarPeristiwa.set(jenis, set);
    }
    set.add(penangan);
    return () => set?.delete(penangan);
  }

  public async picu(jenis: JenisPeristiwaMobile, data?: any): Promise<void> {
    if (!this.aktif && jenis !== 'navigasi_kembali') return;

    const peristiwa: DataPeristiwaMobile = {
      idKomponen: this.id,
      jenis,
      stempelWaktu: Date.now(),
      data: data?.data ?? data,
      nilaiTeks: data?.nilaiTeks,
      nilaiAngka: data?.nilaiAngka,
      nilaiLogika: data?.nilaiLogika,
    };

    const set = this.pendengarPeristiwa.get(jenis);
    if (set) {
      for (const fn of set) {
        try {
          await fn(peristiwa);
        } catch (err) {
          console.error(`[KomponenMobile] Galat saat menjalankan penangan '${jenis}' pada ${this.id}:`, err);
        }
      }
    }
  }

  public serialisasi(): Record<string, any> {
    return {
      id: this.id,
      jenis: this.jenis,
      aktif: this.aktif,
      terlihat: this.terlihat,
      gaya: this.gaya,
      anak: this.anak.map((a) => a.serialisasi()),
    };
  }

  public toJson(): Record<string, any> {
    return this.serialisasi();
  }

  public async picuPeristiwa(jenis: JenisPeristiwaMobile, data?: any): Promise<void> {
    return this.picu(jenis, data);
  }

  public hancurkan(): void {
    for (const a of this.anak) {
      a.hancurkan();
    }
    this.anak = [];
    this.pendengarPeristiwa.clear();
    this.induk = undefined;
  }
}
