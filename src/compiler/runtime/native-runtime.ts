/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA NATIVE RUNTIME - Definisi ABI & Stub C Standar
 * Target Milestone: Phase 44 (v0.44.0)
 */

export class NativeRuntimeManager {
  /**
   * Menghasilkan kode C runtime pendukung yang mencakup entrypoint 'main'
   * yang menginisialisasi ekosistem Nusantara lalu memanggil '@utama' NIR.
   */
  public static generateRuntimeCSource(): string {
    return `
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

// Deklarasi fungsi utama Nusantara (dihasilkan oleh NIR)
extern int32_t utama(void);

// Fungsi bantuan runtime bawaan
int64_t nusantara_cetak_bilangan(int64_t val) {
    printf("%ld\n", (long)val);
    return val;
}

void nusantara_cetak_teks(const char* str) {
    if (str != NULL) {
        printf("%s\n", str);
    }
}

// C Entry Point standar sistem operasi
int main(int argc, char** argv) {
    // Inisialisasi runtime Nusantara
    int32_t hasil = utama();
    return (int)hasil;
}
`;
  }
}
