/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * API Lokasi & Geolokasi Mobile (Location API)
 */

import { KoordinatLokasi } from '../types';
import { KonteksAplikasiMobile } from '../core/application_context';

export class LokasiPerangkatMobile {
  private static lokasiTersimpan: KoordinatLokasi = {
    latitude: -6.2088, // Jakarta Pusat
    longitude: 106.8456,
    akurasi: 10,
    ketinggian: 15,
    kecepatan: 0,
    stempelWaktu: Date.now(),
  };

  public static async dapatkanLokasiSaatIni(): Promise<KoordinatLokasi> {
    const konteks = KonteksAplikasiMobile.dapatkanKonteks();
    const statusIzin = await konteks.pengelolaIzin.periksaIzin('lokasi');

    if (statusIzin !== 'diberikan') {
      const hasilMinta = await konteks.pengelolaIzin.mintaIzin('lokasi', 'Aplikasi memerlukan akses lokasi untuk fitur peta.');
      if (!hasilMinta.diberikan) {
        throw new Error('Akses lokasi tidak diberikan oleh pengguna.');
      }
    }

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      return new Promise<KoordinatLokasi>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const data: KoordinatLokasi = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              akurasi: pos.coords.accuracy,
              ketinggian: pos.coords.altitude ?? undefined,
              kecepatan: pos.coords.speed ?? undefined,
              stempelWaktu: pos.timestamp,
            };
            this.lokasiTersimpan = data;
            resolve(data);
          },
          () => {
            // Fallback ke posisi tersimpan
            this.lokasiTersimpan.stempelWaktu = Date.now();
            resolve({ ...this.lokasiTersimpan });
          },
          { timeout: 3000 }
        );
      });
    }

    this.lokasiTersimpan.stempelWaktu = Date.now();
    return { ...this.lokasiTersimpan };
  }

  public static setLokasiSimulasi(lokasi: Partial<KoordinatLokasi>): void {
    this.lokasiTersimpan = {
      ...this.lokasiTersimpan,
      ...lokasi,
      stempelWaktu: Date.now(),
    };
  }
}
