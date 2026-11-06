/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA RUNTIME PACKAGING - Pengemasan Runtime Nusantara
 * Target Milestone: Phase 45 (v0.45.0)
 */

export type RuntimePackagingMode = 'BUNDLED' | 'SHARED' | 'MINIMAL';

export interface RuntimeMetadata {
  version: string;
  mode: RuntimePackagingMode;
  targetPlatform: string;
  hasStdio: boolean;
  hasMemoryManager: boolean;
  hasStringSupport: boolean;
  entryPoint: string;
}

export class RuntimePackager {
  public static readonly RUNTIME_VERSION = '0.45.0';

  /**
   * Menghasilkan kode sumber C runtime yang disesuaikan dengan mode pengemasan.
   */
  public static generateRuntimeSource(
    mode: RuntimePackagingMode = 'BUNDLED',
    targetPlatform: 'linux' | 'darwin' | 'windows' = 'linux'
  ): { sourceCode: string; metadata: RuntimeMetadata } {
    const metadata: RuntimeMetadata = {
      version: this.RUNTIME_VERSION,
      mode,
      targetPlatform,
      hasStdio: mode !== 'MINIMAL',
      hasMemoryManager: mode !== 'MINIMAL',
      hasStringSupport: mode !== 'MINIMAL',
      entryPoint: 'utama',
    };

    if (mode === 'MINIMAL') {
      const minimalSource = `
// Nusantara Minimal Runtime (Barebone)
#include <stdint.h>

extern int32_t utama(void);

int main(int argc, char** argv) {
    return (int)utama();
}
`;
      return { sourceCode: minimalSource.trim(), metadata };
    }

    const bundledSource = `
/**
 * Nusantara Runtime Engine (${mode}) - v${this.RUNTIME_VERSION}
 * Platform: ${targetPlatform}
 */
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <stdbool.h>

// Deklarasi fungsi utama Nusantara (dihasilkan oleh NIR & LLVM Backend)
extern int32_t utama(void);

// Helper pencetakan bilangan 64-bit
int64_t nusantara_cetak_bilangan(int64_t val) {
    printf("%ld\\n", (long)val);
    return val;
}

// Helper pencetakan teks dengan penanganan null-safety
void nusantara_cetak_teks(const char* str) {
    if (str != NULL) {
        printf("%s\\n", str);
    } else {
        printf("(kosong)\\n");
    }
}

// Alokasi memori terkelola
void* nusantara_alokasi(size_t ukuran) {
    void* ptr = malloc(ukuran);
    if (!ptr && ukuran > 0) {
        fprintf(stderr, "[Nusantara Runtime] Galat: Alokasi memori gagal (%zu byte)\\n", ukuran);
        exit(137);
    }
    return ptr;
}

void nusantara_bebaskan(void* ptr) {
    if (ptr != NULL) {
        free(ptr);
    }
}

// Entry Point Standar C
int main(int argc, char** argv) {
    // Inisialisasi lingkungan runtime
    int32_t kodeKeluar = utama();
    return (int)kodeKeluar;
}
`;

    return { sourceCode: bundledSource.trim(), metadata };
  }
}
