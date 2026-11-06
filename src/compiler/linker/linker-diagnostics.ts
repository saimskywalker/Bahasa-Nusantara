/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA ADVANCED LINKER - Diagnostik Linker Berbahasa Indonesia
 * Target Milestone: Phase 45 (v0.45.0)
 */

export enum LinkerDiagnosticSeverity {
  INFO = 'INFO',
  PERINGATAN = 'PERINGATAN',
  GALAT = 'GALAT',
}

export interface LinkerDiagnostic {
  kode: string;
  tingkat: LinkerDiagnosticSeverity;
  pesan: string;
  lokasi?: string;
  simbol?: string;
}

export class LinkerDiagnosticsManager {
  private daftarDiagnostik: LinkerDiagnostic[] = [];

  public info(kode: string, pesan: string, simbol?: string, lokasi?: string): void {
    this.daftarDiagnostik.push({
      kode,
      tingkat: LinkerDiagnosticSeverity.INFO,
      pesan,
      simbol,
      lokasi,
    });
  }

  public peringatan(kode: string, pesan: string, simbol?: string, lokasi?: string): void {
    this.daftarDiagnostik.push({
      kode,
      tingkat: LinkerDiagnosticSeverity.PERINGATAN,
      pesan,
      simbol,
      lokasi,
    });
  }

  public galat(kode: string, pesan: string, simbol?: string, lokasi?: string): void {
    this.daftarDiagnostik.push({
      kode,
      tingkat: LinkerDiagnosticSeverity.GALAT,
      pesan,
      simbol,
      lokasi,
    });
  }

  public apakahAdaGalat(): boolean {
    return this.daftarDiagnostik.some((d) => d.tingkat === LinkerDiagnosticSeverity.GALAT);
  }

  public dapatkanSemua(): LinkerDiagnostic[] {
    return [...this.daftarDiagnostik];
  }

  public dapatkanPesanFormatted(): string[] {
    return this.daftarDiagnostik.map((d) => {
      const tag = d.tingkat === LinkerDiagnosticSeverity.GALAT ? '[GALAT LINKER]' : d.tingkat === LinkerDiagnosticSeverity.PERINGATAN ? '[PERINGATAN LINKER]' : '[INFO LINKER]';
      const sim = d.simbol ? ` (Simbol: '${d.simbol}')` : '';
      const lok = d.lokasi ? ` pada ${d.lokasi}` : '';
      return `${tag} ${d.kode}: ${d.pesan}${sim}${lok}`;
    });
  }

  public bersihkan(): void {
    this.daftarDiagnostik = [];
  }
}
