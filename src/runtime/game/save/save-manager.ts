/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SaveSlotMetadata {
  slotId: string;
  title: string;
  timestamp: number;
  version: number;
  gameVersion: string;
  checksum: string;
}

export interface SaveData<T = Record<string, unknown>> {
  metadata: SaveSlotMetadata;
  state: T;
}

export type MigrationFunction = (oldState: any) => any;

export class SaveManager {
  private slots: Map<string, SaveData> = new Map();
  private gameVersion: string;
  private currentSaveVersion: number;
  private migrations: Map<string, MigrationFunction> = new Map();

  constructor(gameVersion: string = '1.0.0', currentSaveVersion: number = 1) {
    this.gameVersion = gameVersion;
    this.currentSaveVersion = currentSaveVersion;
  }

  /**
   * Menghitung checksum integritas string status simpanan (SHA-256 sederhana atau hash 64-bit deterministik).
   */
  public calculateChecksum(content: string): string {
    let hash1 = 0x811c9dc5;
    let hash2 = 0x059a4567;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash1 ^= char;
      hash1 = Math.imul(hash1, 0x01000193);
      hash2 ^= (char << 5) - char;
      hash2 = (hash2 & hash2) >>> 0;
    }
    const hex1 = (hash1 >>> 0).toString(16).padStart(8, '0');
    const hex2 = (hash2 >>> 0).toString(16).padStart(8, '0');
    return `${hex1}${hex2}`;
  }

  public registerMigration(fromVersion: number, toVersion: number, fn: MigrationFunction): void {
    this.migrations.set(`${fromVersion}->${toVersion}`, fn);
  }

  public save<T = Record<string, unknown>>(slotId: string, state: T, title: string = slotId): SaveSlotMetadata {
    const rawState = JSON.stringify(state);
    const checksum = this.calculateChecksum(rawState);

    const metadata: SaveSlotMetadata = {
      slotId,
      title,
      timestamp: Date.now(),
      version: this.currentSaveVersion,
      gameVersion: this.gameVersion,
      checksum,
    };

    const saveData: SaveData = {
      metadata,
      state: JSON.parse(rawState),
    };

    this.slots.set(slotId, saveData);
    return metadata;
  }

  public load<T = Record<string, unknown>>(slotId: string): SaveData<T> | null {
    const data = this.slots.get(slotId);
    if (!data) return null;

    // Verifikasi integritas checksum
    const rawState = JSON.stringify(data.state);
    const expectedChecksum = this.calculateChecksum(rawState);
    if (data.metadata.checksum !== expectedChecksum) {
      throw new Error(`Integritas data simpanan '${slotId}' rusak! Checksum tidak cocok.`);
    }

    // Periksa migrasi versi
    let currentState = data.state;
    let curVer = data.metadata.version;
    while (curVer < this.currentSaveVersion) {
      const nextVer = curVer + 1;
      const key = `${curVer}->${nextVer}`;
      const mig = this.migrations.get(key);
      if (mig) {
        currentState = mig(currentState);
        curVer = nextVer;
      } else {
        break;
      }
    }

    return {
      metadata: {
        ...data.metadata,
        version: curVer,
      },
      state: currentState as T,
    };
  }

  public exists(slotId: string): boolean {
    return this.slots.has(slotId);
  }

  public delete(slotId: string): boolean {
    return this.slots.delete(slotId);
  }

  public listSlots(): SaveSlotMetadata[] {
    const list: SaveSlotMetadata[] = [];
    for (const [_, data] of this.slots) {
      list.push({ ...data.metadata });
    }
    return list.sort((a, b) => b.timestamp - a.timestamp);
  }

  public exportSlotToJson(slotId: string): string {
    const data = this.slots.get(slotId);
    if (!data) {
      throw new Error(`Slot '${slotId}' tidak ditemukan untuk diekspor`);
    }
    return JSON.stringify(data, null, 2);
  }

  public importSlotFromJson(jsonString: string): SaveSlotMetadata {
    const parsed = JSON.parse(jsonString) as SaveData;
    if (!parsed.metadata || !parsed.state || !parsed.metadata.slotId) {
      throw new Error('Format JSON simpanan tidak valid');
    }
    const rawState = JSON.stringify(parsed.state);
    const checksum = this.calculateChecksum(rawState);
    if (parsed.metadata.checksum !== checksum) {
      throw new Error('Format JSON simpanan gagal diverifikasi integritasnya');
    }
    this.slots.set(parsed.metadata.slotId, parsed);
    return parsed.metadata;
  }

  public clearAll(): void {
    this.slots.clear();
  }
}
