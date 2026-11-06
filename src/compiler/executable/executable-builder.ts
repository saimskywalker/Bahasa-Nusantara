/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA EXECUTABLE - Executable Builder
 * Target Milestone: Phase 45 (v0.45.0)
 */

import { safeFS, safePath } from '../llvm/node-compat';
import { TargetPlatformInfo, TargetTripleManager } from '../llvm/target-triple';
import { AOTCompiler } from '../aot/aot-compiler';
import { LinkerManager } from '../linker/linker-manager';
import { BinaryInspector } from './binary-inspector';
import { BinaryMetadata } from './binary-metadata';

export interface ExecutableBuildOptions {
  sourceFilePath?: string;
  sourceCode?: string;
  objectFiles?: string[];
  outputDirectory: string;
  outputFilename?: string;
  targetTriple?: string;
  isStatic?: boolean;
  debug?: boolean;
  strip?: boolean;
  sharedLibraries?: string[];
  staticLibraries?: string[];
  libraryPaths?: string[];
  customToolchainPath?: string;
}

export interface ExecutableBuildResult {
  success: boolean;
  executablePath?: string;
  targetInfo: TargetPlatformInfo;
  isStatic: boolean;
  metadata?: BinaryMetadata;
  diagnostics: string[];
}

export class ExecutableBuilder {
  private readonly linkerManager: LinkerManager;
  private readonly aotCompiler: AOTCompiler;

  constructor(options: { targetTriple?: string; customToolchainPath?: string } = {}) {
    this.linkerManager = new LinkerManager(options);
    this.aotCompiler = new AOTCompiler(options.customToolchainPath);
  }

  public build(options: ExecutableBuildOptions): ExecutableBuildResult {
    const diagReport: string[] = [];
    const targetInfo = TargetTripleManager.resolve(options.targetTriple);
    const outDir = options.outputDirectory || './dist';

    if (!safeFS.existsSync(outDir)) {
      safeFS.mkdirSync(outDir, { recursive: true });
    }

    const baseName = options.outputFilename || 'program';
    const exeName = `${baseName}${targetInfo.executableExtension}`;
    const targetExePath = safePath.join(outDir, exeName);

    let objFiles: string[] = options.objectFiles ? [...options.objectFiles] : [];

    // 1. Jika kode sumber diberikan, kompilasi dulu via AOT Compiler
    if (options.sourceCode || options.sourceFilePath) {
      let code = options.sourceCode;
      if (!code && options.sourceFilePath) {
        code = safeFS.readFileSync(options.sourceFilePath, 'utf-8');
      }

      if (code) {
        const objPath = safePath.join(outDir, `${baseName}${targetInfo.objectExtension}`);
        const aotRes = this.aotCompiler.compileSource(code, {
          targetTriple: options.targetTriple,
          emitObject: true,
          outputPath: objPath,
          debug: options.debug,
        });

        if (!aotRes.success || !aotRes.objectPath) {
          diagReport.push(...aotRes.diagnostics);
          return {
            success: false,
            targetInfo,
            isStatic: !!options.isStatic,
            diagnostics: diagReport,
          };
        }

        objFiles.push(aotRes.objectPath);
        diagReport.push(...aotRes.diagnostics);
      }
    }

    if (objFiles.length === 0) {
      diagReport.push('Tidak ada berkas objek (.o / .obj) atau kode sumber untuk dibangun.');
      return {
        success: false,
        targetInfo,
        isStatic: !!options.isStatic,
        diagnostics: diagReport,
      };
    }

    // 2. Tautkan objek menggunakan LinkerManager
    const linkRes = this.linkerManager.link({
      objectFiles: objFiles,
      outputExecutable: targetExePath,
      isStatic: options.isStatic,
      sharedLibraries: options.sharedLibraries,
      staticLibraries: options.staticLibraries,
      libraryPaths: options.libraryPaths,
      debug: options.debug,
      strip: options.strip,
      targetTriple: options.targetTriple,
      customToolchainPath: options.customToolchainPath,
    });

    diagReport.push(...linkRes.diagnostics);

    if (!linkRes.success) {
      return {
        success: false,
        targetInfo,
        isStatic: !!options.isStatic,
        diagnostics: diagReport,
      };
    }

    // 3. Inspeksi metadata biner hasil kompilasi
    const metadata = BinaryInspector.inspect(targetExePath);

    return {
      success: true,
      executablePath: targetExePath,
      targetInfo,
      isStatic: !!options.isStatic,
      metadata,
      diagnostics: diagReport,
    };
  }
}
