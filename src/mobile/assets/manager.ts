/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Pengelola Aset Mobile (Mobile Asset Manager)
 */

import * as path from 'path';

export interface InfoAsetMobile {
  jalurRelatif: string;
  ekstensi: string;
  ukuranBytes?: number;
  tipeKonten: string;
}

export class PengelolaAsetMobile {
  private static ekstensiDiizinkan: Set<string> = new Set([
    '.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif',
    '.json', '.txt',
    '.ttf', '.otf', '.woff',
    '.mp3', '.wav', '.ogg',
    '.mp4', '.webm',
  ]);

  private direktoriDasarAset: string;
  private cacheAset: Map<string, InfoAsetMobile> = new Map();

  constructor(direktoriDasar: string = 'aset') {
    this.direktoriDasarAset = direktoriDasar;
  }

  public periksaJalurAman(jalur: string): boolean {
    if (!jalur || typeof jalur !== 'string') return false;
    // Cegah path traversal
    if (jalur.includes('..') || jalur.startsWith('/') || jalur.includes('\\')) {
      return false;
    }
    const ext = path.extname(jalur).toLowerCase();
    return PengelolaAsetMobile.ekstensiDiizinkan.has(ext);
  }

  public dapatkanTipeKonten(jalur: string): string {
    const ext = path.extname(jalur).toLowerCase();
    switch (ext) {
      case '.png': return 'image/png';
      case '.jpg':
      case '.jpeg': return 'image/jpeg';
      case '.webp': return 'image/webp';
      case '.svg': return 'image/svg+xml';
      case '.gif': return 'image/gif';
      case '.json': return 'application/json';
      case '.txt': return 'text/plain';
      case '.ttf': return 'font/ttf';
      case '.otf': return 'font/otf';
      case '.mp3': return 'audio/mpeg';
      case '.wav': return 'audio/wav';
      case '.mp4': return 'video/mp4';
      default: return 'application/octet-stream';
    }
  }

  public daftarkanAset(jalurRelatif: string, ukuranBytes?: number): InfoAsetMobile {
    if (!this.periksaJalurAman(jalurRelatif)) {
      throw new Error(`Aset '${jalurRelatif}' tidak valid atau melanggar aturan keamanan (path traversal / ekstensi tidak diizinkan).`);
    }

    const ekstensi = path.extname(jalurRelatif).toLowerCase();
    const info: InfoAsetMobile = {
      jalurRelatif,
      ekstensi,
      ukuranBytes,
      tipeKonten: this.dapatkanTipeKonten(jalurRelatif),
    };

    this.cacheAset.set(jalurRelatif, info);
    return info;
  }

  public memilikiAset(jalurRelatif: string): boolean {
    return this.cacheAset.has(jalurRelatif);
  }

  public dapatkanInfoAset(jalurRelatif: string): InfoAsetMobile | undefined {
    return this.cacheAset.get(jalurRelatif);
  }

  public dapatkanSemuaAset(): InfoAsetMobile[] {
    return Array.from(this.cacheAset.values());
  }

  public hasilkanManifestAset(): Record<string, any> {
    const daftar = this.dapatkanSemuaAset();
    return {
      direktoriDasar: this.direktoriDasarAset,
      totalAset: daftar.length,
      item: daftar,
      dibuatPada: Date.now(),
    };
  }
}
