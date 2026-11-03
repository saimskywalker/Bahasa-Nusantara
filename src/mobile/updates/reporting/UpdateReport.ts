/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 42
 * Generator Laporan Pembaruan & Audit OTA (Update Report Generator)
 */

import { LaporanPembaruanLengkap } from '../types';

export class UpdateReportGenerator {
  public static formatKeMarkdown(laporan: LaporanPembaruanLengkap): string {
    let md = '# LAPORAN PEMBARUAN APLIKASI & OTA (NUSANTARA)\n\n';
    md += `> ID Laporan: \`${laporan.idLaporan}\`  \n`;
    md += `> Tanggal & Waktu: \`${laporan.stempelWaktu}\`  \n`;
    md += `> Status Sistem: **${laporan.statusPembaruan.toUpperCase()}**  \n\n`;

    md += '## 1. Parameter Aplikasi & Lingkungan\n\n';
    md += '| Parameter | Nilai |\n';
    md += '|---|---|\n';
    md += `| **Nama Aplikasi** | ${laporan.namaAplikasi} |\n`;
    md += `| **Application ID** | \`${laporan.applicationId}\` |\n`;
    md += `| **Platform** | ${laporan.platform.toUpperCase()} |\n`;
    md += `| **Saluran Rilis** | \`${laporan.saluran.toUpperCase()}\` |\n`;
    md += `| **Versi Terpasang** | \`v${laporan.versiAplikasi}\` |\n`;
    md += `| **Versi Manifest Server** | \`v${laporan.versiManifest}\` |\n`;
    md += `| **Jenis Pembaruan** | \`${laporan.jenisPembaruan}\` |\n`;
    md += `| **Kebijakan Pembaruan** | \`${laporan.kebijakan}\` |\n\n`;

    md += '## 2. Status Keamanan & Integritas\n\n';
    md += `* **Verifikasi Hash SHA-256**: ${laporan.integritasLolos ? '✅ LULUS (Semua resource valid)' : '❌ GAGAL'}\n`;
    md += `* **Tanda Tangan Digital Manifest**: ${laporan.signatureLolos ? '✅ SAH (Kunci Terpercaya)' : '⚠️ TANPA TANDA TANGAN / TIDAK COCOK'}\n`;
    md += `* **Total Resource OTA**: ${laporan.totalResource} berkas (${(laporan.totalUkuranByte / 1024).toFixed(1)} KB)\n\n`;

    md += '## 3. Ringkasan Evaluasi\n\n';
    md += `${laporan.pesan}\n\n`;

    if (laporan.riwayatTerkini && laporan.riwayatTerkini.length > 0) {
      md += '## 4. Riwayat Pembaruan Terkini\n\n';
      md += '| Waktu | Versi | Status | Durasi | Keterangan |\n';
      md += '|---|---|---|---|---|\n';
      for (const r of laporan.riwayatTerkini.slice(0, 5)) {
        md += `| ${r.stempelWaktu.slice(0, 19).replace('T', ' ')} | v${r.versiSesudah} | ${r.status.toUpperCase()} | ${r.durasiMs}ms | ${r.pesan} |\n`;
      }
      md += '\n';
    }

    return md;
  }
}
