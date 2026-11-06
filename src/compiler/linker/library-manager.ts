/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA ADVANCED LINKER - Library Manager & Manifest Config
 * Target Milestone: Phase 45 (v0.45.0)
 */

import { safeFS, safePath } from '../llvm/node-compat';
import { LinkerDiagnosticsManager } from './linker-diagnostics';

export type LibraryKind = 'STATIC' | 'DYNAMIC';

export interface LibraryDescriptor {
  name: string;
  version: string;
  kind: LibraryKind;
  targetPlatform: 'linux' | 'darwin' | 'windows' | 'all';
  targetArch: 'x86_64' | 'aarch64' | 'all';
  filePath: string;
  includePath?: string;
  dependencies: string[];
  license?: string;
}

export class LibraryManager {
  private libraries: Map<string, LibraryDescriptor> = new Map();
  private searchPaths: string[] = [];

  constructor(private readonly diag: LinkerDiagnosticsManager = new LinkerDiagnosticsManager()) {
    // Jalur pencarian pustaka default sistem
    this.searchPaths = ['./lib', './pustaka', '/usr/local/lib', '/usr/lib'];
  }

  public addSearchPath(path: string): void {
    if (!this.searchPaths.includes(path)) {
      this.searchPaths.unshift(path); // Prioritaskan jalur yang baru ditambahkan
    }
  }

  public getSearchPaths(): string[] {
    return [...this.searchPaths];
  }

  public registerLibrary(desc: LibraryDescriptor): void {
    this.libraries.set(desc.name, desc);
  }

  public findLibrary(
    name: string,
    platform: 'linux' | 'darwin' | 'windows',
    arch: 'x86_64' | 'aarch64'
  ): LibraryDescriptor | undefined {
    // 1. Cek dari daftar pustaka terdaftar
    const registered = this.libraries.get(name);
    if (registered) {
      if (
        (registered.targetPlatform === 'all' || registered.targetPlatform === platform) &&
        (registered.targetArch === 'all' || registered.targetArch === arch)
      ) {
        return registered;
      }
    }

    // 2. Cari di seluruh search paths berdasarkan ekstensi platform
    const extensions =
      platform === 'windows'
        ? ['.lib', '.dll']
        : platform === 'darwin'
        ? ['.dylib', '.a']
        : ['.so', '.a'];

    const prefixes = platform === 'windows' ? ['', 'lib'] : ['lib', ''];

    for (const dir of this.searchPaths) {
      for (const prefix of prefixes) {
        for (const ext of extensions) {
          const candidate = safePath.join(dir, `${prefix}${name}${ext}`);
          if (safeFS.existsSync(candidate)) {
            const kind: LibraryKind = ext === '.a' || ext === '.lib' ? 'STATIC' : 'DYNAMIC';
            const desc: LibraryDescriptor = {
              name,
              version: '1.0.0',
              kind,
              targetPlatform: platform,
              targetArch: arch,
              filePath: candidate,
              dependencies: [],
            };
            this.registerLibrary(desc);
            return desc;
          }
        }
      }
    }

    this.diag.galat('LIBRARY_TIDAK_DITEMUKAN', `Library tidak ditemukan: ${name}`, name);
    return undefined;
  }

  public loadFromManifest(tomlContent: string): number {
    let count = 0;
    // Parser sederhana untuk bagian [pustaka] atau [libraries] pada nusantara.toml
    const lines = tomlContent.split('\n');
    let inLibSection = false;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith('[') && line.endsWith(']')) {
        const sec = line.slice(1, -1).trim().toLowerCase();
        inLibSection = sec === 'pustaka' || sec === 'libraries' || sec === 'dependensi';
        continue;
      }

      if (inLibSection && line && !line.startsWith('#') && line.includes('=')) {
        const parts = line.split('=');
        const libName = parts[0].trim();
        const rawVal = parts[1].trim().replace(/^["']|["']$/g, '');

        if (libName && rawVal) {
          const isStatic = rawVal.endsWith('.a') || rawVal.endsWith('.lib');
          this.registerLibrary({
            name: libName,
            version: '1.0.0',
            kind: isStatic ? 'STATIC' : 'DYNAMIC',
            targetPlatform: 'all',
            targetArch: 'all',
            filePath: rawVal,
            dependencies: [],
          });
          count++;
        }
      }
    }

    return count;
  }

  public getAllLibraries(): LibraryDescriptor[] {
    return Array.from(this.libraries.values());
  }
}
