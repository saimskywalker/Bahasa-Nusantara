/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA GAME SDK - Material & Shading
 * Target Milestone: Phase 47 (v0.47.0)
 */

import { Color } from '../types';

export class Material {
  constructor(
    public readonly id: string,
    public name: string,
    public diffuseColor: Color = Color.white(),
    public textureId?: string,
    public wireframe: boolean = false,
    public roughness: number = 0.5,
    public metallic: number = 0.0,
    public shaderId?: string
  ) {}
}

export class MaterialManager {
  private materials: Map<string, Material> = new Map();

  constructor() {
    this.register(new Material('mat_default', 'Bawaan', Color.white()));
  }

  public register(material: Material): void {
    this.materials.set(material.id, material);
  }

  public get(id: string): Material | undefined {
    return this.materials.get(id);
  }

  public has(id: string): boolean {
    return this.materials.has(id);
  }

  public create(
    id: string,
    options: {
      name?: string;
      diffuseColor?: Color;
      textureId?: string;
      wireframe?: boolean;
      roughness?: number;
      metallic?: number;
      shininess?: number;
      shaderId?: string;
    } = {}
  ): Material {
    const mat = new Material(
      id,
      options.name || id,
      options.diffuseColor || Color.white(),
      options.textureId,
      options.wireframe || false,
      options.roughness || 0.5,
      options.metallic || 0.0,
      options.shaderId
    );
    this.register(mat);
    return mat;
  }
}
