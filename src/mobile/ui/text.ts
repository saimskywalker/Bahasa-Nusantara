/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Komponen Teks Mobile (Mobile Text Component)
 */

import { KomponenMobile, GayaMobile } from './component';

export class TeksMobile extends KomponenMobile {
  public teks: string;
  public batasBaris?: number;

  constructor(teksAtauOpsi: string | { teks?: string; gaya?: GayaMobile; id?: string } = '', gaya?: GayaMobile, id?: string) {
    super(
      'teks',
      typeof teksAtauOpsi === 'object' && teksAtauOpsi !== null ? teksAtauOpsi.id || id : id,
      typeof teksAtauOpsi === 'object' && teksAtauOpsi !== null ? teksAtauOpsi.gaya || gaya : gaya
    );

    if (typeof teksAtauOpsi === 'object' && teksAtauOpsi !== null) {
      this.teks = teksAtauOpsi.teks || '';
    } else {
      this.teks = String(teksAtauOpsi || '');
    }
  }

  public getTeks(): string {
    return this.teks;
  }

  public setTeks(teksBaru: string): this {
    this.teks = teksBaru;
    return this;
  }

  public setBatasBaris(batas: number): this {
    this.batasBaris = batas;
    return this;
  }

  public override serialisasi(): Record<string, any> {
    return {
      ...super.serialisasi(),
      teks: this.teks,
      batasBaris: this.batasBaris,
    };
  }
}
