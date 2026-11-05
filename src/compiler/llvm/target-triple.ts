/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA LLVM BACKEND - Konfigurasi Target Triple dan Data Layout
 * Target Milestone: Phase 44 (v0.44.0)
 */

export interface TargetPlatformInfo {
  triple: string;
  dataLayout: string;
  os: 'windows' | 'linux' | 'darwin' | 'unknown';
  arch: 'x86_64' | 'aarch64' | 'unknown';
  objectFormat: 'ELF' | 'Mach-O' | 'COFF';
  executableExtension: string;
  objectExtension: string;
  isCross: boolean;
}

export class TargetTripleManager {
  // Preset data layout resmi LLVM
  public static readonly LAYOUT_X86_64_LINUX =
    'e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128';
  public static readonly LAYOUT_X86_64_DARWIN =
    'e-m:o-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128';
  public static readonly LAYOUT_X86_64_WINDOWS =
    'e-m:w-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128';
  public static readonly LAYOUT_AARCH64_LINUX =
    'e-m:e-i8:8:32-i16:16:32-i64:64-i128:128-n32:64-S128';
  public static readonly LAYOUT_AARCH64_DARWIN =
    'e-m:o-i64:64-i128:128-n32:64-S128';

  public static getHostTriple(): string {
    const arch = process.arch === 'arm64' ? 'aarch64' : 'x86_64';
    if (process.platform === 'win32') {
      return `${arch}-pc-windows-msvc`;
    } else if (process.platform === 'darwin') {
      return `${arch}-apple-darwin`;
    } else {
      return `${arch}-unknown-linux-gnu`;
    }
  }

  public static resolve(targetTripleStr?: string): TargetPlatformInfo {
    const hostTriple = this.getHostTriple();
    const triple = targetTripleStr && targetTripleStr.trim() !== '' ? targetTripleStr.trim() : hostTriple;
    const isCross = triple !== hostTriple;

    let os: TargetPlatformInfo['os'] = 'unknown';
    let arch: TargetPlatformInfo['arch'] = 'unknown';
    let objectFormat: TargetPlatformInfo['objectFormat'] = 'ELF';
    let executableExtension = '';
    let objectExtension = '.o';
    let dataLayout = this.LAYOUT_X86_64_LINUX;

    if (triple.includes('x86_64')) {
      arch = 'x86_64';
    } else if (triple.includes('aarch64') || triple.includes('arm64')) {
      arch = 'aarch64';
    }

    if (triple.includes('linux')) {
      os = 'linux';
      objectFormat = 'ELF';
      executableExtension = '';
      objectExtension = '.o';
      dataLayout = arch === 'aarch64' ? this.LAYOUT_AARCH64_LINUX : this.LAYOUT_X86_64_LINUX;
    } else if (triple.includes('darwin') || triple.includes('apple')) {
      os = 'darwin';
      objectFormat = 'Mach-O';
      executableExtension = '';
      objectExtension = '.o';
      dataLayout = arch === 'aarch64' ? this.LAYOUT_AARCH64_DARWIN : this.LAYOUT_X86_64_DARWIN;
    } else if (triple.includes('windows') || triple.includes('win32')) {
      os = 'windows';
      objectFormat = 'COFF';
      executableExtension = '.exe';
      objectExtension = '.obj';
      dataLayout = this.LAYOUT_X86_64_WINDOWS;
    }

    return {
      triple,
      dataLayout,
      os,
      arch,
      objectFormat,
      executableExtension,
      objectExtension,
      isCross,
    };
  }
}
