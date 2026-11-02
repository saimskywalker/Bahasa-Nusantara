/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 38
 * Pengirim Peristiwa Perangkat Native (Native Device Event Dispatcher)
 */

export type PenanganPeristiwaPerangkat<T = any> = (data: T) => void;

export class PengirimPeristiwaNative {
  private static instance: PengirimPeristiwaNative;
  private paraPendengar: Map<string, Set<PenanganPeristiwaPerangkat>> = new Map();

  private constructor() {}

  public static dapatkanInstance(): PengirimPeristiwaNative {
    if (!PengirimPeristiwaNative.instance) {
      PengirimPeristiwaNative.instance = new PengirimPeristiwaNative();
    }
    return PengirimPeristiwaNative.instance;
  }

  public langganan<T = any>(namaPeristiwa: string, penangan: PenanganPeristiwaPerangkat<T>): () => void {
    if (!this.paraPendengar.has(namaPeristiwa)) {
      this.paraPendengar.set(namaPeristiwa, new Set());
    }
    this.paraPendengar.get(namaPeristiwa)!.add(penangan);

    return () => {
      this.paraPendengar.get(namaPeristiwa)?.delete(penangan);
    };
  }

  public kirim<T = any>(namaPeristiwa: string, data: T): void {
    const daftar = this.paraPendengar.get(namaPeristiwa);
    if (!daftar) return;

    for (const fn of daftar) {
      try {
        fn(data);
      } catch (err) {
        console.error(`[PengirimPeristiwaNative] Galat pada penanganan peristiwa '${namaPeristiwa}':`, err);
      }
    }
  }

  public bersihkanSemua(): void {
    this.paraPendengar.clear();
  }
}
