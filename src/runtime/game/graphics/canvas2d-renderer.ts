/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA GAME SDK - Canvas 2D & Virtual Software Renderer
 * Target Milestone: Phase 47 (v0.47.0)
 */

import { Color, Rect, Vector2, Vector3 } from '../types';
import { IRenderer, RenderCommand, RenderCommandType, RenderStats } from './renderer';

export class Canvas2DRenderer implements IRenderer {
  public readonly namaBackend = 'Canvas2D / Virtual Software';
  private ctx: any = null;
  private canvas: any = null;
  private width: number = 800;
  private height: number = 600;
  private commandQueue: RenderCommand[] = [];

  public stats: RenderStats = {
    drawCalls: 0,
    trianglesCount: 0,
    spritesCount: 0,
    linesCount: 0,
    textElementsCount: 0,
  };

  constructor(arg1?: any, arg2: number = 800, arg3: number = 600) {
    if (typeof arg1 === 'number') {
      this.inisialisasi(undefined, arg1, arg2);
    } else {
      this.inisialisasi(arg1, arg2, arg3);
    }
  }

  public inisialisasi(canvas?: any, lebar: number = 800, tinggi: number = 600): void {
    this.width = lebar;
    this.height = tinggi;
    if (canvas) {
      this.canvas = canvas;
      if (typeof canvas.getContext === 'function') {
        this.ctx = canvas.getContext('2d');
      }
    }
  }

  public ubahUkuran(lebar: number, tinggi: number): void {
    this.width = lebar;
    this.height = tinggi;
    if (this.canvas) {
      this.canvas.width = lebar;
      this.canvas.height = tinggi;
    }
  }

  public bersihkan(warna: Color = Color.black()): void {
    this.kirimPerintah({
      type: RenderCommandType.CLEAR,
      color: warna,
    });
  }

  public clear(warna: Color = Color.black()): void {
    this.bersihkan(warna);
  }

  public kirimPerintah(cmd: RenderCommand): void {
    this.commandQueue.push(cmd);
  }

  public gambarSprite(
    textureId: string,
    posisi: Vector2,
    ukuran?: Vector2,
    rotasi: number = 0,
    tint: Color = Color.white(),
    sourceRect?: Rect,
    zIndex: number = 0
  ): void {
    this.kirimPerintah({
      type: RenderCommandType.DRAW_SPRITE,
      textureId,
      position: posisi,
      size: ukuran || new Vector2(32, 32),
      rotation: rotasi,
      color: tint,
      sourceRect,
      zIndex,
    });
  }

  public drawSprite(
    textureId: string,
    xOrPos: number | Vector2,
    yOrSize?: number | Vector2,
    w?: number,
    h?: number,
    rotation: number = 0,
    color: Color = Color.white()
  ): void {
    if (xOrPos instanceof Vector2) {
      this.gambarSprite(textureId, xOrPos, yOrSize as Vector2, rotation, color);
    } else {
      const pos = new Vector2(xOrPos, yOrSize as number);
      const size = new Vector2(w || 32, h || 32);
      this.gambarSprite(textureId, pos, size, rotation, color);
    }
  }

  public gambarPersegi(
    posisi: Vector2,
    ukuran: Vector2,
    warna: Color,
    isi: boolean = true,
    zIndex: number = 0
  ): void {
    this.kirimPerintah({
      type: RenderCommandType.DRAW_RECT,
      position: posisi,
      size: ukuran,
      color: warna,
      rotation: isi ? 1 : 0,
      zIndex,
    });
  }

  public drawRect(
    xOrPos: number | Vector2,
    yOrSize: number | Vector2,
    wOrColor?: number | Color,
    h?: number,
    color?: Color
  ): void {
    if (xOrPos instanceof Vector2) {
      const size = yOrSize as Vector2;
      const col = (wOrColor as Color) || Color.white();
      this.gambarPersegi(xOrPos, size, col);
    } else {
      const x = xOrPos;
      const y = yOrSize as number;
      const w = wOrColor as number;
      const hVal = h !== undefined ? h : 0;
      const col = color || Color.white();
      this.gambarPersegi(new Vector2(x, y), new Vector2(w, hVal), col);
    }
  }

  public gambarLingkaran(
    posisi: Vector2,
    radius: number,
    warna: Color,
    isi: boolean = true,
    zIndex: number = 0
  ): void {
    this.kirimPerintah({
      type: RenderCommandType.DRAW_CIRCLE,
      position: posisi,
      size: new Vector2(radius, radius),
      color: warna,
      rotation: isi ? 1 : 0,
      zIndex,
    });
  }

  public drawCircle(
    xOrPos: number | Vector2,
    yOrRadius: number,
    radiusOrColor?: number | Color,
    color?: Color
  ): void {
    if (xOrPos instanceof Vector2) {
      const radius = yOrRadius;
      const col = (radiusOrColor as Color) || Color.white();
      this.gambarLingkaran(xOrPos, radius, col);
    } else {
      const x = xOrPos;
      const y = yOrRadius;
      const radius = radiusOrColor as number;
      const col = color || Color.white();
      this.gambarLingkaran(new Vector2(x, y), radius, col);
    }
  }

  public gambarGaris(
    dari: Vector2,
    ke: Vector2,
    warna: Color,
    tebal: number = 1,
    zIndex: number = 0
  ): void {
    this.kirimPerintah({
      type: RenderCommandType.DRAW_LINE,
      position: dari,
      size: ke,
      color: warna,
      rotation: tebal,
      zIndex,
    });
  }

  public drawLine(
    x1OrFrom: number | Vector2,
    y1OrTo: number | Vector2,
    x2OrColor?: number | Color,
    y2?: number,
    color?: Color,
    lineWidth: number = 1
  ): void {
    if (x1OrFrom instanceof Vector2) {
      const to = y1OrTo as Vector2;
      const col = (x2OrColor as Color) || Color.white();
      this.gambarGaris(x1OrFrom, to, col, y2 || 1);
    } else {
      const x1 = x1OrFrom;
      const y1 = y1OrTo as number;
      const x2 = x2OrColor as number;
      const y2Val = y2 !== undefined ? y2 : 0;
      const col = color || Color.white();
      this.gambarGaris(new Vector2(x1, y1), new Vector2(x2, y2Val), col, lineWidth);
    }
  }

  public gambarTeks(
    teks: string,
    posisi: Vector2,
    warna: Color = Color.white(),
    ukuranFont: number = 14,
    zIndex: number = 0
  ): void {
    this.kirimPerintah({
      type: RenderCommandType.DRAW_TEXT,
      text: teks,
      position: posisi,
      color: warna,
      fontSize: ukuranFont,
      zIndex,
    });
  }

  public drawText(
    text: string,
    xOrPos: number | Vector2,
    yOrColor?: number | Color,
    color?: Color,
    _font?: string
  ): void {
    if (xOrPos instanceof Vector2) {
      const col = (yOrColor as Color) || Color.white();
      this.gambarTeks(text, xOrPos, col);
    } else {
      const x = xOrPos;
      const y = yOrColor as number;
      const col = color || Color.white();
      this.gambarTeks(text, new Vector2(x, y), col);
    }
  }

  public gambarMesh(
    meshId: string,
    materialId: string,
    posisi: Vector3,
    rotasi?: Vector3,
    skala?: Vector3
  ): void {
    this.kirimPerintah({
      type: RenderCommandType.DRAW_MESH,
      meshId,
      materialId,
      position: posisi,
      rotation: rotasi || Vector3.zero(),
      size: skala || Vector3.one(),
    });
  }

  public eksekusiBatch(): void {
    this.commandQueue.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    for (const cmd of this.commandQueue) {
      this.stats.drawCalls++;

      switch (cmd.type) {
        case RenderCommandType.CLEAR: {
          if (this.ctx) {
            this.ctx.fillStyle = cmd.color ? cmd.color.toHex() : '#000000';
            this.ctx.fillRect(0, 0, this.width, this.height);
          }
          break;
        }

        case RenderCommandType.DRAW_SPRITE: {
          this.stats.spritesCount++;
          this.stats.trianglesCount += 2;
          if (this.ctx) {
            const pos = cmd.position as Vector2;
            const size = cmd.size as Vector2;
            this.ctx.save();
            this.ctx.translate(pos.x, pos.y);
            if (cmd.rotation) {
              this.ctx.rotate((cmd.rotation as number) * (Math.PI / 180));
            }
            this.ctx.fillStyle = cmd.color ? cmd.color.toHex() : '#ffffff';
            this.ctx.fillRect(-size.x / 2, -size.y / 2, size.x, size.y);
            this.ctx.restore();
          }
          break;
        }

        case RenderCommandType.DRAW_RECT: {
          this.stats.trianglesCount += 2;
          if (this.ctx) {
            const pos = cmd.position as Vector2;
            const size = cmd.size as Vector2;
            this.ctx.fillStyle = cmd.color ? cmd.color.toHex() : '#ffffff';
            this.ctx.strokeStyle = cmd.color ? cmd.color.toHex() : '#ffffff';
            if (cmd.rotation === 1) {
              this.ctx.fillRect(pos.x, pos.y, size.x, size.y);
            } else {
              this.ctx.strokeRect(pos.x, pos.y, size.x, size.y);
            }
          }
          break;
        }

        case RenderCommandType.DRAW_CIRCLE: {
          this.stats.trianglesCount += 16;
          if (this.ctx) {
            const pos = cmd.position as Vector2;
            const radius = (cmd.size as Vector2).x;
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = cmd.color ? cmd.color.toHex() : '#ffffff';
            this.ctx.strokeStyle = cmd.color ? cmd.color.toHex() : '#ffffff';
            if (cmd.rotation === 1) {
              this.ctx.fill();
            } else {
              this.ctx.stroke();
            }
          }
          break;
        }

        case RenderCommandType.DRAW_LINE: {
          this.stats.linesCount++;
          if (this.ctx) {
            const dari = cmd.position as Vector2;
            const ke = cmd.size as Vector2;
            this.ctx.beginPath();
            this.ctx.moveTo(dari.x, dari.y);
            this.ctx.lineTo(ke.x, ke.y);
            this.ctx.strokeStyle = cmd.color ? cmd.color.toHex() : '#ffffff';
            this.ctx.lineWidth = (cmd.rotation as number) || 1;
            this.ctx.stroke();
          }
          break;
        }

        case RenderCommandType.DRAW_TEXT: {
          this.stats.textElementsCount++;
          if (this.ctx && cmd.text) {
            const pos = cmd.position as Vector2;
            this.ctx.font = `${cmd.fontSize || 14}px sans-serif`;
            this.ctx.fillStyle = cmd.color ? cmd.color.toHex() : '#ffffff';
            this.ctx.fillText(cmd.text, pos.x, pos.y);
          }
          break;
        }

        case RenderCommandType.DRAW_MESH: {
          this.stats.trianglesCount += 12;
          break;
        }
      }
    }

    this.commandQueue = [];
  }

  public flush(): void {
    this.eksekusiBatch();
  }

  public selesaikanFrame(): void {
    this.eksekusiBatch();
  }

  public resetStats(): void {
    this.stats = {
      drawCalls: 0,
      trianglesCount: 0,
      spritesCount: 0,
      linesCount: 0,
      textElementsCount: 0,
    };
  }

  public getStats(): { drawCalls: number; triangles: number; sprites: number; lines: number; text: number } {
    return {
      drawCalls: this.stats.drawCalls,
      triangles: this.stats.trianglesCount,
      sprites: this.stats.spritesCount,
      lines: this.stats.linesCount,
      text: this.stats.textElementsCount,
    };
  }
}
