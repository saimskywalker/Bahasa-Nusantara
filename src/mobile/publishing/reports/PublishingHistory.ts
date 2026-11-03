/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 41
 * Riwayat & Audit Log Publikasi Rilis (Publishing History & Audit Logger)
 */

import * as fs from 'fs';
import * as path from 'path';
import { EntriRiwayatPublikasi } from '../types';

export class PublishingHistoryManager {
  private static instance: PublishingHistoryManager;
  private riwayat: EntriRiwayatPublikasi[] = [];

  private constructor() {
    this.muatRiwayatDariDisk();
  }

  public static dapatkanInstance(): PublishingHistoryManager {
    if (!PublishingHistoryManager.instance) {
      PublishingHistoryManager.instance = new PublishingHistoryManager();
    }
    return PublishingHistoryManager.instance;
  }

  /**
   * Menambahkan entri baru ke riwayat publikasi (audit trail).
   */
  public catatAksi(entri: Omit<EntriRiwayatPublikasi, 'id' | 'stempelWaktu'>): EntriRiwayatPublikasi {
    const item: EntriRiwayatPublikasi = {
      ...entri,
      id: `pub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      stempelWaktu: new Date().toISOString(),
    };

    this.riwayat.unshift(item);
    this.simpanKeDisk();
    return item;
  }

  public dapatkanRiwayat(): EntriRiwayatPublikasi[] {
    return [...this.riwayat];
  }

  public dapatkanRiwayatPlatform(platform: 'android' | 'ios'): EntriRiwayatPublikasi[] {
    return this.riwayat.filter((r) => r.platform === platform);
  }

  public bersihkanRiwayat(): void {
    this.riwayat = [];
    this.simpanKeDisk();
  }

  private simpanKeDisk(): void {
    const isNode = typeof window === 'undefined' && typeof process !== 'undefined' && Boolean(process?.versions?.node);
    if (!isNode) return;

    try {
      const rootDir = typeof process !== 'undefined' && typeof process.cwd === 'function' ? process.cwd() : '.';
      const targetDir = path.resolve(rootDir, 'dist/mobile/reports');
      if (!(fs as any).existsSync(targetDir)) {
        (fs as any).mkdirSync(targetDir, { recursive: true });
      }
      (fs as any).writeFileSync(
        path.join(targetDir, 'publishing-history.json'),
        JSON.stringify(this.riwayat, null, 2),
        'utf-8'
      );
    } catch {
      // Abaikan jika tidak dapat menulis ke disk
    }
  }

  private muatRiwayatDariDisk(): void {
    const isNode = typeof window === 'undefined' && typeof process !== 'undefined' && Boolean(process?.versions?.node);
    if (!isNode) return;

    try {
      const rootDir = typeof process !== 'undefined' && typeof process.cwd === 'function' ? process.cwd() : '.';
      const filePath = path.resolve(rootDir, 'dist/mobile/reports/publishing-history.json');
      if ((fs as any).existsSync(filePath)) {
        const raw = (fs as any).readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.riwayat = parsed;
        }
      }
    } catch {
      // Abaikan
    }
  }
}
