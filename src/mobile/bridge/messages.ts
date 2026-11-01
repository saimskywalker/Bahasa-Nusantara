/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Definisi Protokol Pesan Jembatan Mobile (Mobile Bridge Message Protocol)
 */

export type TipePesanJembatan = 'panggilan' | 'respon' | 'peristiwa' | 'kesalahan';

export interface PesanJembatanPermintaan<T = any> {
  id: string;
  modul: string;
  metode: string;
  argumen: T;
  stempelWaktu: number;
}

export interface PesanJembatanRespon<T = any> {
  id: string;
  sukses: boolean;
  data?: T;
  pesanKesalahan?: string;
  kodeKesalahan?: string;
  stempelWaktu: number;
}

export interface PesanJembatanPeristiwa<T = any> {
  saluran: string;
  namaPeristiwa: string;
  data: T;
  stempelWaktu: number;
}
