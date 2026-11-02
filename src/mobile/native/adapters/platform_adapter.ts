/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 38
 * Antarmuka Adaptor Platform Native (Platform Adapter Interface)
 */

import { HasilOperasiNative } from '../core/result';

export interface AdaptorPlatformNative {
  readonly namaPlatform: 'android' | 'ios' | 'simulator';

  // Device Info
  dapatkanInfoPerangkat(): Promise<HasilOperasiNative<any>>;

  // Camera
  ambilFoto(opsi?: { kamera?: 'depan' | 'belakang'; flash?: boolean; kualitas?: number }): Promise<HasilOperasiNative<any>>;

  // Media Picker
  pilihMedia(opsi?: { tipe?: 'foto' | 'video' | 'semua'; maksPilihan?: number }): Promise<HasilOperasiNative<any>>;

  // Location
  dapatkanLokasi(opsi?: { akurasiTinggi?: boolean; timeoutMs?: number }): Promise<HasilOperasiNative<any>>;

  // Notification
  jadwalkanNotifikasi(notif: { id: string; judul: string; pesan: string; tundaDetik?: number }): Promise<HasilOperasiNative<any>>;
  batalkanNotifikasi(id: string): Promise<HasilOperasiNative<any>>;

  // Sensors
  bacaSensor(sensor: 'akselerometer' | 'giroskop' | 'magnetometer' | 'kedekatan' | 'cahaya'): Promise<HasilOperasiNative<any>>;

  // Bluetooth
  pindaiBluetooth(opsi?: { durasiMs?: number }): Promise<HasilOperasiNative<any>>;

  // Battery
  dapatkanStatusBaterai(): Promise<HasilOperasiNative<any>>;

  // Network
  dapatkanStatusJaringan(): Promise<HasilOperasiNative<any>>;

  // Audio
  putarAudio(urlAtauPath: string): Promise<HasilOperasiNative<any>>;
  rekamAudio(opsi?: { durasiMaksDetik?: number }): Promise<HasilOperasiNative<any>>;
  hentikanAudio(): Promise<HasilOperasiNative<any>>;

  // File
  bacaBerkas(jalur: string): Promise<HasilOperasiNative<any>>;
  tulisBerkas(jalur: string, konten: string): Promise<HasilOperasiNative<any>>;
  hapusBerkas(jalur: string): Promise<HasilOperasiNative<any>>;

  // Clipboard
  salinTeks(teks: string): Promise<HasilOperasiNative<any>>;
  tempelTeks(): Promise<HasilOperasiNative<any>>;

  // Share
  bagikan(opsi: { judul?: string; teks?: string; url?: string; jalurBerkas?: string }): Promise<HasilOperasiNative<any>>;

  // Secure Storage
  simpanAman(kunci: string, nilai: string): Promise<HasilOperasiNative<any>>;
  ambilAman(kunci: string): Promise<HasilOperasiNative<any>>;
  hapusAman(kunci: string): Promise<HasilOperasiNative<any>>;

  // Haptic
  getar(durasiMs?: number): Promise<HasilOperasiNative<any>>;
  haptik(pola?: string): Promise<HasilOperasiNative<any>>;
}
