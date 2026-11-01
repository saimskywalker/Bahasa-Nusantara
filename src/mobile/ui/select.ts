/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Komponen Dropdown & Pemilih Mobile (Mobile Select & Picker Component)
 */

import { KomponenMobile, GayaMobile } from './component';

export interface OpsiPilihanMobile {
  label: string;
  nilai: string;
}

export class DropdownMobile extends KomponenMobile {
  public daftarOpsi: OpsiPilihanMobile[] = [];
  public nilaiTerpilih?: string;
  public placeholder: string;

  constructor(
    opsiAtauObj: Array<string | OpsiPilihanMobile> | { daftarOpsi?: Array<string | OpsiPilihanMobile>; nilaiTerpilih?: string; placeholder?: string; padaPilih?: (v: string) => void; gaya?: GayaMobile; id?: string } = [],
    nilaiAwal?: string,
    placeholder: string = 'Pilih salah satu...',
    gaya?: GayaMobile,
    id?: string
  ) {
    const isObj = typeof opsiAtauObj === 'object' && !Array.isArray(opsiAtauObj) && opsiAtauObj !== null;
    super(
      'dropdown',
      isObj ? opsiAtauObj.id || id : id,
      isObj ? opsiAtauObj.gaya || gaya : gaya
    );

    if (isObj) {
      this.placeholder = opsiAtauObj.placeholder || placeholder;
      this.setDaftarOpsi(opsiAtauObj.daftarOpsi || []);
      this.nilaiTerpilih = opsiAtauObj.nilaiTerpilih || nilaiAwal;
      if (opsiAtauObj.padaPilih) {
        this.pasang('seleksi_berubah', (e) => opsiAtauObj.padaPilih!(e.nilaiTeks || ''));
      }
    } else {
      this.placeholder = placeholder;
      this.setDaftarOpsi(opsiAtauObj as any);
      this.nilaiTerpilih = nilaiAwal;
    }
  }

  public setDaftarOpsi(opsi: Array<string | OpsiPilihanMobile>): this {
    this.daftarOpsi = opsi.map((o) => (typeof o === 'string' ? { label: o, nilai: o } : o));
    return this;
  }

  public getTerpilih(): string | undefined {
    return this.nilaiTerpilih;
  }

  public setTerpilih(nilai: string): this {
    const berubah = this.nilaiTerpilih !== nilai;
    this.nilaiTerpilih = nilai;
    if (berubah) {
      this.picu('seleksi_berubah', { nilaiTeks: this.nilaiTerpilih });
    }
    return this;
  }

  public override serialisasi(): Record<string, any> {
    return {
      ...super.serialisasi(),
      daftarOpsi: this.daftarOpsi,
      nilaiTerpilih: this.nilaiTerpilih,
      placeholder: this.placeholder,
    };
  }
}
