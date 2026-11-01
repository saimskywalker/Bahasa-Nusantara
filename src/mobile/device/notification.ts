/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * API Notifikasi Lokal Mobile (Local Notifications API)
 */

import { OpsiNotifikasiLokal } from '../types';
import { KonteksAplikasiMobile } from '../core/application_context';

export class NotifikasiLokalMobile {
  private static daftarTerjadwal: Map<string | number, OpsiNotifikasiLokal> = new Map();
  private static timers: Map<string | number, any> = new Map();

  public static async jadwalkan(opsi: OpsiNotifikasiLokal): Promise<boolean> {
    const konteks = KonteksAplikasiMobile.dapatkanKonteks();
    const statusIzin = await konteks.pengelolaIzin.periksaIzin('notifikasi');

    if (statusIzin !== 'diberikan') {
      const hasilMinta = await konteks.pengelolaIzin.mintaIzin('notifikasi', 'Aplikasi memerlukan izin untuk mengirim notifikasi.');
      if (!hasilMinta.diberikan) {
        return false;
      }
    }

    this.daftarTerjadwal.set(opsi.id, opsi);

    const tundaMs = (opsi.tundaDetik ?? 0) * 1000;
    if (tundaMs > 0) {
      const t = setTimeout(() => {
        this.tampilkanNotifikasiLangsung(opsi);
        this.daftarTerjadwal.delete(opsi.id);
        this.timers.delete(opsi.id);
      }, tundaMs);
      this.timers.set(opsi.id, t);
    } else {
      this.tampilkanNotifikasiLangsung(opsi);
    }

    return true;
  }

  public static batalkan(id: string | number): boolean {
    const t = this.timers.get(id);
    if (t) {
      clearTimeout(t);
      this.timers.delete(id);
    }
    return this.daftarTerjadwal.delete(id);
  }

  public static batalkanSemua(): void {
    for (const t of this.timers.values()) {
      clearTimeout(t);
    }
    this.timers.clear();
    this.daftarTerjadwal.clear();
  }

  public static dapatkanDaftarTerjadwal(): OpsiNotifikasiLokal[] {
    return Array.from(this.daftarTerjadwal.values());
  }

  private static tampilkanNotifikasiLangsung(opsi: OpsiNotifikasiLokal): void {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        new Notification(opsi.judul, {
          body: opsi.pesan,
          data: opsi.dataTambahan,
        });
      } catch {
        // Abaikan jika tidak didukung di konteks worker/headless
      }
    }
  }
}
