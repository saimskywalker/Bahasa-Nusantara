/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA CONCURRENCY RUNTIME - Kebijakan Keadilan Penjadwalan (Fairness Policy)
 * Target Milestone: Phase 46 (v0.46.0)
 *
 * Mencegah starvasi (starvation) antar-aktor melalui alokasi kuota pemrosesan pesan (throughput budget).
 */

export interface FairnessConfig {
  /** Jumlah maksimum pesan berturut-turut yang diproses satu aktor sebelum yield ke aktor lain */
  throughputBudget: number;
  /** Apakah pesan sistem (STOP/RESTART) mendapatkan prioritas di atas pesan pengguna */
  prioritizeSystemMessages: boolean;
}

export const DEFAULT_FAIRNESS_CONFIG: Readonly<FairnessConfig> = Object.freeze({
  throughputBudget: 10,
  prioritizeSystemMessages: true,
});

export class FairnessController {
  private actorMessageCounts = new Map<string, number>();

  constructor(private readonly config: FairnessConfig = { ...DEFAULT_FAIRNESS_CONFIG }) {}

  /**
   * Memeriksa apakah aktor masih memiliki kuota pemrosesan pada putaran jadwal ini.
   */
  public hasRemainingBudget(actorId: string): boolean {
    const count = this.actorMessageCounts.get(actorId) ?? 0;
    return count < this.config.throughputBudget;
  }

  /**
   * Mencatat satu pesan yang telah diproses oleh aktor.
   */
  public recordMessageProcessed(actorId: string): void {
    const count = this.actorMessageCounts.get(actorId) ?? 0;
    this.actorMessageCounts.set(actorId, count + 1);
  }

  /**
   * Mereset kuota putaran untuk aktor tertentu setelah yield.
   */
  public resetBudget(actorId: string): void {
    this.actorMessageCounts.delete(actorId);
  }

  /**
   * Mereset seluruh kuota semua aktor.
   */
  public resetAll(): void {
    this.actorMessageCounts.clear();
  }

  public get budget(): number {
    return this.config.throughputBudget;
  }

  // Indonesian Aliases
  public dapatkanThroughputBudget(): number {
    return this.budget;
  }

  public apakahMasihAdaKuota(actorId: string = 'default'): boolean {
    return this.hasRemainingBudget(actorId);
  }

  public catatPesanDiproses(actorId: string = 'default'): void {
    this.recordMessageProcessed(actorId);
  }

  public resetGiliran(actorId: string = 'default'): void {
    this.resetBudget(actorId);
  }
}
