/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 39
 * Pengawas Jaringan Mobile (Mobile Network Connectivity Monitor)
 */

import { InfoKoneksiJaringan, StatusJaringanTipe, TipeKoneksiJaringan } from '../types';
import { StatusJaringanMobile } from '../../device/network';

export class PengawasJaringanMobile {
  private static instance: PengawasJaringanMobile;
  private statusTerkini: InfoKoneksiJaringan;
  private paraPendengar: Array<(status: InfoKoneksiJaringan) => void> = [];
  private backendPemeriksaUrl?: string;

  private constructor() {
    const raw = StatusJaringanMobile.dapatkanStatus();
    this.statusTerkini = {
      terhubung: raw.terhubung,
      tipe: (raw.tipe as TipeKoneksiJaringan) || 'wifi',
      status: raw.terhubung ? 'online' : 'offline',
      dapatDijangkauBackend: raw.terhubung,
      mahal: raw.mahal || false,
      stempelWaktu: Date.now(),
    };

    // Dengarkan perubahan fisik dari hardware
    StatusJaringanMobile.padaPerubahan((rawBaru) => {
      this.perbaruiStatusFisik(rawBaru.terhubung, (rawBaru.tipe as TipeKoneksiJaringan) || 'wifi', rawBaru.mahal);
    });
  }

  public static dapatkanInstance(): PengawasJaringanMobile {
    if (!this.instance) {
      this.instance = new PengawasJaringanMobile();
    }
    return this.instance;
  }

  public setBackendPemeriksaUrl(url: string): void {
    this.backendPemeriksaUrl = url;
  }

  public dapatkanStatus(): InfoKoneksiJaringan {
    return { ...this.statusTerkini };
  }

  public apakahOnline(): boolean {
    return this.statusTerkini.terhubung && this.statusTerkini.status === 'online';
  }

  public perbaruiStatusFisik(terhubung: boolean, tipe: TipeKoneksiJaringan, mahal = false): void {
    const status: StatusJaringanTipe = terhubung ? 'online' : 'offline';
    this.statusTerkini = {
      terhubung,
      tipe,
      status,
      dapatDijangkauBackend: terhubung,
      mahal,
      stempelWaktu: Date.now(),
    };
    this.siarkanPerubahan();
  }

  public async periksaKeterjangkauanBackend(url?: string): Promise<boolean> {
    const targetUrl = url || this.backendPemeriksaUrl;
    if (!this.statusTerkini.terhubung || !targetUrl) {
      this.statusTerkini.dapatDijangkauBackend = false;
      return false;
    }

    try {
      if (typeof fetch !== 'undefined') {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(targetUrl, {
          method: 'HEAD',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        const bisa = res.status >= 200 && res.status < 500;
        this.statusTerkini.dapatDijangkauBackend = bisa;
        this.statusTerkini.status = bisa ? 'online' : 'terbatas';
        return bisa;
      }
      this.statusTerkini.dapatDijangkauBackend = true;
      return true;
    } catch {
      this.statusTerkini.dapatDijangkauBackend = false;
      this.statusTerkini.status = 'terbatas';
      this.siarkanPerubahan();
      return false;
    }
  }

  public langganan(pendengar: (status: InfoKoneksiJaringan) => void): () => void {
    this.paraPendengar.push(pendengar);
    return () => {
      const idx = this.paraPendengar.indexOf(pendengar);
      if (idx !== -1) this.paraPendengar.splice(idx, 1);
    };
  }

  private siarkanPerubahan(): void {
    const salinan = { ...this.statusTerkini };
    for (const p of this.paraPendengar) {
      try {
        p(salinan);
      } catch (e) {
        // Abaikan galat pendengar
      }
    }
  }
}
