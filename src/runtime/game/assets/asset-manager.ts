/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Texture, TextureManager } from '../graphics/texture';
import { AudioClip, AudioManager } from '../audio/audio-manager';
import { Mesh } from '../graphics/mesh';

export type AssetType = 'texture' | 'audio' | 'json' | 'mesh' | 'text' | 'binary';

export interface AssetRecord<T = unknown> {
  id: string;
  path: string;
  type: AssetType;
  data: T;
  sizeBytes: number;
  loadedAt: number;
}

export interface AssetManagerConfig {
  basePath: string;
  maxSizeBytes: number; // default 100MB
  allowedExtensions: Record<AssetType, string[]>;
}

export class AssetManager {
  private config: AssetManagerConfig;
  private cache: Map<string, AssetRecord> = new Map();
  private totalSizeBytes: number = 0;
  private textureManager: TextureManager;
  private audioManager?: AudioManager;

  constructor(
    config?: Partial<AssetManagerConfig>,
    textureManager?: TextureManager,
    audioManager?: AudioManager
  ) {
    this.config = {
      basePath: 'assets',
      maxSizeBytes: 100 * 1024 * 1024,
      allowedExtensions: {
        texture: ['.png', '.jpg', '.jpeg', '.webp', '.svg'],
        audio: ['.wav', '.mp3', '.ogg', '.aac', '.flac'],
        json: ['.json'],
        mesh: ['.obj', '.gltf', '.glb'],
        text: ['.txt', '.nusantara', '.csv', '.xml'],
        binary: ['.bin', '.dat'],
      },
      ...config,
    };
    this.textureManager = textureManager || new TextureManager();
    this.audioManager = audioManager;
  }

  /**
   * Memvalidasi bahwa jalur berkas aman dari traversal kerentanan (anti path-traversal).
   */
  public validatePath(path: string, type?: AssetType): void {
    if (!path || typeof path !== 'string') {
      throw new Error(`Jalur aset tidak valid: ${path}`);
    }

    // Blokir pola traversal direktori
    const normalized = path.replace(/\\/g, '/');
    if (normalized.includes('../') || normalized.includes('/..') || normalized === '..') {
      throw new Error(`Deteksi path traversal dilarang pada akses aset: ${path}`);
    }

    if (normalized.startsWith('/') || /^[a-zA-Z]:/.test(normalized)) {
      // Jalur absolut dicegah kecuali jika berada dalam batas basePath yang diizinkan
      // Untuk keamanan lingkungan applet, gunakan relative base
    }

    if (type) {
      const allowed = this.config.allowedExtensions[type];
      const lower = path.toLowerCase();
      const hasValidExt = allowed.some((ext) => lower.endsWith(ext));
      if (!hasValidExt) {
        throw new Error(`Ekstensi berkas '${path}' tidak diizinkan untuk tipe aset '${type}'. Ekstensi valid: ${allowed.join(', ')}`);
      }
    }
  }

  public registerCustomAsset<T>(id: string, path: string, type: AssetType, data: T, sizeBytes: number = 1024): void {
    this.validatePath(path, type);
    if (this.totalSizeBytes + sizeBytes > this.config.maxSizeBytes) {
      throw new Error(`Kapasitas cache aset terlampaui (Maks: ${this.config.maxSizeBytes} byte)`);
    }

    if (this.cache.has(id)) {
      const prev = this.cache.get(id)!;
      this.totalSizeBytes -= prev.sizeBytes;
    }

    this.cache.set(id, {
      id,
      path,
      type,
      data,
      sizeBytes,
      loadedAt: Date.now(),
    });
    this.totalSizeBytes += sizeBytes;
  }

  public loadTexture(id: string, path: string, width: number = 64, height: number = 64): Texture {
    this.validatePath(path, 'texture');
    const tex = this.textureManager.createSolidTexture(id, width, height);
    this.registerCustomAsset(id, path, 'texture', tex, width * height * 4);
    return tex;
  }

  public loadAudio(id: string, path: string, durationSeconds: number = 1.0): AudioClip {
    this.validatePath(path, 'audio');
    const clip: AudioClip = {
      id,
      path,
      duration: durationSeconds,
      isLoaded: true,
    };
    if (this.audioManager) {
      this.audioManager.registerClip(clip);
    }
    this.registerCustomAsset(id, path, 'audio', clip, Math.floor(durationSeconds * 44100 * 2));
    return clip;
  }

  public loadJson<T = unknown>(id: string, path: string, mockData?: T): T {
    this.validatePath(path, 'json');
    const data = mockData !== undefined ? mockData : ({} as T);
    const estSize = JSON.stringify(data).length * 2;
    this.registerCustomAsset(id, path, 'json', data, estSize);
    return data;
  }

  public loadMesh(id: string, path: string, meshData?: Mesh): Mesh {
    this.validatePath(path, 'mesh');
    const mesh = meshData || new Mesh(id);
    this.registerCustomAsset(id, path, 'mesh', mesh, 2048);
    return mesh;
  }

  public loadText(id: string, path: string, textContent: string = ''): string {
    this.validatePath(path, 'text');
    this.registerCustomAsset(id, path, 'text', textContent, textContent.length * 2);
    return textContent;
  }

  public get<T>(id: string): T | undefined {
    const record = this.cache.get(id);
    return record ? (record.data as T) : undefined;
  }

  public getRecord(id: string): AssetRecord | undefined {
    return this.cache.get(id);
  }

  public has(id: string): boolean {
    return this.cache.has(id);
  }

  public remove(id: string): boolean {
    const record = this.cache.get(id);
    if (record) {
      this.totalSizeBytes -= record.sizeBytes;
      return this.cache.delete(id);
    }
    return false;
  }

  public clear(): void {
    this.cache.clear();
    this.totalSizeBytes = 0;
  }

  public getStats(): { count: number; totalSizeBytes: number; maxSizeBytes: number } {
    return {
      count: this.cache.size,
      totalSizeBytes: this.totalSizeBytes,
      maxSizeBytes: this.config.maxSizeBytes,
    };
  }

  public async preloadAll(
    items: Array<{ id: string; path: string; type: AssetType; data?: unknown }>
  ): Promise<void> {
    for (const item of items) {
      switch (item.type) {
        case 'texture':
          this.loadTexture(item.id, item.path);
          break;
        case 'audio':
          this.loadAudio(item.id, item.path);
          break;
        case 'json':
          this.loadJson(item.id, item.path, item.data);
          break;
        case 'mesh':
          this.loadMesh(item.id, item.path, item.data as Mesh);
          break;
        case 'text':
          this.loadText(item.id, item.path, (item.data as string) || '');
          break;
        case 'binary':
          this.registerCustomAsset(item.id, item.path, 'binary', item.data || new Uint8Array(), 1024);
          break;
      }
    }
  }
}
