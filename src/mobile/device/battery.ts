/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * API Status Baterai Mobile (Battery Status API)
 */

import { InfoBaterai } from '../types';

export class StatusBateraiMobile {
  private static status: InfoBaterai = {
    level: 0.85,
    sedangMengisi: false,
    modeHematDaya: false,
  };
  private static pendengar: Array<(status: InfoBaterai) => void> = [];

  public static dapatkanStatus(): InfoBaterai {
    return { ...this.status };
  }

  public static perbaruiStatus(baru: Partial<InfoBaterai>): void {
    if (baru.level !== undefined) {
      baru.level = Math.max(0, Math.min(1, baru.level));
    }
    this.status = { ...this.status, ...baru };
    for (const p of this.pendengar) {
      p({ ...this.status });
    }
  }

  public static dapatkanPersentase(): number {
    return Math.round(this.status.level * 100);
  }

  public static apakahMengisi(): boolean {
    return this.status.sedangMengisi;
  }

  public static padaPerubahan(penangan: (status: InfoBaterai) => void): () => void {
    this.pendengar.push(penangan);
    return () => {
      const idx = this.pendengar.indexOf(penangan);
      if (idx !== -1) this.pendengar.splice(idx, 1);
    };
  }
}
