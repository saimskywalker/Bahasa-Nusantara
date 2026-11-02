/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 39
 * Penjadwalan Tugas Background & Sinkronisasi Berkala (Android WorkManager & iOS BackgroundTasks)
 */

export interface BatasanTugasBackground {
  memerlukanJaringan: boolean;
  memerlukanWifi?: boolean;
  memerlukanBateraiCukup: boolean;
  memerlukanPengisianDaya?: boolean;
}

export interface TugasBackgroundMobile {
  id: string;
  nama: string;
  intervalMenit?: number;
  batasan: BatasanTugasBackground;
  terakhirDijalankan?: number;
  status: 'aktif' | 'dihentikan';
  eksekutor: () => Promise<boolean>;
}

export class PengelolaTugasBackgroundMobile {
  private static instance: PengelolaTugasBackgroundMobile;
  private daftarTugas: Map<string, TugasBackgroundMobile> = new Map();
  private pengaturInterval: Map<string, any> = new Map();

  private constructor() {}

  public static dapatkanInstance(): PengelolaTugasBackgroundMobile {
    if (!this.instance) {
      this.instance = new PengelolaTugasBackgroundMobile();
    }
    return this.instance;
  }

  public daftarkanTugas(
    id: string,
    nama: string,
    eksekutor: () => Promise<boolean>,
    batasan: BatasanTugasBackground = { memerlukanJaringan: true, memerlukanBateraiCukup: true },
    intervalMenit = 15
  ): void {
    const tugas: TugasBackgroundMobile = {
      id,
      nama,
      intervalMenit,
      batasan,
      status: 'aktif',
      eksekutor,
    };

    this.daftarTugas.set(id, tugas);

    // Di simulator / desktop environment, jadwalkan simulasi interval
    if (this.pengaturInterval.has(id)) {
      clearInterval(this.pengaturInterval.get(id));
    }

    const intervalMs = Math.max(intervalMenit * 60 * 1000, 30000); // Minimal 30 detik untuk testing
    const timer = setInterval(async () => {
      if (tugas.status === 'aktif') {
        try {
          tugas.terakhirDijalankan = Date.now();
          await tugas.eksekutor();
        } catch {}
      }
    }, intervalMs);

    this.pengaturInterval.set(id, timer);
  }

  public hentikanTugas(id: string): boolean {
    const t = this.daftarTugas.get(id);
    if (t) {
      t.status = 'dihentikan';
      if (this.pengaturInterval.has(id)) {
        clearInterval(this.pengaturInterval.get(id));
        this.pengaturInterval.delete(id);
      }
      return true;
    }
    return false;
  }

  public dapatkanSemuaTugas(): TugasBackgroundMobile[] {
    return Array.from(this.daftarTugas.values());
  }

  public async jalankanManual(id: string): Promise<boolean> {
    const t = this.daftarTugas.get(id);
    if (!t) return false;
    t.terakhirDijalankan = Date.now();
    return await t.eksekutor();
  }
}
