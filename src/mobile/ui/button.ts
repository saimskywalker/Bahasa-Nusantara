/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Komponen Tombol Sentuh Mobile (Mobile Touch Button Component)
 */

import { KomponenMobile, GayaMobile } from './component';
import { PenanganPeristiwaMobile } from '../types';

export type VarianTombolMobile = 'primer' | 'sekunder' | 'garis' | 'teks' | 'bahaya';

export interface OpsiTombolMobile {
  teks?: string;
  label?: string;
  ikon?: string;
  varian?: VarianTombolMobile;
  memuat?: boolean;
  padaKlik?: PenanganPeristiwaMobile;
  gaya?: GayaMobile;
  id?: string;
}

export class TombolMobile extends KomponenMobile {
  public label: string;
  public ikon?: string;
  public varian: VarianTombolMobile = 'primer';
  public memuat: boolean = false;

  constructor(
    labelAtauOpsi: string | OpsiTombolMobile = '',
    aksiKlik?: PenanganPeristiwaMobile,
    gaya?: GayaMobile,
    id?: string
  ) {
    super(
      'tombol',
      typeof labelAtauOpsi === 'object' && labelAtauOpsi !== null ? labelAtauOpsi.id || id : id,
      typeof labelAtauOpsi === 'object' && labelAtauOpsi !== null ? labelAtauOpsi.gaya || gaya : gaya
    );

    if (typeof labelAtauOpsi === 'object' && labelAtauOpsi !== null) {
      this.label = labelAtauOpsi.teks || labelAtauOpsi.label || '';
      if (labelAtauOpsi.ikon) this.ikon = labelAtauOpsi.ikon;
      if (labelAtauOpsi.varian) this.varian = labelAtauOpsi.varian;
      if (labelAtauOpsi.memuat !== undefined) this.memuat = labelAtauOpsi.memuat;
      if (labelAtauOpsi.padaKlik) this.pasang('klik', labelAtauOpsi.padaKlik);
    } else {
      this.label = String(labelAtauOpsi || '');
      if (aksiKlik) {
        this.pasang('klik', aksiKlik);
      }
    }
  }

  public get teks(): string {
    return this.label;
  }

  public set teks(v: string) {
    this.label = v;
  }

  public picuKlik(): Promise<void> {
    return this.picu('klik');
  }

  public getLabel(): string {
    return this.label;
  }

  public setLabel(labelBaru: string): this {
    this.label = labelBaru;
    return this;
  }

  public setIkon(namaIkon: string): this {
    this.ikon = namaIkon;
    return this;
  }

  public setVarian(varian: VarianTombolMobile): this {
    this.varian = varian;
    return this;
  }

  public setMemuat(status: boolean): this {
    this.memuat = status;
    return this;
  }

  public override serialisasi(): Record<string, any> {
    return {
      ...super.serialisasi(),
      label: this.label,
      ikon: this.ikon,
      varian: this.varian,
      memuat: this.memuat,
    };
  }
}
