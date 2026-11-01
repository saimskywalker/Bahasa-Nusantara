/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * API Berbagi Konten Mobile (Share API)
 */

export interface OpsiBerbagi {
  judul?: string;
  teks?: string;
  url?: string;
}

export class BerbagiMobile {
  private static riwayatBerbagi: OpsiBerbagi[] = [];

  public static async bagikan(opsi: OpsiBerbagi): Promise<boolean> {
    this.riwayatBerbagi.push({ ...opsi });

    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: opsi.judul,
          text: opsi.teks,
          url: opsi.url,
        });
        return true;
      } catch {
        return false;
      }
    }
    return true;
  }

  public static dapatkanRiwayat(): OpsiBerbagi[] {
    return [...this.riwayatBerbagi];
  }

  public static bersihkanRiwayat(): void {
    this.riwayatBerbagi = [];
  }
}
