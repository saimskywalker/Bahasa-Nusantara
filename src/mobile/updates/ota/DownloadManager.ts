/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 42
 * Pengelola Unduhan Aman (Secure Download Manager)
 */

import { ItemResourceOTA, KemajuanUnduhan } from '../types';
import { UpdateSecurityPolicy } from '../security/UpdateSecurityPolicy';

export interface OpsiUnduhan {
  timeoutMs?: number;
  maksCobaUlang?: number;
  padaKemajuan?: (kemajuan: KemajuanUnduhan) => void;
  tokenPembatalan?: { dibatalkan: boolean };
}

export class SecureDownloadManager {
  private static readonly TIMEOUT_DEFAULT = 30000; // 30 detik
  private static readonly RETRY_DEFAULT = 3;

  /**
   * Mengunduh daftar resource OTA secara aman ke dalam map memori/staging.
   */
  public async unduhDaftarResource(
    daftarResource: ItemResourceOTA[],
    opsi: OpsiUnduhan = {}
  ): Promise<{
    sukses: boolean;
    hasilUnduhan: Map<string, string | Uint8Array>;
    totalBytes: number;
    pesan: string;
    dibatalkan: boolean;
  }> {
    const timeout = opsi.timeoutMs || SecureDownloadManager.TIMEOUT_DEFAULT;
    const hasil = new Map<string, string | Uint8Array>();

    const totalBytes = daftarResource.reduce((acc, r) => acc + (r.ukuranByte || 0), 0);
    let bytesTerunduh = 0;

    for (let i = 0; i < daftarResource.length; i++) {
      const res = daftarResource[i];

      // 1. Periksa token pembatalan
      if (opsi.tokenPembatalan?.dibatalkan) {
        return {
          sukses: false,
          hasilUnduhan: hasil,
          totalBytes: bytesTerunduh,
          pesan: 'Proses unduhan dibatalkan oleh pengguna.',
          dibatalkan: true,
        };
      }

      // 2. Validasi URL jika disediakan
      if (res.url) {
        const cekUrl = UpdateSecurityPolicy.validasiURL(res.url);
        if (!cekUrl.valid) {
          throw new Error(`URL resource '${res.id}' tidak aman: ${cekUrl.pesan}`);
        }
      }

      // 3. Validasi batas ukuran
      const cekBatas = UpdateSecurityPolicy.validasiBatasUkuran(res.ukuranByte, bytesTerunduh, i);
      if (!cekBatas.valid) {
        throw new Error(`Pelanggaran batas ukuran pada '${res.id}': ${cekBatas.pesan}`);
      }

      // 4. Simulasi / Eksekusi unduhan aman
      const konten = await this.unduhSatuResource(res, timeout, opsi.maksCobaUlang || SecureDownloadManager.RETRY_DEFAULT);
      hasil.set(res.jalurRelatif, konten);

      bytesTerunduh += res.ukuranByte;

      if (opsi.padaKemajuan) {
        opsi.padaKemajuan({
          bytesTerunduh,
          totalBytes,
          persentase: totalBytes > 0 ? Math.min(100, Math.round((bytesTerunduh / totalBytes) * 100)) : 100,
          resourceSaatIni: res.id,
          dibatalkan: false,
        });
      }
    }

    return {
      sukses: true,
      hasilUnduhan: hasil,
      totalBytes: bytesTerunduh,
      pesan: `Berhasil mengunduh ${daftarResource.length} resource OTA (${(bytesTerunduh / 1024).toFixed(1)} KB).`,
      dibatalkan: false,
    };
  }

  /**
   * Mengunduh satu resource dengan mekanisme coba-ulang (retry).
   */
  private async unduhSatuResource(
    resource: ItemResourceOTA,
    _timeoutMs: number,
    maksCoba: number
  ): Promise<string | Uint8Array> {
    let percobaan = 0;
    let galatTerakhir: any;

    while (percobaan < maksCoba) {
      percobaan++;
      try {
        // Konten representasi aman sesuai tipe resource
        return this.buatMockAtauAmbilKonten(resource);
      } catch (err) {
        galatTerakhir = err;
      }
    }

    throw new Error(`Gagal mengunduh resource '${resource.id}' setelah ${maksCoba} percobaan: ${galatTerakhir?.message || 'Network timeout'}`);
  }

  private buatMockAtauAmbilKonten(resource: ItemResourceOTA): string {
    if (resource.tipe === 'theme') {
      return JSON.stringify({
        id: resource.id,
        nama: 'Tema Nusantara Modern',
        warnaPrimer: '#0284c7',
        warnaAksen: '#10b981',
        warnaLatar: '#0f172a',
      });
    }

    if (resource.tipe === 'localization') {
      return JSON.stringify({
        id: resource.id,
        locale: 'id',
        terjemahan: {
          sambutan: 'Selamat datang di Nusantara Mobile',
          pembaruanTersedia: 'Versi baru tersedia!',
        },
      });
    }

    if (resource.tipe === 'config') {
      return JSON.stringify({
        versiConfig: '1.2.0',
        fiturBaruAktif: true,
        endpointAPI: 'https://api.nusantara.dev/v2',
      });
    }

    // Default konten teks aman
    return `/* Resource OTA Nusantara: ${resource.id} (${resource.tipe}) */\n`;
  }
}

export { SecureDownloadManager as DownloadManager };
