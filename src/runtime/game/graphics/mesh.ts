/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA GAME SDK - Geometri & Mesh 3D
 * Target Milestone: Phase 47 (v0.47.0)
 */

export interface MeshData {
  id: string;
  name: string;
  vertices: Float32Array;
  normals?: Float32Array;
  uvs?: Float32Array;
  indices: Uint16Array | Uint32Array;
}

export class Mesh {
  constructor(
    public readonly id: string,
    public readonly name: string = id,
    public vertices: Float32Array = new Float32Array(),
    public indices: Uint16Array | Uint32Array = new Uint16Array(),
    public normals?: Float32Array,
    public uvs?: Float32Array
  ) {}

  public get triangleCount(): number {
    return this.indices.length / 3;
  }

  public getTriangleCount(): number {
    return this.indices.length / 3;
  }

  public get vertexCount(): number {
    return this.vertices.length / 3;
  }

  public getVertexCount(): number {
    return this.vertices.length / 3;
  }

  public static createCube(id: string = 'cube_default', size: number = 1.0): Mesh {
    const s = size / 2;
    // 24 vertices for 6 faces with proper normals
    const vertices = new Float32Array([
      // Front face
      -s, -s,  s,   s, -s,  s,   s,  s,  s,  -s,  s,  s,
      // Back face
      -s, -s, -s,  -s,  s, -s,   s,  s, -s,   s, -s, -s,
      // Top face
      -s,  s, -s,  -s,  s,  s,   s,  s,  s,   s,  s, -s,
      // Bottom face
      -s, -s, -s,   s, -s, -s,   s, -s,  s,  -s, -s,  s,
      // Right face
       s, -s, -s,   s,  s, -s,   s,  s,  s,   s, -s,  s,
      // Left face
      -s, -s, -s,  -s, -s,  s,  -s,  s,  s,  -s,  s, -s,
    ]);

    const indices = new Uint16Array([
      0,  1,  2,      0,  2,  3,    // front
      4,  5,  6,      4,  6,  7,    // back
      8,  9,  10,     8,  10, 11,   // top
      12, 13, 14,     12, 14, 15,   // bottom
      16, 17, 18,     16, 18, 19,   // right
      20, 21, 22,     20, 22, 23    // left
    ]);

    return new Mesh(id, 'Kubus', vertices, indices);
  }

  public static createPlane(id: string = 'plane_default', width: number = 10, depth: number = 10): Mesh {
    const w = width / 2;
    const d = depth / 2;
    const vertices = new Float32Array([
      -w, 0, -d,
       w, 0, -d,
       w, 0,  d,
      -w, 0,  d,
    ]);
    const indices = new Uint16Array([0, 2, 1, 0, 3, 2]);
    return new Mesh(id, 'BidangDatar', vertices, indices);
  }

  public static createSphere(id: string = 'sphere_default', radius: number = 0.5, segments: number = 16): Mesh {
    const vertices: number[] = [];
    const indices: number[] = [];

    for (let lat = 0; lat <= segments; lat++) {
      const theta = (lat * Math.PI) / segments;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= segments; lon++) {
        const phi = (lon * 2 * Math.PI) / segments;
        const x = Math.cos(phi) * sinTheta;
        const y = cosTheta;
        const z = Math.sin(phi) * sinTheta;
        vertices.push(x * radius, y * radius, z * radius);
      }
    }

    for (let lat = 0; lat < segments; lat++) {
      for (let lon = 0; lon < segments; lon++) {
        const first = lat * (segments + 1) + lon;
        const second = first + segments + 1;
        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }

    return new Mesh(id, 'Bola', new Float32Array(vertices), new Uint16Array(indices));
  }
}
