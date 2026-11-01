/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Komponen Hamparan Antarmuka Mobile (Dialog, Alert, Snackbar)
 */

import { KomponenMobile, GayaMobile } from './component';

export interface OpsiTombolAksi {
  teks: string;
  peran?: 'utama' | 'batal' | 'bahaya';
  padaKlik?: () => void | Promise<void>;
}

export interface OpsiDialogMobile {
  id?: string;
  judul: string;
  konten?: string | KomponenMobile;
  bisaDibatalkan?: boolean;
  tombol?: OpsiTombolAksi[];
  gaya?: GayaMobile;
}

export class DialogMobile extends KomponenMobile {
  public judul: string;
  public pesanTeks?: string;
  public bisaDibatalkan: boolean = true;
  public tombol: OpsiTombolAksi[] = [];
  public terbuka: boolean = false;

  constructor(opsi: OpsiDialogMobile) {
    super('dialog', opsi.id, {
      warnaLatar: '#ffffff',
      radiusSudut: 16,
      padding: 20,
      elevasi: 12,
      ...opsi.gaya,
    });

    this.judul = opsi.judul;
    if (typeof opsi.konten === 'string') {
      this.pesanTeks = opsi.konten;
    } else if (opsi.konten instanceof KomponenMobile) {
      this.tambahAnak(opsi.konten);
    }
    if (opsi.bisaDibatalkan !== undefined) {
      this.bisaDibatalkan = opsi.bisaDibatalkan;
    }
    if (opsi.tombol) {
      this.tombol = [...opsi.tombol];
    } else {
      this.tombol = [{ teks: 'OK', peran: 'utama' }];
    }
  }

  public buka(): this {
    this.terbuka = true;
    this.terlihat = true;
    return this;
  }

  public tutup(): this {
    this.terbuka = false;
    this.terlihat = false;
    return this;
  }

  public async klikTombol(indeks: number): Promise<void> {
    const btn = this.tombol[indeks];
    if (btn) {
      if (btn.padaKlik) {
        await btn.padaKlik();
      }
      this.tutup();
    }
  }

  public override toJson(): Record<string, any> {
    return {
      ...super.toJson(),
      judul: this.judul,
      pesanTeks: this.pesanTeks,
      terbuka: this.terbuka,
      bisaDibatalkan: this.bisaDibatalkan,
      tombol: this.tombol.map(t => ({ teks: t.teks, peran: t.peran })),
    };
  }
}

export interface OpsiAlertMobile {
  id?: string;
  judul: string;
  pesan: string;
  teksKonfirmasi?: string;
  teksBatal?: string;
  padaKonfirmasi?: () => void | Promise<void>;
  padaBatal?: () => void | Promise<void>;
}

export class AlertMobile extends DialogMobile {
  constructor(opsi: OpsiAlertMobile) {
    const tombol: OpsiTombolAksi[] = [];
    if (opsi.teksBatal) {
      tombol.push({
        teks: opsi.teksBatal,
        peran: 'batal',
        padaKlik: opsi.padaBatal,
      });
    }
    tombol.push({
      teks: opsi.teksKonfirmasi || 'OK',
      peran: 'utama',
      padaKlik: opsi.padaKonfirmasi,
    });

    super({
      id: opsi.id,
      judul: opsi.judul,
      konten: opsi.pesan,
      tombol,
      bisaDibatalkan: Boolean(opsi.teksBatal),
    });
  }
}

export interface OpsiSnackbarMobile {
  id?: string;
  pesan: string;
  durasiMs?: number; // bawaan: 3000 ms
  teksAksi?: string;
  padaAksi?: () => void | Promise<void>;
  tipe?: 'info' | 'sukses' | 'peringatan' | 'bahaya';
  gaya?: GayaMobile;
}

export class SnackbarMobile extends KomponenMobile {
  public pesan: string;
  public durasiMs: number = 3000;
  public teksAksi?: string;
  public padaAksi?: () => void | Promise<void>;
  public tipe: 'info' | 'sukses' | 'peringatan' | 'bahaya' = 'info';
  public terbuka: boolean = false;
  private timerOtomatis?: any;

  constructor(opsi: OpsiSnackbarMobile) {
    let warnaLatar = '#323232';
    if (opsi.tipe === 'sukses') warnaLatar = '#2e7d32';
    else if (opsi.tipe === 'peringatan') warnaLatar = '#f57c00';
    else if (opsi.tipe === 'bahaya') warnaLatar = '#d32f2f';

    super('snackbar', opsi.id, {
      warnaLatar,
      warnaTeks: '#ffffff',
      radiusSudut: 8,
      padding: [12, 16],
      elevasi: 6,
      ...opsi.gaya,
    });

    this.pesan = opsi.pesan;
    if (opsi.durasiMs !== undefined) {
      this.durasiMs = opsi.durasiMs;
    }
    this.teksAksi = opsi.teksAksi;
    this.padaAksi = opsi.padaAksi;
    if (opsi.tipe) {
      this.tipe = opsi.tipe;
    }
  }

  public tampilkan(): this {
    this.terbuka = true;
    this.terlihat = true;
    if (this.durasiMs > 0) {
      if (this.timerOtomatis) clearTimeout(this.timerOtomatis);
      this.timerOtomatis = setTimeout(() => {
        this.sembunyikan();
      }, this.durasiMs);
    }
    return this;
  }

  public sembunyikan(): this {
    this.terbuka = false;
    this.terlihat = false;
    if (this.timerOtomatis) {
      clearTimeout(this.timerOtomatis);
      this.timerOtomatis = undefined;
    }
    return this;
  }

  public async picuAksi(): Promise<void> {
    if (this.padaAksi) {
      await this.padaAksi();
    }
    this.sembunyikan();
  }

  public override toJson(): Record<string, any> {
    return {
      ...super.toJson(),
      pesan: this.pesan,
      tipe: this.tipe,
      terbuka: this.terbuka,
      durasiMs: this.durasiMs,
      teksAksi: this.teksAksi,
    };
  }
}
