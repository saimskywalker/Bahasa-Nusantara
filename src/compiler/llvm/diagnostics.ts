/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA LLVM BACKEND - Diagnostik dan Pesan Galat Kompilasi
 * Target Milestone: Phase 44 (v0.44.0)
 */

export enum LLVMDiagnosticLevel {
  INFO = 'info',
  WARNING = 'peringatan',
  ERROR = 'galat',
}

export interface LLVMDiagnostic {
  level: LLVMDiagnosticLevel;
  code: string;
  message: string;
  nirNodeId?: string;
  sourceLoc?: {
    file?: string;
    line?: number;
    column?: number;
  };
}

export class LLVMDiagnosticsManager {
  private diagnostics: LLVMDiagnostic[] = [];

  public info(code: string, message: string, loc?: LLVMDiagnostic['sourceLoc'], nirId?: string): void {
    this.diagnostics.push({
      level: LLVMDiagnosticLevel.INFO,
      code,
      message,
      sourceLoc: loc,
      nirNodeId: nirId,
    });
  }

  public warn(code: string, message: string, loc?: LLVMDiagnostic['sourceLoc'], nirId?: string): void {
    this.diagnostics.push({
      level: LLVMDiagnosticLevel.WARNING,
      code,
      message,
      sourceLoc: loc,
      nirNodeId: nirId,
    });
  }

  public error(code: string, message: string, loc?: LLVMDiagnostic['sourceLoc'], nirId?: string): void {
    this.diagnostics.push({
      level: LLVMDiagnosticLevel.ERROR,
      code,
      message,
      sourceLoc: loc,
      nirNodeId: nirId,
    });
  }

  public hasErrors(): boolean {
    return this.diagnostics.some((d) => d.level === LLVMDiagnosticLevel.ERROR);
  }

  public getDiagnostics(): LLVMDiagnostic[] {
    return [...this.diagnostics];
  }

  public clear(): void {
    this.diagnostics = [];
  }

  public formatReport(): string {
    if (this.diagnostics.length === 0) {
      return '[✓] Tidak ada galat atau peringatan pada backend LLVM.';
    }

    return this.diagnostics
      .map((d) => {
        const levelTag =
          d.level === LLVMDiagnosticLevel.ERROR
            ? '[\x1b[31mGALAT\x1b[0m]'
            : d.level === LLVMDiagnosticLevel.WARNING
            ? '[\x1b[33mPERINGATAN\x1b[0m]'
            : '[\x1b[36mINFO\x1b[0m]';
        const loc = d.sourceLoc?.line ? ` pada baris ${d.sourceLoc.line}:${d.sourceLoc.column || 1}` : '';
        const nirTag = d.nirNodeId ? ` [NIR: ${d.nirNodeId}]` : '';
        return `${levelTag} (${d.code})${nirTag}${loc}: ${d.message}`;
      })
      .join('\n');
  }
}
