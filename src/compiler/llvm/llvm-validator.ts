/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA LLVM BACKEND - LLVM IR Validator Menggunakan Toolchain
 * Target Milestone: Phase 44 (v0.44.0)
 */

import { safeCP, safeFS, safeOS, safePath } from './node-compat';
import { LLVMDiagnosticsManager } from './diagnostics';
import { LLVMToolchainStatus } from './toolchain-manager';

export interface LLVMValidationResult {
  valid: boolean;
  toolUsed?: string;
  output: string;
  diagnostics: string[];
}

export class LLVMValidator {
  constructor(
    private readonly toolchain: LLVMToolchainStatus,
    private readonly diag: LLVMDiagnosticsManager = new LLVMDiagnosticsManager()
  ) {}

  public validateIR(llvmIR: string): LLVMValidationResult {
    // 1. Validasi semantik statis internal terlebih dahulu
    const internalErrors = this.validateInternalSyntax(llvmIR);
    if (internalErrors.length > 0) {
      for (const err of internalErrors) {
        this.diag.error('LLVM_SYNTAX_INVALID', err);
      }
      return {
        valid: false,
        output: internalErrors.join('\n'),
        diagnostics: internalErrors,
      };
    }

    // 2. Jika tool llvm-as tersedia, jalankan assembler check
    if (this.toolchain.binaries.llvmAs.found) {
      const llvmAsCmd = this.toolchain.binaries.llvmAs.command;
      const tmpDir = safeFS.mkdtempSync(safePath.join(safeOS.tmpdir(), 'nusantara-llvm-val-'));
      const irPath = safePath.join(tmpDir, 'test.ll');
      const bcPath = safePath.join(tmpDir, 'test.bc');

      try {
        safeFS.writeFileSync(irPath, llvmIR, 'utf-8');
        const res = safeCP.spawnSync(llvmAsCmd, [irPath, '-o', bcPath], {
          encoding: 'utf-8',
          timeout: 10000,
          shell: false,
        });

        const success = res.status === 0;
        const msg = (res.stderr || res.stdout || '').trim();

        if (!success) {
          this.diag.error('LLVM_AS_ERROR', msg || 'llvm-as gagal memvalidasi LLVM IR.');
        }

        return {
          valid: success,
          toolUsed: 'llvm-as',
          output: msg,
          diagnostics: success ? [] : [msg],
        };
      } finally {
        try {
          safeFS.rmSync(tmpDir, { recursive: true, force: true });
        } catch {
          // Abaikan error pembersihan temp
        }
      }
    }

    // Jika toolchain eksternal tidak terpasang, hasil validasi statis internal diterima
    return {
      valid: true,
      output: 'Validasi statis internal LLVM IR lulus (llvm-as eksternal tidak terpasang).',
      diagnostics: [],
    };
  }

  private validateInternalSyntax(ir: string): string[] {
    const errors: string[] = [];
    const lines = ir.split('\n');

    let openBraces = 0;
    let inFunction = false;
    let currentFn = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNum = i + 1;

      if (line.startsWith('define ')) {
        inFunction = true;
        currentFn = line;
      }

      for (const ch of line) {
        if (ch === '{') openBraces++;
        if (ch === '}') {
          openBraces--;
          if (openBraces === 0) inFunction = false;
        }
      }

      // Periksa baris ganjil atau instruksi cacat
      if (line.includes('unreachable') && line.includes('ret ')) {
        errors.push(`Baris ${lineNum}: Terminator ganda pada satu baris.`);
      }
    }

    if (openBraces !== 0) {
      errors.push(`Struktur kurung kurawal fungsi tidak seimbang (open braces: ${openBraces}).`);
    }

    return errors;
  }
}
