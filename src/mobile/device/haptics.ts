/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * API Umpan Balik Haptik & Getaran Mobile (Haptics & Vibration API)
 */

export type JenisGetaran = 'ringan' | 'sedang' | 'berat' | 'sukses' | 'peringatan' | 'gagal';

export class GetaranMobile {
  private static riwayatGetaran: Array<{ tipe: JenisGetaran | number; waktu: number }> = [];

  public static getar(durasiMs: number = 200): boolean {
    this.riwayatGetaran.push({ tipe: durasiMs, waktu: Date.now() });
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        return navigator.vibrate(durasiMs);
      } catch {
        return true;
      }
    }
    return true;
  }

  public static haptik(jenis: JenisGetaran = 'ringan'): boolean {
    this.riwayatGetaran.push({ tipe: jenis, waktu: Date.now() });
    let ms = 50;
    if (jenis === 'sedang') ms = 100;
    else if (jenis === 'berat') ms = 250;
    else if (jenis === 'sukses') ms = 70;
    else if (jenis === 'peringatan') ms = 120;
    else if (jenis === 'gagal') ms = 300;

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        return (navigator as any).vibrate(ms);
      } catch {
        return true;
      }
    }
    return true;
  }

  public static dapatkanRiwayat(): Array<{ tipe: JenisGetaran | number; waktu: number }> {
    return [...this.riwayatGetaran];
  }

  public static bersihkanRiwayat(): void {
    this.riwayatGetaran = [];
  }
}
