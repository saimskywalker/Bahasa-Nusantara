/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * API Status Jaringan Mobile (Network Status API)
 */

import { InfoJaringan } from '../types';

export class StatusJaringanMobile {
  private static status: InfoJaringan = {
    terhubung: true,
    tipe: 'wifi',
    mahal: false,
  };
  private static pendengar: Array<(status: InfoJaringan) => void> = [];

  public static dapatkanStatus(): InfoJaringan {
    return { ...this.status };
  }

  public static perbaruiStatus(baru: Partial<InfoJaringan>): void {
    this.status = { ...this.status, ...baru };
    for (const p of this.pendengar) {
      p({ ...this.status });
    }
  }

  public static apakahTerhubung(): boolean {
    return this.status.terhubung;
  }

  public static padaPerubahan(penangan: (status: InfoJaringan) => void): () => void {
    this.pendengar.push(penangan);
    return () => {
      const idx = this.pendengar.indexOf(penangan);
      if (idx !== -1) this.pendengar.splice(idx, 1);
    };
  }
}
