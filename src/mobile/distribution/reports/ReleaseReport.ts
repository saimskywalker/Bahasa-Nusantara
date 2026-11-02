/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 40
 * Pembuat Laporan Rilis & Publikasi (Release Report Generator - Markdown)
 */

import * as fs from 'fs';
import * as path from 'path';
import { ArtefakHasilDistribusi, KonfigurasiDistribusiLengkap, LaporanValidasiRilis } from '../types';

export class ReleaseReportGenerator {
  public static buatLaporanMarkdown(
    konfig: KonfigurasiDistribusiLengkap,
    validasi: LaporanValidasiRilis,
    daftarArtefak: ArtefakHasilDistribusi[] = []
  ): string {
    const tanggal = new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const tabelArtefak = daftarArtefak.length > 0
      ? daftarArtefak.map((a) => {
          const kb = (a.ukuranBytes / 1024).toFixed(1);
          return `| ${a.namaBerkas} | ${a.platform.toUpperCase()} | ${a.format.toUpperCase()} | ${kb} KB | \`${a.sha256.substring(0, 16)}...\` | ${a.apakahDitandatangani ? 'Ya' : 'Tidak'} |`;
        }).join('\n')
      : '| (Belum ada artefak yang dibangkitkan) | - | - | - | - | - |';

    const tabelChecklist = validasi.checklist.map((c) => {
      const statusBadge =
        c.status === 'lulus' ? 'LULUS' : c.status === 'peringatan' ? 'PERINGATAN' : 'GAGAL';
      return `| ${c.judul} | ${c.kategori.toUpperCase()} | ${statusBadge} | ${c.pesan} |`;
    }).join('\n');

    return `# Laporan Rilis & Distribusi Aplikasi Mobile
**Aplikasi:** ${konfig.aplikasi.nama} (\`${konfig.aplikasi.id}\`)  
**Versi Semantik:** \`${konfig.aplikasi.versi}\` | **Kode Versi Android:** \`${konfig.aplikasi.kodeVersiAndroid}\` | **iOS Build:** \`${konfig.aplikasi.nomorBuild}\`  
**Lingkungan:** \`${konfig.lingkungan.toUpperCase()}\`  
**Waktu Pemeriksaan:** ${tanggal}  

---

## 1. Status Kelayakan Rilis
- **Status Keseluruhan:** ${validasi.siapRilis ? 'SIAP DIPUBLIKASIKAN' : 'MEMERLUKAN PERBAIKAN'}
- **Android Ready:** ${validasi.ringkasanAndroid.siap ? 'SIAP' : `BELUM SIAP (${validasi.ringkasanAndroid.masalah.length} kendala)`}
- **iOS Ready:** ${validasi.ringkasanIOS.siap ? 'SIAP' : `BELUM SIAP (${validasi.ringkasanIOS.masalah.length} kendala)`}

---

## 2. Tabel Artefak Distribusi
| Nama Berkas | Platform | Format | Ukuran | SHA-256 (Awalan) | Tertanda-tangan |
| :--- | :--- | :--- | :--- | :--- | :--- |
${tabelArtefak}

---

## 3. Checklist Validasi Pra-Publikasi
| Item Validasi | Kategori | Status | Catatan / Rincian |
| :--- | :--- | :--- | :--- |
${tabelChecklist}

---

## 4. Panduan Publikasi Toko Aplikasi
### Google Play Store (Android)
1. Buka [Google Play Console](https://play.google.com/console).
2. Buat rilis baru pada saluran **Produksi** atau **Uji Terbuka/Tertutup**.
3. Unggah berkas Android App Bundle (\`.aab\`) dari direktori \`${konfig.android.outputDir}/release/\`.
4. Pastikan target SDK minimal 33/34 dan rilis ditandatangani dengan keystore resmi.

### Apple App Store (iOS)
1. Buka [App Store Connect](https://appstoreconnect.apple.com).
2. Di lingkungan macOS, buka arsip (\`.xcarchive\`) di direktori \`${konfig.ios.outputDir}/archive/\` menggunakan Xcode Organizer.
3. Klik **Distribute App** -> **App Store Connect** untuk mengunggah ke TestFlight.
4. Lengkapi formulir kepatuhan privasi (App Privacy) dan metadata aplikasi sebelum mengirim untuk peninjauan.
`;
  }

  public static simpanLaporanMarkdown(
    kontenMarkdown: string,
    direktoriTujuan: string = 'dist/mobile/reports'
  ): string {
    const isNode = typeof window === 'undefined' && typeof process !== 'undefined' && Boolean(process?.versions?.node);
    if (!isNode) {
      return `${direktoriTujuan}/release-report.md`;
    }
    const fullDir = path.resolve(process.cwd(), direktoriTujuan);
    if (!fs.existsSync(fullDir)) {
      fs.mkdirSync(fullDir, { recursive: true });
    }

    const filePath = path.join(fullDir, 'release-report.md');
    fs.writeFileSync(filePath, kontenMarkdown, 'utf-8');
    return filePath;
  }
}
