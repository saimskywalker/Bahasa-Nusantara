/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 39
 * Definisi Tipe dan Kontrak Nusantara Mobile Networking & Cloud Services
 */

export type MetodeHTTPMobile = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export type PrioritasPermintaan = 'tinggi' | 'normal' | 'rendah';

export type StatusJaringanTipe = 'online' | 'offline' | 'terbatas';

export type TipeKoneksiJaringan = 'wifi' | 'seluler' | 'ethernet' | 'tidak_ada' | 'lainnya';

export interface InfoKoneksiJaringan {
  terhubung: boolean;
  tipe: TipeKoneksiJaringan;
  status: StatusJaringanTipe;
  dapatDijangkauBackend: boolean;
  mahal: boolean;
  stempelWaktu: number;
}

export interface KonfigurasiKlienAPI {
  baseUrl?: string;
  headersBawaan?: Record<string, string>;
  batasWaktuMs?: number;
  cobaUlangMaks?: number;
  jedaCobaUlangMs?: number;
  validasiTLS?: boolean;
  antreanOffline?: boolean;
  prioritasBawaan?: PrioritasPermintaan;
}

export interface OpsiPermintaanAPI {
  metode?: MetodeHTTPMobile;
  query?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  body?: any;
  batasWaktuMs?: number;
  prioritas?: PrioritasPermintaan;
  idempotencyKey?: string;
  izinkanCobaUlang?: boolean;
  lewatiAntreanOffline?: boolean;
}

export interface HasilResponAPI<T = any> {
  sukses: boolean;
  status: number;
  statusTeks: string;
  headers: Record<string, string>;
  data: T;
  galat?: string;
  dariCache?: boolean;
  idempotencyKey?: string;
  durasiMs: number;
  stempelWaktu: number;
}

export type SkemaAutentikasi = 'bearer' | 'apiKey' | 'basic' | 'oauth2_pkce';

export type StatusAutentikasi = 'belum_masuk' | 'terautentikasi' | 'kedaluwarsa' | 'memperbarui';

export interface InfoTokenAutentikasi {
  skema: SkemaAutentikasi;
  accessToken: string;
  refreshToken?: string;
  tipeToken?: string;
  kedaluwarsaPada?: number; // Epoch timestamp ms
  lingkup?: string[];
  dataPengguna?: Record<string, any>;
  dibuatPada: number;
}

export interface KonfigurasiPKCE {
  clientId: string;
  authEndpoint: string;
  tokenEndpoint: string;
  redirectUri: string;
  lingkup: string[];
  codeVerifier: string;
  codeChallenge: string;
  state: string;
}

export type StatusOperasiOffline = 'tertunda' | 'diproses' | 'gagal' | 'sukses';

export interface OperasiOffline {
  id: string;
  endpoint: string;
  metode: MetodeHTTPMobile;
  body?: any;
  headers?: Record<string, string>;
  stempelWaktu: number;
  percobaan: number;
  status: StatusOperasiOffline;
  idempotencyKey: string;
  pesanGalat?: string;
}

export type StrategiKonflik = 'server_menang' | 'klien_menang' | 'tulis_terakhir_menang' | 'manual';

export interface ButirKonflikSinkronisasi {
  id: string;
  dataLokal: any;
  dataServer: any;
  waktuLokal: number;
  waktuServer: number;
  strategi: StrategiKonflik;
  diselesaikan: boolean;
  hasilAkhir?: any;
}

export interface HasilSinkronisasi {
  sukses: boolean;
  jumlahTerkirim: number;
  jumlahGagal: number;
  konflik: ButirKonflikSinkronisasi[];
  stempelWaktuSinkronisasi: number;
  durasiMs: number;
  catatan?: string;
}

export interface MetadataBerkasCloud {
  id: string;
  nama: string;
  ukuran: number;
  mimeType: string;
  url: string;
  folder?: string;
  dibuatPada: string;
  etag?: string;
  metaKustom?: Record<string, string>;
}

export interface OpsiUnggahCloud {
  namaBerkas: string;
  konten: string | Buffer;
  mimeType?: string;
  folder?: string;
  metadata?: Record<string, string>;
  padaProgres?: (persen: number, byteTerkirim: number, totalByte: number) => void;
}

export interface HasilTransferBerkas {
  sukses: boolean;
  berkas?: MetadataBerkasCloud;
  galat?: string;
  stempelWaktu: number;
}

export interface KonfigurasiCloudMobile {
  namaLingkungan: 'pengembangan' | 'staging' | 'produksi';
  apiUrl: string;
  timeoutMs: number;
  cobaUlangMaks: number;
  validasiSertifikatTLS: boolean;
  kebijakanSinkronisasi: 'otomatis' | 'manual';
  penyediaCloud: string;
  storageEndpoint?: string;
  pushNotificationProvider?: string;
  databaseRestUrl?: string;
}

export interface NotifikasiPushMasuk {
  id: string;
  judul: string;
  pesan: string;
  data?: Record<string, any>;
  deepLink?: string;
  stempelWaktu: number;
  statusLatarBelakang: boolean;
}
