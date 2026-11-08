/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA GAME SDK - Sistem Kamera 2D & 3D
 * Target Milestone: Phase 47 (v0.47.0)
 */

import { Rect, Vector2, Vector3 } from '../types';

export class Camera2D {
  public position: Vector2 = new Vector2(0, 0);
  public zoom: number = 1.0;
  public rotation: number = 0;
  public viewportSize: Vector2 = new Vector2(800, 600);
  public bounds: Rect | null = null;

  constructor(arg1?: Vector2 | number, arg2?: number, zoom: number = 1.0) {
    if (arg1 instanceof Vector2) {
      this.position = arg1.salin();
      if (typeof arg2 === 'number') {
        this.zoom = arg2;
      }
      this.viewportSize = new Vector2(800, 600);
    } else if (typeof arg1 === 'number' && typeof arg2 === 'number') {
      this.viewportSize = new Vector2(arg1, arg2);
      this.zoom = zoom;
    }
  }

  public follow(targetPos: Vector2, lerpFactor: number = 1.0): void {
    const clampedLerp = Math.max(0, Math.min(1, lerpFactor));
    this.position.x += (targetPos.x - this.position.x) * clampedLerp;
    this.position.y += (targetPos.y - this.position.y) * clampedLerp;
    this.clampToBounds();
  }

  public clampToBounds(): void {
    if (this.bounds) {
      const halfW = this.viewportSize.x / (2 * this.zoom);
      const halfH = this.viewportSize.y / (2 * this.zoom);
      this.position.x = Math.max(this.bounds.xMin, Math.min(this.bounds.xMax, this.position.x));
      this.position.y = Math.max(this.bounds.yMin, Math.min(this.bounds.yMax, this.position.y));
    }
  }

  public update(_dt: number): void {
    this.clampToBounds();
  }

  public worldToScreen(worldX: number, worldY: number): Vector2;
  public worldToScreen(worldPos: Vector2): Vector2;
  public worldToScreen(arg1: number | Vector2, arg2?: number): Vector2 {
    const wx = typeof arg1 === 'number' ? arg1 : arg1.x;
    const wy = typeof arg1 === 'number' ? (arg2 !== undefined ? arg2 : 0) : arg1.y;

    const screenX = (wx - this.position.x) * this.zoom + this.viewportSize.x / 2;
    const screenY = (wy - this.position.y) * this.zoom + this.viewportSize.y / 2;
    return new Vector2(screenX, screenY);
  }

  public screenToWorld(screenX: number, screenY: number): Vector2;
  public screenToWorld(screenPos: Vector2): Vector2;
  public screenToWorld(arg1: number | Vector2, arg2?: number): Vector2 {
    const sx = typeof arg1 === 'number' ? arg1 : arg1.x;
    const sy = typeof arg1 === 'number' ? (arg2 !== undefined ? arg2 : 0) : arg1.y;

    const worldX = (sx - this.viewportSize.x / 2) / this.zoom + this.position.x;
    const worldY = (sy - this.viewportSize.y / 2) / this.zoom + this.position.y;
    return new Vector2(worldX, worldY);
  }
}

export class Camera3D {
  public position: Vector3 = new Vector3(0, 5, -10);
  public target: Vector3 = new Vector3(0, 0, 0);
  public up: Vector3 = new Vector3(0, 1, 0);
  public fov: number = 60;
  public aspect: number = 800 / 600;
  public near: number = 0.1;
  public far: number = 1000;
  public isPerspective: boolean = true;

  constructor(fov = 60, aspect = 800 / 600, near = 0.1, far = 1000) {
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
  }

  public lookAt(target: Vector3): void {
    this.target = target.salin();
  }

  public getForward(): Vector3 {
    return this.target.kurang(this.position).normalisasi();
  }
}
