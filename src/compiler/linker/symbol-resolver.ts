/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA ADVANCED LINKER - Resolusi Simbol (Symbol Resolver)
 * Target Milestone: Phase 45 (v0.45.0)
 */

import { LinkerDiagnosticsManager } from './linker-diagnostics';
import { SymbolBinding, SymbolInfo, SymbolTable } from './symbol-table';

export interface SymbolResolutionResult {
  success: boolean;
  resolvedSymbols: Map<string, SymbolInfo>;
  undefinedSymbols: string[];
  duplicateSymbols: string[];
  weakSymbolsResolved: string[];
  diagnostics: string[];
}

export class SymbolResolver {
  constructor(private readonly diag: LinkerDiagnosticsManager = new LinkerDiagnosticsManager()) {}

  /**
   * Menyelesaikan simbol dari beberapa SymbolTable (antar-objek, runtime, dan pustaka eksternal).
   */
  public resolve(
    objectTables: SymbolTable[],
    libraryTables: SymbolTable[] = []
  ): SymbolResolutionResult {
    const resolvedMap = new Map<string, SymbolInfo>();
    const weakCandidates = new Map<string, SymbolInfo[]>();
    const duplicateSymbols: string[] = [];
    const undefinedSymbols: string[] = [];
    const neededSymbols = new Map<string, SymbolInfo>();

    // 1. Kumpulkan seluruh simbol terdefinisi dari objek input
    for (const table of objectTables) {
      for (const sym of table.getAll()) {
        if (!sym.isDefined) {
          neededSymbols.set(sym.mangledName, sym);
          continue;
        }

        const existing = resolvedMap.get(sym.mangledName);

        if (existing) {
          // Kasus simbol lemah (WEAK)
          if (existing.binding === SymbolBinding.WEAK && sym.binding !== SymbolBinding.WEAK) {
            // Simbol kuat menimpa simbol lemah
            resolvedMap.set(sym.mangledName, sym);
          } else if (existing.binding !== SymbolBinding.WEAK && sym.binding === SymbolBinding.WEAK) {
            // Abaikan simbol lemah karena sudah ada simbol kuat
          } else if (existing.binding === SymbolBinding.WEAK && sym.binding === SymbolBinding.WEAK) {
            // Dua simbol lemah, simpan sebagai kandidat
            if (!weakCandidates.has(sym.mangledName)) {
              weakCandidates.set(sym.mangledName, [existing]);
            }
            weakCandidates.get(sym.mangledName)!.push(sym);
          } else {
            // Benturan simbol kuat ganda (DUPLICATE SYMBOL)
            duplicateSymbols.push(sym.name);
            this.diag.galat(
              'SIMBOL_GANDA',
              `Simbol didefinisikan lebih dari satu kali: ${sym.name}`,
              sym.name,
              sym.objectFile || sym.sourceModule
            );
          }
        } else {
          resolvedMap.set(sym.mangledName, sym);
        }
      }
    }

    // 2. Selesaikan simbol yang belum ditemukan dari objek lain atau pustaka (Library Resolution)
    for (const [mangledName, neededSym] of neededSymbols.entries()) {
      if (resolvedMap.has(mangledName)) {
        continue;
      }

      // Periksa apakah ada simbol terdefinisi antar-objek dengan nama yang sama
      let foundInObjects = false;
      for (const existing of resolvedMap.values()) {
        if (existing.name === neededSym.name && existing.isDefined) {
          resolvedMap.set(mangledName, existing);
          foundInObjects = true;
          break;
        }
      }

      if (foundInObjects) {
        continue;
      }

      let foundInLibrary = false;
      for (const libTable of libraryTables) {
        const libSym =
          libTable.get(mangledName) ||
          libTable.findByName(neededSym.name) ||
          libTable.findByName(mangledName);
        if (libSym && libSym.isDefined) {
          resolvedMap.set(mangledName, libSym);
          foundInLibrary = true;
          break;
        }
      }

      if (!foundInLibrary) {
        // Periksa apakah ini simbol eksternal standar C / libc yang disediakan oleh sistem
        const C_STD_RUNTIME = new Set([
          'printf',
          'malloc',
          'free',
          'exit',
          'nusantara_cetak_bilangan',
          'nusantara_cetak_teks',
        ]);

        if (C_STD_RUNTIME.has(mangledName)) {
          // Disediakan oleh C runtime stub bawaan
          resolvedMap.set(mangledName, {
            name: mangledName,
            mangledName,
            type: SymbolBinding.GLOBAL as any,
            binding: SymbolBinding.GLOBAL,
            visibility: SymbolBinding.GLOBAL as any,
            sourceModule: 'libc_runtime',
            isDefined: true,
            isExternal: true,
          });
        } else {
          undefinedSymbols.push(mangledName);
          this.diag.galat(
            'SIMBOL_TIDAK_DITEMUKAN',
            `Simbol belum ditemukan: ${mangledName}`,
            mangledName
          );
        }
      }
    }

    const weakSymbolsResolved = Array.from(weakCandidates.keys());
    const success = duplicateSymbols.length === 0 && undefinedSymbols.length === 0;

    return {
      success,
      resolvedSymbols: resolvedMap,
      undefinedSymbols,
      duplicateSymbols,
      weakSymbolsResolved,
      diagnostics: this.diag.dapatkanPesanFormatted(),
    };
  }
}
