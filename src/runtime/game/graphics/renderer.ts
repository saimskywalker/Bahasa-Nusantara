/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA GAME SDK - Abstraksi & Antarmuka Mesin Rendering
 * Target Milestone: Phase 47 (v0.47.0)
 */

import { Color, Rect, Vector2, Vector3 } from '../types';

export enum RenderCommandType {
  CLEAR,
  DRAW_SPRITE,
  DRAW_RECT,
  DRAW_CIRCLE,
  DRAW_LINE,
  DRAW_TEXT,
  DRAW_MESH,
}

export interface RenderCommand {
  type: RenderCommandType;
  color?: Color;
  position?: Vector2 | Vector3;
  size?: Vector2 | Vector3;
  rotation?: number | Vector3;
  textureId?: string;
  sourceRect?: Rect;
  text?: string;
  fontSize?: number;
  meshId?: string;
  materialId?: string;
  zIndex?: number;
}

export interface RenderStats {
  drawCalls: number;
  trianglesCount: number;
  spritesCount: number;
  linesCount: number;
  textElementsCount: number;
}

export interface IRenderer {
  readonly namaBackend: string;
  readonly stats: RenderStats;

  inisialisasi(canvas?: any, lebar?: number, tinggi?: number): void;
  ubahUkuran(lebar: number, tinggi: number): void;
  bersihkan(warna?: Color): void;
  clear(warna?: Color): void;
  kirimPerintah(cmd: RenderCommand): void;
  gambarSprite(textureId: string, posisi: Vector2, ukuran?: Vector2, rotasi?: number, tint?: Color, sourceRect?: Rect, zIndex?: number): void;
  drawSprite(textureId: string, xOrPos: number | Vector2, yOrSize?: number | Vector2, w?: number, h?: number, rotation?: number, color?: Color): void;
  gambarPersegi(posisi: Vector2, ukuran: Vector2, warna: Color, isi?: boolean, zIndex?: number): void;
  drawRect(xOrPos: number | Vector2, yOrSize: number | Vector2, wOrColor?: number | Color, h?: number, color?: Color): void;
  gambarLingkaran(posisi: Vector2, radius: number, warna: Color, isi?: boolean, zIndex?: number): void;
  drawCircle(xOrPos: number | Vector2, yOrRadius: number, radiusOrColor?: number | Color, color?: Color): void;
  gambarGaris(dari: Vector2, ke: Vector2, warna: Color, tebal?: number, zIndex?: number): void;
  drawLine(x1OrFrom: number | Vector2, y1OrTo: number | Vector2, x2OrColor?: number | Color, y2?: number, color?: Color, lineWidth?: number): void;
  gambarTeks(teks: string, posisi: Vector2, warna?: Color, ukuranFont?: number, zIndex?: number): void;
  drawText(text: string, xOrPos: number | Vector2, yOrColor?: number | Color, color?: Color, font?: string): void;
  gambarMesh(meshId: string, materialId: string, posisi: Vector3, rotasi?: Vector3, skala?: Vector3): void;
  eksekusiBatch(): void;
  flush(): void;
  selesaikanFrame(): void;
  resetStats(): void;
  getStats(): { drawCalls: number; triangles: number; sprites: number; lines: number; text: number };
}
