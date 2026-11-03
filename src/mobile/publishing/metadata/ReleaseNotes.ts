/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 41
 * Manajer Catatan Rilis Multi-Platform & Multi-Bahasa (Release Notes Manager)
 */

import { CatatanRilisVersi, SumberCatatanRilis } from '../types';

export class ReleaseNotesManager {
  public static readonly BATAS_MAKS_KARAKTER = 500;

  /**
   * Menghasilkan draft catatan rilis berdasarkan sumber changelog, git, atau template.
   */
  public static buatDraftCatatanRilis(
    versi: string,
    buildNumber: number,
    sumber: SumberCatatanRilis = 'changelog',
    kontenMentah?: string
  ): CatatanRilisVersi {
    const kontenPerLocale: Record<string, string> = {};
    const karakterPerLocale: Record<string, number> = {};
    const pesanValidasi: string[] = [];

    let catatanId = '';

    if (sumber === 'changelog' && kontenMentah) {
      catatanId = this.ekstrakDariChangelog(kontenMentah, versi);
    } else if (sumber === 'git' && kontenMentah) {
      catatanId = this.ekstrakDariGitCommit(kontenMentah);
    } else {
      catatanId = `Pembaruan versi ${versi} (Build ${buildNumber}):\n• Peningkatan stabilitas dan efisiensi memori.\n• Pengoptimalan kinerja antarmuka grafis.\n• Perbaikan bug minor dan keamanan.`;
    }

    // Pembersihan konten sensitif / internal
    catatanId = this.bersihkanKontenSensitif(catatanId);

    // Potong jika melebihi batas 500 karakter dengan aman
    if (catatanId.length > this.BATAS_MAKS_KARAKTER) {
      pesanValidasi.push(
        `Catatan rilis (${catatanId.length} kar) melebihi batas 500 karakter dan dipangkas secara otomatis.`
      );
      catatanId = catatanId.slice(0, 497).trim() + '...';
    }

    kontenPerLocale['id'] = catatanId;
    karakterPerLocale['id'] = catatanId.length;

    // Default English translation draft
    const catatanEn = `Version ${versi} (Build ${buildNumber}) update:\n• Stability improvements and memory efficiency.\n• Graphic user interface performance optimizations.\n• Minor bug fixes and security enhancements.`;
    kontenPerLocale['en'] = catatanEn;
    karakterPerLocale['en'] = catatanEn.length;

    return {
      versi,
      buildNumber,
      tanggalRilis: new Date().toISOString().split('T')[0],
      sumber,
      kontenPerLocale,
      karakterPerLocale,
      valid: pesanValidasi.length === 0,
      pesanValidasi,
    };
  }

  /**
   * Ekstraksi ringkasan rilis dari berkas CHANGELOG.md berdasarkan header versi.
   */
  public static ekstrakDariChangelog(changelogText: string, targetVersi: string): string {
    const lines = changelogText.split('\n');
    let menangkap = false;
    const hasilLines: string[] = [];

    const versiClean = targetVersi.replace(/^v/, '');

    for (const line of lines) {
      if (line.startsWith('#') && (line.includes(versiClean) || line.includes(`[${versiClean}]`))) {
        menangkap = true;
        continue;
      }
      if (menangkap && line.startsWith('#') && hasilLines.length > 0) {
        break;
      }
      if (menangkap && line.trim().length > 0) {
        hasilLines.push(line.trim());
      }
    }

    if (hasilLines.length === 0) {
      return `Pembaruan stabilitas dan fitur baru untuk versi ${targetVersi}.`;
    }

    return hasilLines.slice(0, 6).join('\n');
  }

  /**
   * Mengonversi commit Git menjadi poin catatan rilis yang ramah pengguna.
   */
  public static ekstrakDariGitCommit(gitLog: string): string {
    const lines = gitLog.split('\n');
    const poin: string[] = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      // Filter commit internal
      if (
        line.startsWith('chore:') ||
        line.startsWith('ci:') ||
        line.startsWith('test:') ||
        line.includes('merge') ||
        line.includes('bump version')
      ) {
        continue;
      }

      // Bersihkan prefix konvensional
      let teks = line
        .replace(/^feat(\([^)]+\))?:\s*/i, 'Fitur baru: ')
        .replace(/^fix(\([^)]+\))?:\s*/i, 'Perbaikan: ')
        .replace(/^perf(\([^)]+\))?:\s*/i, 'Pengoptimalan: ')
        .replace(/^refactor(\([^)]+\))?:\s*/i, 'Pembaruan: ');

      poin.push(`• ${teks}`);
      if (poin.length >= 4) break;
    }

    if (poin.length === 0) {
      return 'Peningkatan kinerja dan stabilitas aplikasi.';
    }

    return `Pembaruan terkini:\n${poin.join('\n')}`;
  }

  /**
   * Anti-Leak: Menghapus commit internal, hash git, kata sandi, atau token dari teks catatan rilis.
   */
  public static bersihkanKontenSensitif(teks: string): string {
    let res = teks;
    // Hapus hash commit 40-karakter
    res = res.replace(/\b[0-9a-f]{40}\b/gi, '');
    // Hapus token atau kata kunci rahasia
    res = res.replace(/(api_key|token|secret|password|bearer)[=:\s]+[^\s]+/gi, '[DIRAHASIAKAN]');
    return res;
  }
}
