/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 42
 * Analitik & Statistik Agregat Pembaruan Berorientasi Privasi (Update Analytics)
 */

import { StatistikPembaruanAgregat, PlatformMobile, SaluranPembaruan } from '../types';

export class UpdateAnalytics {
  private static instance: UpdateAnalytics;
  private statistik: StatistikPembaruanAgregat;
  private aktif = true;

  private constructor() {
    this.statistik = {
      platform: 'semua',
      saluran: 'stable',
      totalPemeriksaan: 0,
      totalUnduhanSukses: 0,
      totalUnduhanGagal: 0,
      totalAktivasiSukses: 0,
      totalRollback: 0,
      distribusiVersi: {
        '1.2.0': 185,
        '1.1.0': 64,
        '1.0.0': 21,
      },
      jenisKesalahanUmum: {},
    };
  }

  public static dapatkanInstance(): UpdateAnalytics {
    if (!UpdateAnalytics.instance) {
      UpdateAnalytics.instance = new UpdateAnalytics();
    }
    return UpdateAnalytics.instance;
  }

  public aturStatusAktif(aktif: boolean): void {
    this.aktif = aktif;
  }

  public apakahAktif(): boolean {
    return this.aktif;
  }

  public catatPemeriksaan(platform: PlatformMobile, channel: SaluranPembaruan): void {
    if (!this.aktif) return;
    this.statistik.totalPemeriksaan++;
    this.statistik.platform = platform;
    this.statistik.saluran = channel;
  }

  public catatUnduhanSukses(): void {
    if (!this.aktif) return;
    this.statistik.totalUnduhanSukses++;
  }

  public catatUnduhanGagal(alasan = 'koneksi_terputus'): void {
    if (!this.aktif) return;
    this.statistik.totalUnduhanGagal++;
    this.statistik.jenisKesalahanUmum[alasan] = (this.statistik.jenisKesalahanUmum[alasan] || 0) + 1;
  }

  public catatAktivasiSukses(versi: string): void {
    if (!this.aktif) return;
    this.statistik.totalAktivasiSukses++;
    this.statistik.distribusiVersi[versi] = (this.statistik.distribusiVersi[versi] || 0) + 1;
  }

  public catatRollback(): void {
    if (!this.aktif) return;
    this.statistik.totalRollback++;
  }

  public dapatkanStatistik(): StatistikPembaruanAgregat {
    return { ...this.statistik };
  }
}
