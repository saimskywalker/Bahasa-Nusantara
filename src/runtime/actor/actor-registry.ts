/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA CONCURRENCY RUNTIME - Registri Aktor (Actor Registry)
 * Target Milestone: Phase 46 (v0.46.0)
 */

import { ActorRef } from './actor-ref';
import { ConcurrencyError, ConcurrencyErrorCode } from './errors';

export class ActorRegistry {
  private actorsById = new Map<string, any>();
  private actorsByName = new Map<string, any>();

  /**
   * Mendaftarkan aktor baru ke registri.
   */
  public register(actor: any): void {
    if (this.actorsById.has(actor.id)) {
      throw new ConcurrencyError(
        ConcurrencyErrorCode.AKTOR_ID_DUPLIKAT,
        `Aktor dengan ID '${actor.id}' sudah terdaftar dalam sistem.`
      );
    }

    this.actorsById.set(actor.id, actor);
    if (actor.name) {
      this.actorsByName.set(actor.name, actor);
    }
  }

  /**
   * Mencari aktor berdasarkan ID unik.
   */
  public getById(id: string): any | undefined {
    return this.actorsById.get(id);
  }

  /**
   * Mencari aktor berdasarkan nama alias.
   */
  public getByName(name: string): any | undefined {
    return this.actorsByName.get(name);
  }

  /**
   * Memeriksa apakah aktor terdaftar dan aktif.
   */
  public has(id: string): boolean {
    return this.actorsById.has(id);
  }

  /**
   * Menghapus aktor dari registri saat berhenti.
   */
  public unregister(id: string): boolean {
    const actor = this.actorsById.get(id);
    if (!actor) return false;

    this.actorsById.delete(id);
    if (actor.name) {
      this.actorsByName.delete(actor.name);
    }
    return true;
  }

  public get count(): number {
    return this.actorsById.size;
  }

  public getAll(): any[] {
    return Array.from(this.actorsById.values());
  }

  public clear(): void {
    this.actorsById.clear();
    this.actorsByName.clear();
  }

  // Indonesian Aliases
  public jumlahAktor(): number {
    return this.count;
  }

  public temukanDenganId(id: string): any | undefined {
    return this.getById(id);
  }

  public temukanDenganNama(name: string): any | undefined {
    return this.getByName(name);
  }

  public daftarSemua(): any[] {
    return this.getAll();
  }
}
