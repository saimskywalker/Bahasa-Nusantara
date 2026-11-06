/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA ADVANCED LINKER - Tabel Simbol (Symbol Table)
 * Target Milestone: Phase 45 (v0.45.0)
 */

export enum SymbolType {
  FUNCTION = 'FUNCTION',
  VARIABLE = 'VARIABLE',
  SECTION = 'SECTION',
  OBJECT = 'OBJECT',
  UNKNOWN = 'UNKNOWN',
}

export enum SymbolBinding {
  GLOBAL = 'GLOBAL',
  LOCAL = 'LOCAL',
  WEAK = 'WEAK',
}

export enum SymbolVisibility {
  DEFAULT = 'DEFAULT',
  HIDDEN = 'HIDDEN',
  PROTECTED = 'PROTECTED',
  INTERNAL = 'INTERNAL',
}

export interface SymbolInfo {
  name: string;
  mangledName: string;
  type: SymbolType;
  binding: SymbolBinding;
  visibility: SymbolVisibility;
  sourceModule: string;
  objectFile?: string;
  section?: string;
  addressOrOffset?: number;
  size?: number;
  isDefined: boolean;
  isExternal?: boolean;
}

export class SymbolNameMangler {
  /**
   * Mengonversi nama simbol Nusantara menjadi nama simbol native yang konsisten
   * tanpa benturan nama antar-modul dan kompatibel dengan konvensi C ABI / Linker.
   */
  public static mangle(name: string, moduleName: string = 'utama', type: SymbolType = SymbolType.FUNCTION): string {
    // 1. Simbol standar ABI / Libc / Runtime bawaan dipertahankan
    const C_STANDARD_SYMBOLS = new Set([
      'main',
      'utama',
      '_start',
      'printf',
      'malloc',
      'free',
      'exit',
      'nusantara_cetak_bilangan',
      'nusantara_cetak_teks',
    ]);

    if (C_STANDARD_SYMBOLS.has(name)) {
      return name;
    }

    // Hilangkan awalan @ jika ada dari representasi NIR
    const cleanName = name.startsWith('@') ? name.slice(1) : name;
    if (C_STANDARD_SYMBOLS.has(cleanName)) {
      return cleanName;
    }

    // Format mangling Nusantara: _N_<Jenis>_<Modul>_<Nama>
    const typePrefix = type === SymbolType.FUNCTION ? 'F' : type === SymbolType.VARIABLE ? 'V' : 'S';
    const cleanModule = moduleName.replace(/[^a-zA-Z0-9_]/g, '_');
    const cleanSymbol = cleanName.replace(/[^a-zA-Z0-9_]/g, '_');

    return `_N_${typePrefix}_${cleanModule}_${cleanSymbol}`;
  }
}

export class SymbolTable {
  private symbols: Map<string, SymbolInfo> = new Map();

  constructor(public readonly tableName: string = 'SymbolTable') {}

  public addSymbol(symbol: SymbolInfo): void {
    this.symbols.set(symbol.mangledName, symbol);
  }

  public register(
    name: string,
    type: SymbolType,
    binding: SymbolBinding,
    sourceModule: string,
    options: Partial<Omit<SymbolInfo, 'name' | 'type' | 'binding' | 'sourceModule' | 'mangledName'>> = {}
  ): SymbolInfo {
    const mangledName = options.isExternal
      ? name
      : SymbolNameMangler.mangle(name, sourceModule, type);

    const symbol: SymbolInfo = {
      name,
      mangledName,
      type,
      binding,
      visibility: options.visibility || SymbolVisibility.DEFAULT,
      sourceModule,
      objectFile: options.objectFile,
      section: options.section || (type === SymbolType.FUNCTION ? '.text' : '.data'),
      addressOrOffset: options.addressOrOffset ?? 0,
      size: options.size ?? (type === SymbolType.FUNCTION ? 16 : 8),
      isDefined: options.isDefined ?? true,
      isExternal: options.isExternal ?? false,
    };

    this.symbols.set(mangledName, symbol);
    return symbol;
  }

  public get(mangledName: string): SymbolInfo | undefined {
    return this.symbols.get(mangledName);
  }

  public findByName(name: string): SymbolInfo | undefined {
    for (const sym of this.symbols.values()) {
      if (sym.name === name || sym.mangledName === name) {
        return sym;
      }
    }
    return undefined;
  }

  public has(mangledName: string): boolean {
    return this.symbols.has(mangledName);
  }

  public getAll(): SymbolInfo[] {
    return Array.from(this.symbols.values());
  }

  public getDefinedSymbols(): SymbolInfo[] {
    return this.getAll().filter((s) => s.isDefined);
  }

  public getUndefinedSymbols(): SymbolInfo[] {
    return this.getAll().filter((s) => !s.isDefined);
  }

  public getExportedSymbols(): SymbolInfo[] {
    return this.getAll().filter((s) => s.binding === SymbolBinding.GLOBAL && s.isDefined);
  }

  public getImportedSymbols(): SymbolInfo[] {
    return this.getAll().filter((s) => !s.isDefined || s.isExternal);
  }

  public getWeakSymbols(): SymbolInfo[] {
    return this.getAll().filter((s) => s.binding === SymbolBinding.WEAK);
  }

  public count(): number {
    return this.symbols.size;
  }

  public clear(): void {
    this.symbols.clear();
  }
}
