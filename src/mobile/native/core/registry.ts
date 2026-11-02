/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 38
 * Registri Native API Terpadu (Unified Native API Registry)
 */

import { JenisIzinMobile } from '../../types';
import { HasilOperasiNative, KodeGalatNative, buatHasilIzinDitolak, buatHasilTidakDidukung } from './result';
import { PengelolaIzinMobile } from '../../security/permission';
import { KonteksAplikasiMobile } from '../../core/application_context';
import { PengelolaKemampuanPerangkat } from './capabilities';

export type StatusImplementasiNative = 'didukung' | 'dasar' | 'eksperimental' | 'tidak_didukung';

export interface DefinisiParameterNative {
  nama: string;
  tipe: string;
  wajib: boolean;
  deskripsi: string;
  nilaiBawaan?: any;
}

export interface MetadataNativeAPI {
  nama: string;
  kategori:
    | 'perangkat'
    | 'kamera'
    | 'media'
    | 'lokasi'
    | 'notifikasi'
    | 'sensor'
    | 'bluetooth'
    | 'baterai'
    | 'jaringan'
    | 'audio'
    | 'berkas'
    | 'papan_klip'
    | 'bagikan'
    | 'simpan_aman'
    | 'haptik'
    | 'lifecycle';
  platform: Array<'android' | 'ios' | 'simulator'>;
  versiMinOS: {
    android?: number;
    ios?: string;
  };
  izin: JenisIzinMobile[];
  status: StatusImplementasiNative;
  parameter: DefinisiParameterNative[];
  tipeHasil: string;
  kemungkinanError: Array<KodeGalatNative | string>;
  dokumentasi: string;
  apakahTersedia?: (platformAktif?: string) => boolean;
  eksekusi: (argumen?: any) => Promise<HasilOperasiNative<any>> | HasilOperasiNative<any>;
}

export class RegistriNativeAPI {
  private static instance: RegistriNativeAPI;
  private daftarAPI: Map<string, MetadataNativeAPI> = new Map();
  private pengelolaIzin: PengelolaIzinMobile;
  private pengelolaKemampuan: PengelolaKemampuanPerangkat;

  private constructor() {
    this.pengelolaIzin = KonteksAplikasiMobile.dapatkanKonteks().pengelolaIzin;
    this.pengelolaKemampuan = PengelolaKemampuanPerangkat.dapatkanInstance();
  }

  public static dapatkanInstance(): RegistriNativeAPI {
    if (!RegistriNativeAPI.instance) {
      RegistriNativeAPI.instance = new RegistriNativeAPI();
    }
    return RegistriNativeAPI.instance;
  }

  public daftarkan(api: MetadataNativeAPI): void {
    this.daftarAPI.set(api.nama.toLowerCase(), api);
  }

  public dapatkan(nama: string): MetadataNativeAPI | undefined {
    return this.daftarAPI.get(nama.toLowerCase());
  }

  public apakahTerdaftar(nama: string): boolean {
    return this.daftarAPI.has(nama.toLowerCase());
  }

  public dapatkanSemua(): MetadataNativeAPI[] {
    return Array.from(this.daftarAPI.values());
  }

  public dapatkanBerdasarkanKategori(kategori: string): MetadataNativeAPI[] {
    return this.dapatkanSemua().filter((a) => a.kategori === kategori);
  }

  public async panggil(nama: string, argumen?: any): Promise<HasilOperasiNative<any>> {
    const api = this.dapatkan(nama);
    if (!api) {
      return buatHasilTidakDidukung(nama, 'Registri Native API');
    }

    // 1. Periksa ketersediaan platform & kemampuan perangkat
    const info = this.pengelolaKemampuan.dapatkanKemampuan();
    const platformAktif = info.sistem.platform;

    if (api.apakahTersedia && !api.apakahTersedia(platformAktif)) {
      return buatHasilTidakDidukung(nama, platformAktif);
    }

    // 2. Periksa perizinan wajib
    for (const iz of api.izin) {
      const statusIzin = this.pengelolaIzin.periksaIzin(iz);
      if (statusIzin === 'ditolak') {
        return buatHasilIzinDitolak(iz);
      }
      if (statusIzin === 'belum_diminta') {
        const hasilMinta = await this.pengelolaIzin.mintaIzin(iz, `Aplikasi membutuhkan izin '${iz}' untuk menjalankan '${nama}'.`);
        if (!hasilMinta.diberikan) {
          return buatHasilIzinDitolak(iz);
        }
      }
    }

    // 3. Eksekusi handler API
    try {
      return await api.eksekusi(argumen);
    } catch (err: any) {
      return {
        sukses: false,
        status: 'kesalahan_sistem',
        pesan: `Kegagalan eksekusi API '${nama}': ${err?.message || err}`,
        kodeGalat: KodeGalatNative.OPERASI_GAGAL,
        stempelWaktu: Date.now(),
      };
    }
  }
}
