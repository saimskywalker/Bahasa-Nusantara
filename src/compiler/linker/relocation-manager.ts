/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA ADVANCED LINKER - Relocation Engine (ELF / PE-COFF / Mach-O)
 * Target Milestone: Phase 45 (v0.45.0)
 */

import { LinkerDiagnosticsManager } from './linker-diagnostics';
import { SymbolTable } from './symbol-table';

export interface RelocationEntry {
  offset: number;
  symbol: string;
  type: string;
  addend?: number;
  section: string;
}

export interface RelocationValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class RelocationManager {
  // Relokasi standar ELF x86_64
  public static readonly ELF_X86_64 = new Set([
    'R_X86_64_NONE',
    'R_X86_64_64',
    'R_X86_64_PC32',
    'R_X86_64_GOT32',
    'R_X86_64_PLT32',
    'R_X86_64_COPY',
    'R_X86_64_GLOB_DAT',
    'R_X86_64_JUMP_SLOT',
    'R_X86_64_RELATIVE',
  ]);

  // Relokasi standar ELF AArch64
  public static readonly ELF_AARCH64 = new Set([
    'R_AARCH64_NONE',
    'R_AARCH64_ABS64',
    'R_AARCH64_ABS32',
    'R_AARCH64_PREL32',
    'R_AARCH64_CALL26',
    'R_AARCH64_JUMP26',
    'R_AARCH64_ADR_PREL_PG_HI21',
  ]);

  // Relokasi standar PE/COFF AMD64
  public static readonly PE_COFF_AMD64 = new Set([
    'IMAGE_REL_AMD64_ABSOLUTE',
    'IMAGE_REL_AMD64_ADDR64',
    'IMAGE_REL_AMD64_ADDR32',
    'IMAGE_REL_AMD64_REL32',
    'IMAGE_REL_AMD64_REL32_1',
  ]);

  // Relokasi standar Mach-O
  public static readonly MACH_O = new Set([
    'X86_64_RELOC_UNSIGNED',
    'X86_64_RELOC_SIGNED',
    'X86_64_RELOC_BRANCH',
    'X86_64_RELOC_GOT_LOAD',
    'ARM64_RELOC_UNSIGNED',
    'ARM64_RELOC_BRANCH26',
    'ARM64_RELOC_PAGE21',
  ]);

  constructor(private readonly diag: LinkerDiagnosticsManager = new LinkerDiagnosticsManager()) {}

  /**
   * Memvalidasi daftar entri relokasi terhadap arsitektur target dan tabel simbol.
   */
  public validateRelocations(
    relocations: RelocationEntry[],
    symbolTable: SymbolTable,
    targetArch: 'x86_64' | 'aarch64',
    targetFormat: 'ELF' | 'Mach-O' | 'COFF',
    sectionSizes: Map<string, number> = new Map()
  ): RelocationValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Tentukan kumpulan tipe relokasi yang valid untuk target
    let validTypes: Set<string>;
    if (targetFormat === 'ELF') {
      validTypes = targetArch === 'x86_64' ? RelocationManager.ELF_X86_64 : RelocationManager.ELF_AARCH64;
    } else if (targetFormat === 'COFF') {
      validTypes = RelocationManager.PE_COFF_AMD64;
    } else {
      validTypes = RelocationManager.MACH_O;
    }

    for (const rel of relocations) {
      // 1. Validasi tipe relokasi
      if (!validTypes.has(rel.type)) {
        const err = `Tipe relokasi '${rel.type}' tidak valid untuk arsitektur ${targetArch} (${targetFormat}).`;
        errors.push(err);
        this.diag.galat('RELOKASI_TIPE_INVALID', err, rel.symbol, rel.section);
      }

      // 2. Validasi referensi simbol
      const sym = symbolTable.get(rel.symbol) || symbolTable.findByName(rel.symbol);
      if (!sym) {
        const err = `Referensi relokasi ke simbol tidak terdefinisi: '${rel.symbol}' pada seksi '${rel.section}'.`;
        errors.push(err);
        this.diag.galat('RELOKASI_SIMBOL_TIDAK_DITEMUKAN', err, rel.symbol, rel.section);
      }

      // 3. Validasi batas offset seksi
      const secSize = sectionSizes.get(rel.section);
      if (secSize !== undefined && rel.offset >= secSize) {
        const err = `Offset relokasi (0x${rel.offset.toString(16)}) melampaui batas ukuran seksi '${rel.section}' (0x${secSize.toString(16)}).`;
        errors.push(err);
        this.diag.galat('RELOKASI_OFFSET_OVERFLOW', err, rel.symbol, rel.section);
      }

      // 4. Deteksi relokasi 32-bit PC-relative overflow potensial
      if (rel.type.includes('PC32') || rel.type.includes('REL32')) {
        if (rel.addend !== undefined && (rel.addend > 0x7fffffff || rel.addend < -0x80000000)) {
          const err = `Addend relokasi PC-relative '${rel.type}' melebihi batas 32-bit bertanda: ${rel.addend}.`;
          errors.push(err);
          this.diag.galat('RELOKASI_OVERFLOW', err, rel.symbol, rel.section);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
