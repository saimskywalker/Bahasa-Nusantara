/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 23
 * Utilitas Jalur (Path Utilities) Lintas Platform untuk Sistem Build
 */

export function normalisasiJalur(jalur: string): string {
  if (!jalur) return '';
  let hasil = jalur.replace(/\\/g, '/');
  // Menghilangkan duplikasi slash berurutan kecuali di awal
  hasil = hasil.replace(/\/{2,}/g, '/');
  // Menghilangkan ./
  hasil = hasil.replace(/\/\.\//g, '/');
  if (hasil.startsWith('./')) {
    hasil = hasil.slice(2);
  }
  return hasil;
}

export function gabungJalur(...bagian: string[]): string {
  const bersih = bagian
    .filter(Boolean)
    .map((b) => b.replace(/\\/g, '/'))
    .join('/');
  return normalisasiJalur(bersih);
}

export function ekstensiJalur(jalur: string): string {
  const norm = normalisasiJalur(jalur);
  const idx = norm.lastIndexOf('.');
  if (idx === -1 || idx === norm.lastIndexOf('/')) return '';
  return norm.slice(idx);
}

export function namaBerkasJalur(jalur: string, sertakanEkstensi = true): string {
  const norm = normalisasiJalur(jalur);
  const idx = norm.lastIndexOf('/');
  const berkas = idx === -1 ? norm : norm.slice(idx + 1);
  if (sertakanEkstensi) return berkas;
  const dotIdx = berkas.lastIndexOf('.');
  return dotIdx === -1 ? berkas : berkas.slice(0, dotIdx);
}

export function direktoriJalur(jalur: string): string {
  const norm = normalisasiJalur(jalur);
  const idx = norm.lastIndexOf('/');
  if (idx === -1) return '.';
  return norm.slice(0, idx) || '/';
}
