/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Definisi Rute Navigasi Mobile (Mobile Route Definition)
 */

import { KomponenMobile } from '../ui/component';

export interface OpsiRuteMobile {
  nama: string;
  judul?: string;
  pembuatHalaman: (parameter: Record<string, any>) => KomponenMobile;
  transisi?: 'geser' | 'pudar' | 'bawah_ke_atas' | 'tanpa_animasi';
  tampilkanBilahJudul?: boolean;
}

export class RuteMobile {
  public readonly nama: string;
  public readonly judul: string;
  public readonly pembuatHalaman: (parameter: Record<string, any>) => KomponenMobile;
  public readonly transisi: 'geser' | 'pudar' | 'bawah_ke_atas' | 'tanpa_animasi';
  public readonly tampilkanBilahJudul: boolean;

  constructor(opsi: OpsiRuteMobile) {
    this.nama = opsi.nama;
    this.judul = opsi.judul || opsi.nama;
    this.pembuatHalaman = opsi.pembuatHalaman;
    this.transisi = opsi.transisi || 'geser';
    this.tampilkanBilahJudul = opsi.tampilkanBilahJudul ?? true;
  }
}
