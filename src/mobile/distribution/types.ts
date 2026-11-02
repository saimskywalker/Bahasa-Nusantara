/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 40
 * Definisi Tipe Data & Kontrak Mobile App Distribution & Publishing
 */

export type PlatformDistribusi = 'android' | 'ios' | 'semua';
export type TipeBuildAndroid = 'debug' | 'release';
export type FormatPaketAndroid = 'apk' | 'aab';
export type SaluranRilis = 'debug' | 'internal' | 'beta' | 'produksi';
export type LingkunganDistribusi = 'development' | 'testing' | 'staging' | 'production';

export interface KonfigurasiSigningAndroid {
  keystorePath?: string;
  keyAlias?: string;
  storePasswordEnv?: string; // Nama environment variable, jangan simpan plaintext password!
  keyPasswordEnv?: string;
  berlakuSampaiTahun?: number;
  sidikJariSha256?: string;
  skemaSigning?: ('v1' | 'v2' | 'v3' | 'v4')[];
  apakahTervalidasi?: boolean;
}

export interface KonfigurasiSigningIOS {
  bundleIdentifier: string;
  teamId?: string;
  identitasSigning?: string; // misal: "Apple Distribution: Developer Name (TEAM123)"
  jalurProvisioningProfile?: string;
  metodeEkspor?: 'app-store' | 'ad-hoc' | 'enterprise' | 'development';
  entitlements?: Record<string, any>;
  apakahTervalidasi?: boolean;
}

export interface SpesifikasiIkonAset {
  nama: string;
  lebar: number;
  tinggi: number;
  platform: 'android' | 'ios' | 'bersama';
  skala?: string; // misal: '1x', '2x', '3x', 'mdpi', 'hdpi', dst.
  jalurRelatif?: string;
  wajib: boolean;
}

export interface SpesifikasiSplashScreen {
  warnaLatar: string;
  jalurGambarLogo?: string;
  durasiTampilMs?: number;
  orientasi?: 'potret' | 'lanskap' | 'semua';
  androidSplashXml?: string;
  iosLaunchScreenStoryboard?: string;
}

export interface KonfigurasiDistribusiLengkap {
  aplikasi: {
    nama: string;
    id: string; // misal: id.nusantara.aplikasi
    versi: string; // misal: 1.0.0
    nomorBuild: number; // iOS build number
    kodeVersiAndroid: number; // Android versionCode
    deskripsi?: string;
    pengembang?: string;
    hakCipta?: string;
  };
  lingkungan: LingkunganDistribusi;
  android: {
    minSdk: number; // bawaan: 24 (Android 7.0)
    targetSdk: number; // bawaan: 34 (Android 14)
    compileSdk: number; // bawaan: 34
    tipeBuild: TipeBuildAndroid[];
    formatPaket: FormatPaketAndroid[];
    signing: KonfigurasiSigningAndroid;
    outputDir: string;
    izin: string[];
    fiturHardware?: string[];
  };
  ios: {
    deploymentTarget: string; // bawaan: "15.0"
    bundleId: string;
    signing: KonfigurasiSigningIOS;
    outputDir: string;
    deskripsiIzin: Record<string, string>; // misal: NSCameraUsageDescription
    perangkatDidukung: ('iphone' | 'ipad')[];
  };
  aset: {
    direktoriIkon: string;
    direktoriSplash: string;
    ikonUtama?: string;
    splashUtama?: string;
  };
  metadataPublikasi?: {
    kebijakanPrivasiUrl?: string;
    dukunganUrl?: string;
    kategoriAplikasi?: string;
    ratingUsia?: string;
    kataKunci?: string[];
    catatanRilis?: string;
  };
}

export interface ItemChecklistRilis {
  id: string;
  kategori: 'android' | 'ios' | 'keamanan' | 'aset' | 'metadata';
  judul: string;
  status: 'lulus' | 'peringatan' | 'gagal' | 'belum_diperiksa';
  pesan: string;
  wajib: boolean;
}

export interface LaporanValidasiRilis {
  waktuPemeriksaan: string;
  lingkungan: LingkunganDistribusi;
  siapRilis: boolean;
  totalPemeriksaan: number;
  totalLulus: number;
  totalPeringatan: number;
  totalGagal: number;
  ringkasanAndroid: {
    siap: boolean;
    masalah: string[];
  };
  ringkasanIOS: {
    siap: boolean;
    masalah: string[];
  };
  checklist: ItemChecklistRilis[];
}

export interface ArtefakHasilDistribusi {
  platform: 'android' | 'ios';
  format: 'apk' | 'aab' | 'ipa' | 'xcarchive';
  tipeBuild: 'debug' | 'release';
  namaBerkas: string;
  jalurLokal: string;
  ukuranBytes: number;
  sha256: string;
  apakahDitandatangani: boolean;
  skemaSignature?: string;
  waktuDibuat: string;
}

export interface LaporanBuildMobile {
  idBuild: string;
  waktuMulai: string;
  durasiMs: number;
  platform: 'android' | 'ios' | 'keduanya';
  tipeBuild: 'debug' | 'release';
  lingkungan: LingkunganDistribusi;
  sukses: boolean;
  pesan: string;
  toolchain: {
    androidSdk?: { terdeteksi: boolean; jalur?: string };
    jdk?: { terdeteksi: boolean; versi?: string };
    gradle?: { terdeteksi: boolean; versi?: string };
    xcode?: { terdeteksi: boolean; versi?: string; apakahMacOS: boolean };
  };
  artefak: ArtefakHasilDistribusi[];
  peringatan: string[];
  daftarGalat: string[];
}
