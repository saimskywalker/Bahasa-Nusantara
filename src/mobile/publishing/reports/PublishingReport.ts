/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 41
 * Generator Laporan Publikasi Toko Aplikasi (Publishing Report Generator)
 */

import * as fs from 'fs';
import * as path from 'path';
import { LaporanPublikasiLengkap } from '../types';

export class PublishingReportGenerator {
  /**
   * Menghasilkan laporan publikasi dalam format Markdown profesional.
   */
  public static formatKeMarkdown(laporan: LaporanPublikasiLengkap): string {
    const statusLabel = laporan.statusPublikasi.toUpperCase().replace(/_/g, ' ');

    let md = '';
    md += '# LAPORAN PUBLIKASI RILIS APLIKASI (NUSANTARA)\n\n';
    md += `> ID Laporan: \`${laporan.idLaporan}\`  \n`;
    md += `> Tanggal & Waktu: \`${laporan.stempelWaktu}\`  \n`;
    md += `> Mode: **${laporan.modeSandbox ? 'SANDBOX SIMULATOR (AMAN)' : 'LIVE TOKO RESMI'}**  \n\n`;

    md += '## 1. Identitas Rilis & Aplikasi\n\n';
    md += `| Parameter | Nilai |\n`;
    md += `|---|---|\n`;
    md += `| **Nama Proyek** | ${laporan.namaProyek} |\n`;
    md += `| **Application ID** | \`${laporan.applicationId}\` |\n`;
    md += `| **Platform** | ${laporan.platform.toUpperCase()} |\n`;
    md += `| **Versi Semantik** | \`v${laporan.versi}\` |\n`;
    md += `| **Build Number** | \`${laporan.buildNumber}\` |\n`;
    md += `| **Track / Saluran** | \`${laporan.trackAtauChannel.toUpperCase()}\` |\n`;
    md += `| **Akun Pengembang Tujuan** | \`${laporan.akunTujuanMasked}\` |\n`;
    md += `| **Status Akhir** | **${statusLabel}** |\n`;
    md += `| **Skor Kepatuhan** | **${laporan.skorKepatuhan}%** |\n\n`;

    md += '## 2. Berkas Binary Rilis\n\n';
    if (laporan.berkasBinary.android) {
      md += `* **Android**: \`${laporan.berkasBinary.android}\`\n`;
    }
    if (laporan.berkasBinary.ios) {
      md += `* **iOS**: \`${laporan.berkasBinary.ios}\`\n`;
    }
    md += '\n';

    md += '## 3. Catatan Peringatan & Kesalahan\n\n';
    if (laporan.daftarGalat.length > 0) {
      md += '### Daftar Galat (Error):\n';
      for (const g of laporan.daftarGalat) {
        md += `* ❌ ${g}\n`;
      }
      md += '\n';
    } else {
      md += '✅ *Tidak ditemukan galat fatal pada proses ini.*\n\n';
    }

    if (laporan.daftarPeringatan.length > 0) {
      md += '### Daftar Peringatan:\n';
      for (const p of laporan.daftarPeringatan) {
        md += `* ⚠️ ${p}\n`;
      }
      md += '\n';
    }

    md += '## 4. Rekomendasi & Tindakan Lanjutan\n\n';
    if (laporan.tindakanLanjutan.length > 0) {
      for (const act of laporan.tindakanLanjutan) {
        md += `1. ${act}\n`;
      }
    } else {
      md += '1. Pantau dasbor Google Play Console / App Store Connect untuk status peninjauan berkas.\n';
      md += '2. Uji build pada perangkat internal sebelum mempromosikan ke peluncuran publik.\n';
    }

    md += '\n---\n';
    md += `*Laporan dihasilkan secara otomatis oleh NUSANTARA Mobile Publishing Engine v0.41.0.*\n`;

    return md;
  }

  /**
   * Menyimpan berkas laporan publikasi ke disk dalam format JSON dan Markdown.
   */
  public static simpanLaporanKeDisk(
    laporan: LaporanPublikasiLengkap,
    direktoriTujuan: string = 'dist/mobile/reports'
  ): { pathJson: string; pathMarkdown: string } {
    const isNode = typeof window === 'undefined' && typeof process !== 'undefined' && Boolean(process?.versions?.node);

    const pathJson = `${direktoriTujuan}/publishing-report-${laporan.idLaporan}.json`;
    const pathMarkdown = `${direktoriTujuan}/publishing-report-${laporan.idLaporan}.md`;

    if (!isNode) return { pathJson, pathMarkdown };

    try {
      const rootDir = typeof process !== 'undefined' && typeof process.cwd === 'function' ? process.cwd() : '.';
      const fullDir = path.resolve(rootDir, direktoriTujuan);

      if (!(fs as any).existsSync(fullDir)) {
        (fs as any).mkdirSync(fullDir, { recursive: true });
      }

      const fullJson = path.join(fullDir, `publishing-report-${laporan.idLaporan}.json`);
      const fullMd = path.join(fullDir, `publishing-report-${laporan.idLaporan}.md`);

      (fs as any).writeFileSync(fullJson, JSON.stringify(laporan, null, 2), 'utf-8');
      (fs as any).writeFileSync(fullMd, this.formatKeMarkdown(laporan), 'utf-8');

      return { pathJson: fullJson, pathMarkdown: fullMd };
    } catch {
      return { pathJson, pathMarkdown };
    }
  }
}
