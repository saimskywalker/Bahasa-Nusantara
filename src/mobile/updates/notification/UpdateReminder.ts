/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 42
 * Pengatur Frekuensi & Jadwal Pengingat Pembaruan (Update Reminder)
 */

export class UpdateReminder {
  private static instance: UpdateReminder;
  private stempelTerakhir: Map<string, number> = new Map();

  private constructor() {}

  public static dapatkanInstance(): UpdateReminder {
    if (!UpdateReminder.instance) {
      UpdateReminder.instance = new UpdateReminder();
    }
    return UpdateReminder.instance;
  }

  /**
   * Memeriksa apakah pengingat untuk versi tertentu boleh ditampilkan kembali.
   */
  public apakahBolehIngatkan(versiTarget: string, intervalJam: number): boolean {
    if (intervalJam <= 0) return true; // Tidak ada jeda (misal rilis wajib)

    const terakhir = this.stempelTerakhir.get(versiTarget);
    if (!terakhir) return true;

    const selisihJam = (Date.now() - terakhir) / (1000 * 60 * 60);
    return selisihJam >= intervalJam;
  }

  /**
   * Mencatat waktu pengingat ditampilkan.
   */
  public catatPengingatDitampilkan(versiTarget: string): void {
    this.stempelTerakhir.set(versiTarget, Date.now());
  }

  public reset(): void {
    this.stempelTerakhir.clear();
  }
}
