/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 38
 * Standar Hasil & Penanganan Galat Native API (Native API Result & Error Standards)
 */

export type StatusHasilNative =
  | 'sukses'
  | 'gagal'
  | 'dibatalkan'
  | 'izin_ditolak'
  | 'tidak_didukung'
  | 'perangkat_tidak_tersedia'
  | 'timeout'
  | 'kesalahan_sistem'
  | 'kesalahan_konfigurasi';

export enum KodeGalatNative {
  SUKSES = 'SUKSES',
  IZIN_DITOLAK = 'IZIN_DITOLAK',
  TIDAK_DIDUKUNG = 'TIDAK_DIDUKUNG',
  PERANGKAT_TIDAK_TERSEDIA = 'PERANGKAT_TIDAK_TERSEDIA',
  DIBATALKAN_PENGGUNA = 'DIBATALKAN_PENGGUNA',
  TIMEOUT = 'TIMEOUT',
  ARGUMEN_TIDAK_VALID = 'ARGUMEN_TIDAK_VALID',
  OPERASI_GAGAL = 'OPERASI_GAGAL',
  SUMBER_DAYA_SIBUK = 'SUMBER_DAYA_SIBUK',
  PATH_TIDAK_AMAN = 'PATH_TIDAK_AMAN',
  UKURAN_MELEBIHI_BATAS = 'UKURAN_MELEBIHI_BATAS',
  ENKRIPSI_GAGAL = 'ENKRIPSI_GAGAL',
  JARINGAN_TERPUTUS = 'JARINGAN_TERPUTUS',
  KESALAHAN_SISTEM = 'KESALAHAN_SISTEM',
}

export interface HasilOperasiNative<T = any> {
  sukses: boolean;
  status: StatusHasilNative;
  data?: T;
  pesan?: string;
  kodeGalat?: KodeGalatNative | string;
  stempelWaktu: number;
  metadata?: Record<string, any>;
}

export class GalatNativeAPI extends Error {
  public readonly kode: KodeGalatNative | string;
  public readonly status: StatusHasilNative;
  public readonly rincian?: Record<string, any>;

  constructor(
    pesan: string,
    kode: KodeGalatNative | string = KodeGalatNative.OPERASI_GAGAL,
    status: StatusHasilNative = 'gagal',
    rincian?: Record<string, any>
  ) {
    super(pesan);
    this.name = 'GalatNativeAPI';
    this.kode = kode;
    this.status = status;
    this.rincian = rincian;
  }
}

export function buatHasilSukses<T>(data: T, pesan: string = 'Operasi native berhasil diselesaikan.', metadata?: Record<string, any>): HasilOperasiNative<T> {
  return {
    sukses: true,
    status: 'sukses',
    data,
    pesan,
    kodeGalat: KodeGalatNative.SUKSES,
    stempelWaktu: Date.now(),
    metadata,
  };
}

export function buatHasilGagal<T = any>(
  pesan: string,
  kodeGalat: KodeGalatNative | string = KodeGalatNative.OPERASI_GAGAL,
  status: StatusHasilNative = 'gagal',
  metadata?: Record<string, any>
): HasilOperasiNative<T> {
  return {
    sukses: false,
    status,
    pesan,
    kodeGalat,
    stempelWaktu: Date.now(),
    metadata,
  };
}

export function buatHasilIzinDitolak<T = any>(namaIzin: string): HasilOperasiNative<T> {
  return buatHasilGagal<T>(
    `Izin '${namaIzin}' ditolak oleh pengguna atau sistem. Silakan berikan izin melalui pengaturan perangkat.`,
    KodeGalatNative.IZIN_DITOLAK,
    'izin_ditolak',
    { izin: namaIzin }
  );
}

export function buatHasilTidakDidukung<T = any>(fitur: string, platform: string = 'sistem saat ini'): HasilOperasiNative<T> {
  return buatHasilGagal<T>(
    `Fitur perangkat '${fitur}' tidak didukung pada ${platform}.`,
    KodeGalatNative.TIDAK_DIDUKUNG,
    'tidak_didukung',
    { fitur, platform }
  );
}

export function buatHasilDibatalkan<T = any>(operasi: string): HasilOperasiNative<T> {
  return buatHasilGagal<T>(
    `Operasi '${operasi}' dibatalkan oleh pengguna.`,
    KodeGalatNative.DIBATALKAN_PENGGUNA,
    'dibatalkan',
    { operasi }
  );
}
