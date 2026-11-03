/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 42
 * Pengelola Cache & Ruang Simpan Pembaruan (Update Cache)
 */

import * as fs from 'fs';
import * as path from 'path';

export class UpdateCache {
  private direktoriAkar: string;
  private memoriSimpan: Map<string, string | Uint8Array> = new Map();

  constructor(direktoriAkar?: string) {
    this.direktoriAkar = direktoriAkar || path.join(process.cwd(), 'dist', 'mobile', 'updates');
    this.pastikanDirektori();
  }

  public dapatkanJalurStaging(): string {
    return path.join(this.direktoriAkar, 'staging');
  }

  public dapatkanJalurAktif(): string {
    return path.join(this.direktoriAkar, 'active');
  }

  public dapatkanJalurCadangan(): string {
    return path.join(this.direktoriAkar, 'backup');
  }

  private pastikanDirektori(): void {
    try {
      if (typeof fs !== 'undefined' && fs.mkdirSync) {
        fs.mkdirSync(this.dapatkanJalurStaging(), { recursive: true });
        fs.mkdirSync(this.dapatkanJalurAktif(), { recursive: true });
        fs.mkdirSync(this.dapatkanJalurCadangan(), { recursive: true });
      }
    } catch {
      // Browser fallback (memori)
    }
  }

  public simpanBerkasStaging(jalurRelatif: string, konten: string | Uint8Array): void {
    this.memoriSimpan.set(`staging/${jalurRelatif}`, konten);
    try {
      if (typeof fs !== 'undefined' && fs.writeFileSync) {
        const full = path.join(this.dapatkanJalurStaging(), jalurRelatif);
        const parent = path.dirname(full);
        fs.mkdirSync(parent, { recursive: true });
        fs.writeFileSync(full, konten);
      }
    } catch {
      // Browser fallback
    }
  }

  public bacaBerkasStaging(jalurRelatif: string): string | Uint8Array | null {
    if (this.memoriSimpan.has(`staging/${jalurRelatif}`)) {
      return this.memoriSimpan.get(`staging/${jalurRelatif}`)!;
    }
    try {
      if (typeof fs !== 'undefined' && fs.readFileSync) {
        const full = path.join(this.dapatkanJalurStaging(), jalurRelatif);
        if (fs.existsSync(full)) {
          return fs.readFileSync(full);
        }
      }
    } catch {
      // Browser fallback
    }
    return null;
  }

  public bersihkanStaging(): void {
    for (const k of Array.from(this.memoriSimpan.keys())) {
      if (k.startsWith('staging/')) {
        this.memoriSimpan.delete(k);
      }
    }
    try {
      if (typeof fs !== 'undefined' && fs.rmSync) {
        fs.rmSync(this.dapatkanJalurStaging(), { recursive: true, force: true });
        fs.mkdirSync(this.dapatkanJalurStaging(), { recursive: true });
      }
    } catch {
      // Browser fallback
    }
  }

  public dapatkanTotalUkuranCache(): number {
    let total = 0;
    for (const [_, v] of this.memoriSimpan.entries()) {
      total += typeof v === 'string' ? v.length : v.byteLength;
    }
    return total;
  }
}
