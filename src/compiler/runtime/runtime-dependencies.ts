/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA RUNTIME DEPENDENCIES - Spesifikasi Dependensi Runtime Platform
 * Target Milestone: Phase 45 (v0.45.0)
 */

export interface SystemRuntimeRequirement {
  platform: 'linux' | 'darwin' | 'windows';
  architecture: 'x86_64' | 'aarch64';
  requiredLibraries: string[];
  optionalLibraries: string[];
  minimumOSVersion?: string;
}

export class RuntimeDependencies {
  public static getRequirements(
    platform: 'linux' | 'darwin' | 'windows',
    architecture: 'x86_64' | 'aarch64' = 'x86_64'
  ): SystemRuntimeRequirement {
    if (platform === 'linux') {
      return {
        platform,
        architecture,
        requiredLibraries: ['libc.so.6', 'libm.so.6'],
        optionalLibraries: ['libpthread.so.0', 'libdl.so.2'],
        minimumOSVersion: 'Linux Kernel 3.10+ (glibc 2.17+)',
      };
    } else if (platform === 'darwin') {
      return {
        platform,
        architecture,
        requiredLibraries: ['libSystem.B.dylib'],
        optionalLibraries: ['libc++.1.dylib'],
        minimumOSVersion: 'macOS 11.0+ (Big Sur)',
      };
    } else {
      return {
        platform,
        architecture,
        requiredLibraries: ['KERNEL32.dll', 'ucrtbase.dll'],
        optionalLibraries: ['MSVCRT.dll', 'WS2_32.dll'],
        minimumOSVersion: 'Windows 10 / Server 2016+',
      };
    }
  }
}
