/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Komponen Toggle Mobile: Switch, Checkbox & Radio (Mobile Toggle Components)
 */

import { KomponenMobile, GayaMobile } from './component';

export class SakelarMobile extends KomponenMobile {
  public aktifStatus: boolean = false;
  public label?: string;

  constructor(
    aktifAwalAtauOpsi: boolean | { statusAktif?: boolean; aktif?: boolean; label?: string; padaBerubah?: (aktif: boolean) => void; gaya?: GayaMobile; id?: string } = false,
    label?: string,
    gaya?: GayaMobile,
    id?: string
  ) {
    super(
      'sakelar',
      typeof aktifAwalAtauOpsi === 'object' && aktifAwalAtauOpsi !== null ? aktifAwalAtauOpsi.id || id : id,
      typeof aktifAwalAtauOpsi === 'object' && aktifAwalAtauOpsi !== null ? aktifAwalAtauOpsi.gaya || gaya : gaya
    );

    if (typeof aktifAwalAtauOpsi === 'object' && aktifAwalAtauOpsi !== null) {
      this.aktifStatus = aktifAwalAtauOpsi.statusAktif ?? aktifAwalAtauOpsi.aktif ?? false;
      this.label = aktifAwalAtauOpsi.label || label;
      if (aktifAwalAtauOpsi.padaBerubah) {
        this.pasang('nilai_berubah', (e) => aktifAwalAtauOpsi.padaBerubah!(e.nilaiLogika ?? false));
      }
    } else {
      this.aktifStatus = Boolean(aktifAwalAtauOpsi);
      this.label = label;
    }
  }

  public get statusAktif(): boolean {
    return this.aktifStatus;
  }

  public set statusAktif(v: boolean) {
    this.setAktifStatus(v);
  }

  public setAktifkan(v: boolean): this {
    return this.setAktifStatus(v);
  }

  public isAktif(): boolean {
    return this.aktifStatus;
  }

  public setAktifStatus(status: boolean): this {
    const berubah = this.aktifStatus !== status;
    this.aktifStatus = status;
    if (berubah) {
      this.picu('nilai_berubah', { nilaiLogika: this.aktifStatus });
    }
    return this;
  }

  public toggle(): this {
    return this.setAktifStatus(!this.aktifStatus);
  }

  public override serialisasi(): Record<string, any> {
    return {
      ...super.serialisasi(),
      aktifStatus: this.aktifStatus,
      label: this.label,
    };
  }
}

export class KotakCentangMobile extends KomponenMobile {
  public label: string;
  public dicentang: boolean = false;

  constructor(
    labelAtauOpsi: string | { label?: string; dicentang?: boolean; centang?: boolean; padaBerubah?: (c: boolean) => void; gaya?: GayaMobile; id?: string } = '',
    dicentangAwal: boolean = false,
    gaya?: GayaMobile,
    id?: string
  ) {
    super(
      'kotak_centang',
      typeof labelAtauOpsi === 'object' && labelAtauOpsi !== null ? labelAtauOpsi.id || id : id,
      typeof labelAtauOpsi === 'object' && labelAtauOpsi !== null ? labelAtauOpsi.gaya || gaya : gaya
    );

    if (typeof labelAtauOpsi === 'object' && labelAtauOpsi !== null) {
      this.label = labelAtauOpsi.label || '';
      this.dicentang = labelAtauOpsi.dicentang ?? labelAtauOpsi.centang ?? false;
      if (labelAtauOpsi.padaBerubah) {
        this.pasang('nilai_berubah', (e) => labelAtauOpsi.padaBerubah!(e.nilaiLogika ?? false));
      }
    } else {
      this.label = String(labelAtauOpsi || '');
      this.dicentang = dicentangAwal;
    }
  }

  public isCentang(): boolean {
    return this.dicentang;
  }

  public setDicentang(v: boolean): this {
    return this.setCentang(v);
  }

  public setCentang(status: boolean): this {
    const berubah = this.dicentang !== status;
    this.dicentang = status;
    if (berubah) {
      this.picu('nilai_berubah', { nilaiLogika: this.dicentang });
    }
    return this;
  }

  public toggle(): this {
    return this.setCentang(!this.dicentang);
  }

  public override serialisasi(): Record<string, any> {
    return {
      ...super.serialisasi(),
      label: this.label,
      dicentang: this.dicentang,
    };
  }
}

export class TombolRadioMobile extends KomponenMobile {
  public label: string;
  public nilai: string;
  public grup: string;
  public terpilih: boolean = false;

  constructor(
    labelAtauOpsi: string | { label?: string; nilai?: string; grup?: string; terpilih?: boolean; padaPilih?: (v: string) => void; gaya?: GayaMobile; id?: string },
    nilai: string = '',
    grup: string = 'default',
    terpilihAwal: boolean = false,
    gaya?: GayaMobile,
    id?: string
  ) {
    super(
      'tombol_radio',
      typeof labelAtauOpsi === 'object' && labelAtauOpsi !== null ? labelAtauOpsi.id || id : id,
      typeof labelAtauOpsi === 'object' && labelAtauOpsi !== null ? labelAtauOpsi.gaya || gaya : gaya
    );

    if (typeof labelAtauOpsi === 'object' && labelAtauOpsi !== null) {
      this.label = labelAtauOpsi.label || '';
      this.nilai = labelAtauOpsi.nilai || this.label;
      this.grup = labelAtauOpsi.grup || 'default';
      this.terpilih = labelAtauOpsi.terpilih ?? false;
      if (labelAtauOpsi.padaPilih) {
        this.pasang('nilai_berubah', (e) => labelAtauOpsi.padaPilih!(e.nilaiTeks || ''));
      }
    } else {
      this.label = labelAtauOpsi;
      this.nilai = nilai;
      this.grup = grup;
      this.terpilih = terpilihAwal;
    }
  }

  public isTerpilih(): boolean {
    return this.terpilih;
  }

  public setTerpilih(status: boolean): this {
    const berubah = this.terpilih !== status;
    this.terpilih = status;
    if (berubah) {
      this.picu('nilai_berubah', { nilaiTeks: this.nilai, nilaiLogika: this.terpilih });
    }
    return this;
  }

  public override serialisasi(): Record<string, any> {
    return {
      ...super.serialisasi(),
      label: this.label,
      nilai: this.nilai,
      grup: this.grup,
      terpilih: this.terpilih,
    };
  }
}
