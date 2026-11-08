/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA GAME SDK - Shader & Tata Cahaya 3D (Lighting)
 * Target Milestone: Phase 47 (v0.47.0)
 */

import { Color, Vector3 } from '../types';

export class Shader {
  public compiled: boolean = true;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public vertexSource: string,
    public fragmentSource: string,
    public uniforms: Map<string, any> = new Map()
  ) {}
}

export class ShaderManager {
  private shaders: Map<string, Shader> = new Map();

  constructor() {
    this.register(
      new Shader(
        'shader_2d_default',
        'Shader2DBawaan',
        'attribute vec2 a_pos; uniform mat3 u_matrix; void main() { gl_Position = vec4((u_matrix * vec3(a_pos, 1.0)).xy, 0.0, 1.0); }',
        'precision mediump float; uniform vec4 u_color; void main() { gl_FragColor = u_color; }'
      )
    );
    this.register(
      new Shader(
        'shader_3d_phong',
        'Shader3DPhong',
        'attribute vec3 a_position; attribute vec3 a_normal; uniform mat4 u_mvp; void main() { gl_Position = u_mvp * vec4(a_position, 1.0); }',
        'precision mediump float; uniform vec4 u_diffuse; void main() { gl_FragColor = u_diffuse; }'
      )
    );
  }

  public register(shader: Shader): void {
    this.shaders.set(shader.id, shader);
  }

  public get(id: string): Shader | undefined {
    return this.shaders.get(id);
  }

  public createDefaultShader(): Shader {
    const s = new Shader('default', 'ShaderDefault', '', '');
    s.compiled = true;
    this.register(s);
    return s;
  }
}

export enum LightType {
  DIRECTIONAL,
  POINT,
  SPOT,
  AMBIENT,
}

export class Light {
  constructor(
    public readonly id: string,
    public type: LightType,
    public color: Color = Color.white(),
    public intensity: number = 1.0,
    public position: Vector3 = Vector3.zero(),
    public direction: Vector3 = new Vector3(0, -1, 0),
    public range: number = 10,
    public spotAngle: number = 45
  ) {}
}
