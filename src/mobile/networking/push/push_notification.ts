/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 39
 * Fondasi Integrasi Push Notification Mobile (FCM & APNs)
 */

import * as crypto from 'node:crypto';
import { NotifikasiPushMasuk } from '../types';
import { PenyimpananAmanMobile } from '../../security/secure_storage';

export class PengelolaNotifikasiPushMobile {
  private static instance: PengelolaNotifikasiPushMobile;
  private tokenPerangkat?: string;
  private readonly kunciPenyimpananToken = 'nusantara_mobile_push_device_token';
  private pendengarNotifikasi: Array<(notif: NotifikasiPushMasuk) => void> = [];
  private pendengarDeepLink: Array<(url: string) => void> = [];

  private constructor() {
    this.tokenPerangkat = PenyimpananAmanMobile.ambil(this.kunciPenyimpananToken) || undefined;
  }

  public static dapatkanInstance(): PengelolaNotifikasiPushMobile {
    if (!this.instance) {
      this.instance = new PengelolaNotifikasiPushMobile();
    }
    return this.instance;
  }

  public dapatkanToken(): string {
      let acak = '';
      try {
        if (typeof (crypto as any)?.randomBytes === 'function') {
          acak = (crypto as any).randomBytes(24).toString('hex');
        }
      } catch {}
      if (!acak) {
        acak = Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2);
      }
      this.tokenPerangkat = `fcm_token_${acak}`;
      PenyimpananAmanMobile.simpan(this.kunciPenyimpananToken, this.tokenPerangkat);
    return this.tokenPerangkat;
  }

  public perbaruiToken(tokenBaru: string): void {
    this.tokenPerangkat = tokenBaru;
    PenyimpananAmanMobile.simpan(this.kunciPenyimpananToken, tokenBaru);
  }

  /**
   * Menangani kedatangan push notification dari sistem operasi
   */
  public terimaPush(payload: {
    id?: string;
    judul: string;
    pesan: string;
    data?: Record<string, any>;
    deepLink?: string;
    statusLatarBelakang?: boolean;
  }): NotifikasiPushMasuk {
    const notif: NotifikasiPushMasuk = {
      id: payload.id || `push_${Date.now()}`,
      judul: payload.judul,
      pesan: payload.pesan,
      data: payload.data,
      deepLink: payload.deepLink || payload.data?.deepLink,
      stempelWaktu: Date.now(),
      statusLatarBelakang: payload.statusLatarBelakang ?? false,
    };

    // Siarkan ke para pendengar
    for (const p of this.pendengarNotifikasi) {
      try {
        p(notif);
      } catch {}
    }

    // Jika ada deep link, kirimkan ke handler navigasi
    if (notif.deepLink) {
      for (const dl of this.pendengarDeepLink) {
        try {
          dl(notif.deepLink);
        } catch {}
      }
    }

    return notif;
  }

  public padaNotifikasi(callback: (notif: NotifikasiPushMasuk) => void): () => void {
    this.pendengarNotifikasi.push(callback);
    return () => {
      const idx = this.pendengarNotifikasi.indexOf(callback);
      if (idx !== -1) this.pendengarNotifikasi.splice(idx, 1);
    };
  }

  public padaDeepLink(callback: (url: string) => void): () => void {
    this.pendengarDeepLink.push(callback);
    return () => {
      const idx = this.pendengarDeepLink.indexOf(callback);
      if (idx !== -1) this.pendengarDeepLink.splice(idx, 1);
    };
  }
}
