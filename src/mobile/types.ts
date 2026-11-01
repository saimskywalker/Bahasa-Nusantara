/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Definisi Tipe Data & Kontrak Nusantara Mobile Application Framework
 */

export type PlatformMobile = 'android' | 'ios' | 'emulator' | 'simulator' | 'desktop_preview';

export type OrientasiLayar = 'potret' | 'lanskap' | 'otomatis';

export type BreakpointMobile = 'ponsel_kecil' | 'ponsel_standar' | 'ponsel_besar' | 'tablet';

export enum StatusLifecycleMobile {
  DIBUAT = 'DIBUAT',
  MEMULAI = 'MEMULAI',
  AKTIF = 'AKTIF',
  JEDA = 'JEDA',
  RESUME = 'RESUME',
  LATAR_BELAKANG = 'LATAR_BELAKANG',
  BERHENTI = 'BERHENTI',
  DIHANCURKAN = 'DIHANCURKAN',
}

export type JenisIzinMobile =
  | 'kamera'
  | 'lokasi'
  | 'lokasi_latar'
  | 'notifikasi'
  | 'foto_media'
  | 'mikrofon'
  | 'bluetooth'
  | 'penyimpanan'
  | 'internet'
  | 'sensor';

export type StatusIzinMobile =
  | 'diberikan'
  | 'ditolak'
  | 'ditolak_permanen'
  | 'belum_diminta'
  | 'dibatasi'
  | 'tidak_didukung';

export interface PermintaanIzinMobile {
  izin: JenisIzinMobile;
  alasanRasional?: string;
  wajib?: boolean;
}

export interface HasilIzinMobile {
  izin: JenisIzinMobile;
  status: StatusIzinMobile;
  diberikan: boolean;
}

export interface KonfigurasiAplikasiMobile {
  nama: string;
  id: string; // misal: id.nusantara.aplikasi
  versi: string; // misal: 1.0.0
  nomorBuild: number;
  deskripsi?: string;
  pengembang?: string;
  ikon?: string;
  splashScreen?: string;
  orientasi?: OrientasiLayar;
  temaAwal?: 'terang' | 'gelap' | 'sistem';
  platformTarget: {
    android: boolean;
    ios: boolean;
  };
  versiMinPlatform?: {
    androidMinSdk?: number; // bawaan: 24 (Android 7.0)
    androidTargetSdk?: number; // bawaan: 34 (Android 14)
    iosDeploymentTarget?: string; // bawaan: 15.0
  };
  daftarIzin?: JenisIzinMobile[];
  daftarAset?: string[];
  kustom?: Record<string, any>;
}

export interface InfoPerangkat {
  namaPerangkat: string;
  model: string;
  produsen: string;
  platform: 'android' | 'ios' | 'desktop_preview';
  versiOS: string;
  apakahSimulator: boolean;
  lebarLayar: number;
  tinggiLayar: number;
  skalaPiksel: number;
  orientasi: OrientasiLayar;
  areaAman: InsetAreaAman;
}

export interface InsetAreaAman {
  atas: number;
  bawah: number;
  kiri: number;
  kanan: number;
}

export interface InfoJaringan {
  terhubung: boolean;
  tipe: 'wifi' | 'seluler' | 'ethernet' | 'tidak_ada' | 'tidak_dikenal';
  mahal: boolean; // cellular data / metered
}

export interface InfoBaterai {
  level: number; // 0.0 - 1.0
  sedangMengisi: boolean;
  modeHematDaya: boolean;
}

export interface KoordinatLokasi {
  latitude: number;
  longitude: number;
  akurasi?: number;
  ketinggian?: number;
  kecepatan?: number;
  stempelWaktu: number;
}

export interface OpsiNotifikasiLokal {
  id: string | number;
  judul: string;
  pesan: string;
  dataTambahan?: Record<string, any>;
  tundaDetik?: number;
  jadwalWaktu?: number;
  saluranId?: string;
}

export type JenisPeristiwaMobile =
  | 'klik'
  | 'tekan_lama'
  | 'teks_berubah'
  | 'nilai_berubah'
  | 'seleksi_berubah'
  | 'geser'
  | 'refresh'
  | 'navigasi_kembali'
  | 'lifecycle_berubah'
  | 'jaringan_berubah'
  | 'baterai_berubah';

export interface DataPeristiwaMobile<T = any> {
  idKomponen: string;
  jenis: JenisPeristiwaMobile;
  stempelWaktu: number;
  data?: T;
  nilaiTeks?: string;
  nilaiAngka?: number;
  nilaiLogika?: boolean;
}

export type PenanganPeristiwaMobile<T = any> = (peristiwa: DataPeristiwaMobile<T>) => void | Promise<void>;
