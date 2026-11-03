/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 42
 * Manajer Notifikasi Pembaruan Mobile (Update Notification)
 */

import { UpdateReminder } from './UpdateReminder';

export interface OpsiNotifikasiPembaruan {
  judul: string;
  pesan: string;
  versiTarget: string;
  tipe: 'tersedia' | 'wajib' | 'unduh_selesai' | 'gagal';
  intervalJam?: number;
}

export class UpdateNotificationManager {
  private static instance: UpdateNotificationManager;
  private logNotifikasi: Array<{ waktu: string; judul: string; pesan: string; tipe: string }> = [];

  private constructor() {}

  public static dapatkanInstance(): UpdateNotificationManager {
    if (!UpdateNotificationManager.instance) {
      UpdateNotificationManager.instance = new UpdateNotificationManager();
    }
    return UpdateNotificationManager.instance;
  }

  /**
   * Mengirimkan notifikasi pembaruan ke sistem perangkat lokal.
   */
  public kirimNotifikasi(opsi: OpsiNotifikasiPembaruan): { terkirim: boolean; pesan: string } {
    const reminder = UpdateReminder.dapatkanInstance();

    // Periksa rate limiting jika bukan pembaruan wajib
    if (opsi.tipe !== 'wajib' && !reminder.apakahBolehIngatkan(opsi.versiTarget, opsi.intervalJam || 24)) {
      return {
        terkirim: false,
        pesan: `Notifikasi pembaruan untuk versi '${opsi.versiTarget}' ditunda sesuai interval pengingat.`,
      };
    }

    reminder.catatPengingatDitampilkan(opsi.versiTarget);

    this.logNotifikasi.unshift({
      waktu: new Date().toISOString(),
      judul: opsi.judul,
      pesan: opsi.pesan,
      tipe: opsi.tipe,
    });

    return {
      terkirim: true,
      pesan: `Notifikasi '${opsi.judul}' berhasil dikirimkan ke pengguna.`,
    };
  }

  public dapatkanRiwayatNotifikasi(): Array<{ waktu: string; judul: string; pesan: string; tipe: string }> {
    return [...this.logNotifikasi];
  }
}
