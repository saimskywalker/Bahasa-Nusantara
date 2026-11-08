/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA GAME SDK - Manajemen Tekstur & Gambar
 * Target Milestone: Phase 47 (v0.47.0)
 */

import { Color } from '../types';

export enum TextureFilter {
  NEAREST = 'nearest',
  LINEAR = 'linear',
}

export class Texture {
  public isLoaded: boolean = true;

  constructor(
    public readonly id: string,
    public name: string,
    public width: number = 64,
    public height: number = 64,
    public sourcePath?: string,
    public filter: TextureFilter = TextureFilter.NEAREST,
    public pixelData?: Uint8Array
  ) {}
}

export class TextureManager {
  private textures: Map<string, Texture> = new Map();

  constructor() {
    this.register(new Texture('tex_default', 'KotakPutih', 1, 1));
  }

  public register(texture: Texture): void {
    this.textures.set(texture.id, texture);
  }

  public get(id: string): Texture | undefined {
    return this.textures.get(id);
  }

  public has(id: string): boolean {
    return this.textures.has(id);
  }

  public createSolidTexture(
    id: string,
    width: number = 64,
    height: number = 64,
    _color: Color = Color.white()
  ): Texture {
    const tex = new Texture(id, id, width, height);
    tex.isLoaded = true;
    this.register(tex);
    return tex;
  }
}
