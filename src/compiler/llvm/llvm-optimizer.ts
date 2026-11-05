/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA LLVM BACKEND - LLVM Optimizer Pipeline via opt
 * Target Milestone: Phase 44 (v0.44.0)
 */

import { safeCP, safeFS, safeOS, safePath } from './node-compat';
import { LLVMDiagnosticsManager } from './diagnostics';
import { LLVMToolchainStatus } from './toolchain-manager';

export type LLVMOptLevel = 'O0' | 'O1' | 'O2' | 'O3' | 'Os' | 'Oz';

export interface LLVMOptimizeResult {
  success: boolean;
  optimizedIR: string;
  appliedLevel: LLVMOptLevel;
  toolUsed?: string;
  diagnostics: string[];
}

export class LLVMOptimizer {
  constructor(
    private readonly toolchain: LLVMToolchainStatus,
    private readonly diag: LLVMDiagnosticsManager = new LLVMDiagnosticsManager()
  ) {}

  public optimize(ir: string, level: LLVMOptLevel = 'O2'): LLVMOptimizeResult {
    if (level === 'O0') {
      return {
        success: true,
        optimizedIR: ir,
        appliedLevel: 'O0',
        diagnostics: ['Optimasi level O0 (tanpa optimasi LLVM).'],
      };
    }

    // Jika binary opt tersedia
    if (this.toolchain.binaries.opt.found) {
      const optCmd = this.toolchain.binaries.opt.command;
      const tmpDir = safeFS.mkdtempSync(safePath.join(safeOS.tmpdir(), 'nusantara-llvm-opt-'));
      const inPath = safePath.join(tmpDir, 'input.ll');
      const outPath = safePath.join(tmpDir, 'opt.ll');

      try {
        safeFS.writeFileSync(inPath, ir, 'utf-8');
        const optFlag = `-${level.toLowerCase()}`;
        const args = [inPath, optFlag, '-S', '-o', outPath];

        const res = safeCP.spawnSync(optCmd, args, {
          encoding: 'utf-8',
          timeout: 15000,
          shell: false,
        });

        if (res.status === 0 && safeFS.existsSync(outPath)) {
          const optContent = safeFS.readFileSync(outPath, 'utf-8');
          return {
            success: true,
            optimizedIR: optContent,
            appliedLevel: level,
            toolUsed: 'opt',
            diagnostics: [`Berhasil mengoptimalkan LLVM IR menggunakan opt (${optFlag}).`],
          };
        } else {
          const err = (res.stderr || res.stdout || '').trim();
          this.diag.warn('LLVM_OPT_FALLBACK', `opt gagal dijalankan (${err}), menggunakan IR asli.`);
        }
      } finally {
        try {
          safeFS.rmSync(tmpDir, { recursive: true, force: true });
        } catch {
          // Abaikan error pembersihan
        }
      }
    }

    // Fallback jika opt tidak ada
    return {
      success: true,
      optimizedIR: ir,
      appliedLevel: level,
      diagnostics: [
        `Tool 'opt' tidak tersedia di sistem; mempertahankan LLVM IR asli dengan optimasi NIR Fase 43.`,
      ],
    };
  }
}
