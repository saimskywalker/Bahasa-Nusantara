/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA LLVM BACKEND - Integrasi Linker Native (clang / lld / system linker)
 * Target Milestone: Phase 44 (v0.44.0)
 */

import { safeCP, safeFS, safeOS, safePath } from './node-compat';
import { NativeRuntimeManager } from '../runtime/native-runtime';
import { LLVMDiagnosticsManager } from './diagnostics';
import { TargetPlatformInfo } from './target-triple';
import { LLVMToolchainStatus } from './toolchain-manager';

export interface LinkingResult {
  success: boolean;
  executablePath?: string;
  toolUsed?: string;
  diagnostics: string[];
}

export class NativeLinker {
  constructor(
    private readonly toolchain: LLVMToolchainStatus,
    private readonly targetInfo: TargetPlatformInfo,
    private readonly diag: LLVMDiagnosticsManager = new LLVMDiagnosticsManager()
  ) {}

  public link(
    objectFilePath: string,
    outputExecutablePath: string,
    options: { debug?: boolean; extraLibs?: string[] } = {}
  ): LinkingResult {
    // 1. Periksa apakah clang tersedia untuk linking terpadu
    if (this.toolchain.binaries.clang.found) {
      const clangCmd = this.toolchain.binaries.clang.command;
      const tmpDir = safeFS.mkdtempSync(safePath.join(safeOS.tmpdir(), 'nusantara-link-'));
      const runtimeCPath = safePath.join(tmpDir, 'runtime.c');

      try {
        safeFS.writeFileSync(runtimeCPath, NativeRuntimeManager.generateRuntimeCSource(), 'utf-8');

        const args = [
          `-target`,
          this.targetInfo.triple,
          objectFilePath,
          runtimeCPath,
          '-o',
          outputExecutablePath,
        ];

        if (options.debug) {
          args.push('-g');
        }

        if (options.extraLibs && options.extraLibs.length > 0) {
          for (const lib of options.extraLibs) {
            args.push(`-l${lib}`);
          }
        }

        const res = safeCP.spawnSync(clangCmd, args, {
          encoding: 'utf-8',
          timeout: 30000,
          shell: false,
        });

        if (res.status === 0 && safeFS.existsSync(outputExecutablePath)) {
          return {
            success: true,
            executablePath: outputExecutablePath,
            toolUsed: 'clang',
            diagnostics: [
              `Executable native berhasil ditautkan menggunakan clang: ${outputExecutablePath}`,
            ],
          };
        } else {
          const err = (res.stderr || res.stdout || '').trim();
          this.diag.error('LINKER_ERROR', err || 'Gagal melakukan proses linking via clang.');
          return {
            success: false,
            diagnostics: [`Proses linking gagal: ${err}`],
          };
        }
      } finally {
        try {
          safeFS.rmSync(tmpDir, { recursive: true, force: true });
        } catch {
          // Abaikan
        }
      }
    }

    return {
      success: false,
      diagnostics: [
        `Gagal melakukan linking biner: Linker native (clang) tidak ditemukan dalam lingkungan.`,
      ],
    };
  }
}
