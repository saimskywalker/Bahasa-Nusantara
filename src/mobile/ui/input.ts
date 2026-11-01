/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Komponen Input Teks & Sandi Mobile (Mobile Text & Password Input Component)
 */

import { KomponenMobile, GayaMobile } from './component';

export type TipeKeyboardMobile = 'teks' | 'angka' | 'email' | 'telepon' | 'url';

export class InputTeksMobile extends KomponenMobile {
  public nilai: string;
  public placeholder: string;
  public tipeKeyboard: TipeKeyboardMobile = 'teks';
  public hanyaBaca: boolean = false;
  public batasKarakter?: number;

  constructor(
    placeholderAtauOpsi: string | { placeholder?: string; teks?: string; nilai?: string; padaBerubah?: (teks: string) => void; gaya?: GayaMobile; id?: string } = '',
    nilaiAwal: string = '',
    gaya?: GayaMobile,
    id?: string
  ) {
    super(
      'input_teks',
      typeof placeholderAtauOpsi === 'object' && placeholderAtauOpsi !== null ? placeholderAtauOpsi.id || id : id,
      typeof placeholderAtauOpsi === 'object' && placeholderAtauOpsi !== null ? placeholderAtauOpsi.gaya || gaya : gaya
    );

    if (typeof placeholderAtauOpsi === 'object' && placeholderAtauOpsi !== null) {
      this.placeholder = placeholderAtauOpsi.placeholder || '';
      this.nilai = placeholderAtauOpsi.teks || placeholderAtauOpsi.nilai || '';
      if (placeholderAtauOpsi.padaBerubah) {
        this.pasang('teks_berubah', (e) => placeholderAtauOpsi.padaBerubah!(e.nilaiTeks || ''));
      }
    } else {
      this.placeholder = String(placeholderAtauOpsi || '');
      this.nilai = nilaiAwal;
    }
  }

  public get teks(): string {
    return this.nilai;
  }

  public set teks(v: string) {
    this.setNilai(v);
  }

  public setTeks(v: string): this {
    return this.setNilai(v);
  }

  public getNilai(): string {
    return this.nilai;
  }

  public setNilai(nilaiBaru: string): this {
    if (this.hanyaBaca) return this;
    if (this.batasKarakter && nilaiBaru.length > this.batasKarakter) {
      nilaiBaru = nilaiBaru.slice(0, this.batasKarakter);
    }
    const berubah = this.nilai !== nilaiBaru;
    this.nilai = nilaiBaru;
    if (berubah) {
      this.picu('teks_berubah', { nilaiTeks: this.nilai });
    }
    return this;
  }

  public bersihkan(): this {
    return this.setNilai('');
  }

  public setPlaceholder(p: string): this {
    this.placeholder = p;
    return this;
  }

  public setTipeKeyboard(tipe: TipeKeyboardMobile): this {
    this.tipeKeyboard = tipe;
    return this;
  }

  public setHanyaBaca(hb: boolean): this {
    this.hanyaBaca = hb;
    return this;
  }

  public override serialisasi(): Record<string, any> {
    return {
      ...super.serialisasi(),
      nilai: this.nilai,
      placeholder: this.placeholder,
      tipeKeyboard: this.tipeKeyboard,
      hanyaBaca: this.hanyaBaca,
      batasKarakter: this.batasKarakter,
    };
  }
}

export class InputSandiMobile extends InputTeksMobile {
  public readonly apakahSandi: boolean = true;
  public sandiTerlihat: boolean = false;

  constructor(placeholderAtauOpsi: string | any = 'Kata Sandi', nilaiAwal: string = '', gaya?: GayaMobile, id?: string) {
    super(placeholderAtauOpsi, nilaiAwal, gaya, id);
  }

  public toggleTampakSandi(): this {
    this.sandiTerlihat = !this.sandiTerlihat;
    return this;
  }

  public override serialisasi(): Record<string, any> {
    return {
      ...super.serialisasi(),
      jenis: 'input_sandi',
      nilai: this.sandiTerlihat ? this.nilai : '••••••••',
      sandiTerlihat: this.sandiTerlihat,
    };
  }
}
