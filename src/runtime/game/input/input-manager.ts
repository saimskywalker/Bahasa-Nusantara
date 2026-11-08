/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA GAME SDK - Sistem Pengendali Input & Pemetaan Aksi
 * Target Milestone: Phase 47 (v0.47.0)
 */

import { Vector2 } from '../types';

export enum MouseButton {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
}

export class InputManager {
  private keysDown: Set<string> = new Set();
  private keysPressedThisFrame: Set<string> = new Set();
  private keysReleasedThisFrame: Set<string> = new Set();

  private mouseButtonsDown: Set<number> = new Set();
  private mouseButtonsPressedThisFrame: Set<number> = new Set();
  private mouseButtonsReleasedThisFrame: Set<number> = new Set();
  private mousePosition: Vector2 = new Vector2(0, 0);
  private mouseDelta: Vector2 = new Vector2(0, 0);

  private actionMap: Map<string, string[]> = new Map();

  constructor() {
    this.inisialisasiDefaultActionMap();
  }

  private inisialisasiDefaultActionMap(): void {
    this.mapAction('bergerak_kanan', ['ArrowRight', 'KeyD', 'D']);
    this.mapAction('bergerak_kiri', ['ArrowLeft', 'KeyA', 'A']);
    this.mapAction('bergerak_atas', ['ArrowUp', 'KeyW', 'W']);
    this.mapAction('bergerak_bawah', ['ArrowDown', 'KeyS', 'S']);
    this.mapAction('lompat', ['Space', ' ']);
    this.mapAction('tembak', ['KeyF', 'F', 'MOUSE_LEFT']);
  }

  public mapAction(actionName: string, keys: string[]): void {
    this.actionMap.set(actionName, keys);
  }

  public petakanAksi(namaAksi: string, kunci: string | string[]): void {
    const list = Array.isArray(kunci) ? kunci : [kunci];
    this.mapAction(namaAksi, list);
  }

  public isKeyDown(key: string): boolean {
    return this.keysDown.has(key.toUpperCase()) || this.keysDown.has(key);
  }

  public apakahTombolDitekan(kunci: string): boolean {
    return this.isKeyDown(kunci);
  }

  public isKeyPressed(key: string): boolean {
    return this.keysPressedThisFrame.has(key.toUpperCase()) || this.keysPressedThisFrame.has(key);
  }

  public apakahTombolBaruDitekan(kunci: string): boolean {
    return this.isKeyPressed(kunci);
  }

  public isKeyReleased(key: string): boolean {
    return this.keysReleasedThisFrame.has(key.toUpperCase()) || this.keysReleasedThisFrame.has(key);
  }

  public apakahTombolDilepas(kunci: string): boolean {
    return this.isKeyReleased(kunci);
  }

  public isActionActive(actionName: string): boolean {
    const keys = this.actionMap.get(actionName);
    if (!keys) return false;
    for (const key of keys) {
      if (key === 'MOUSE_LEFT' && this.mouseButtonsDown.has(MouseButton.LEFT)) return true;
      if (key === 'MOUSE_RIGHT' && this.mouseButtonsDown.has(MouseButton.RIGHT)) return true;
      if (this.isKeyDown(key)) return true;
    }
    return false;
  }

  public apakahAksiAktif(namaAksi: string): boolean {
    return this.isActionActive(namaAksi);
  }

  public isActionPressed(actionName: string): boolean {
    const keys = this.actionMap.get(actionName);
    if (!keys) return false;
    for (const key of keys) {
      if (key === 'MOUSE_LEFT' && this.mouseButtonsPressedThisFrame.has(MouseButton.LEFT)) return true;
      if (this.isKeyPressed(key)) return true;
    }
    return false;
  }

  public apakahAksiDitekan(namaAksi: string): boolean {
    return this.isActionPressed(namaAksi);
  }

  public getMousePosition(): Vector2 {
    return this.mousePosition.salin();
  }

  public posisiMouse(): Vector2 {
    return this.getMousePosition();
  }

  public getMouseDelta(): Vector2 {
    return this.mouseDelta.salin();
  }

  public apakahTombolMouseDitekan(tombol: number): boolean {
    return this.mouseButtonsDown.has(tombol);
  }

  public apakahTombolMouseBaruDitekan(tombol: number): boolean {
    return this.mouseButtonsPressedThisFrame.has(tombol);
  }

  public apakahTombolMouseDilepas(tombol: number): boolean {
    return this.mouseButtonsReleasedThisFrame.has(tombol);
  }

  // --- External Input Ingestion (Browser Events or Test Simulation) ---

  public simulateKeyDown(key: string): void {
    if (!this.keysDown.has(key)) {
      this.keysPressedThisFrame.add(key);
    }
    this.keysDown.add(key);
  }

  public simulasikanTekanTombol(kunci: string): void {
    this.simulateKeyDown(kunci);
  }

  public simulateKeyUp(key: string): void {
    this.keysDown.delete(key);
    this.keysReleasedThisFrame.add(key);
  }

  public simulasikanLepasTombol(kunci: string): void {
    this.simulateKeyUp(kunci);
  }

  public simulateMouseDown(button: MouseButton | number): void {
    if (!this.mouseButtonsDown.has(button)) {
      this.mouseButtonsPressedThisFrame.add(button);
    }
    this.mouseButtonsDown.add(button);
  }

  public simulasikanTekanMouse(tombol: number): void {
    this.simulateMouseDown(tombol);
  }

  public simulateMouseUp(button: MouseButton | number): void {
    this.mouseButtonsDown.delete(button);
    this.mouseButtonsReleasedThisFrame.add(button);
  }

  public simulasikanLepasMouse(tombol: number): void {
    this.simulateMouseUp(tombol);
  }

  public simulateMouseMove(x: number, y: number): void {
    this.mouseDelta = new Vector2(x - this.mousePosition.x, y - this.mousePosition.y);
    this.mousePosition = new Vector2(x, y);
  }

  public simulasikanGerakMouse(x: number, y: number): void {
    this.simulateMouseMove(x, y);
  }

  public endFrame(): void {
    this.keysPressedThisFrame.clear();
    this.keysReleasedThisFrame.clear();
    this.mouseButtonsPressedThisFrame.clear();
    this.mouseButtonsReleasedThisFrame.clear();
    this.mouseDelta = new Vector2(0, 0);
  }

  public akhirFrame(): void {
    this.endFrame();
  }

  public attachBrowserEvents(target: any = typeof window !== 'undefined' ? window : null): void {
    if (!target || typeof target.addEventListener !== 'function') return;

    target.addEventListener('keydown', (e: any) => {
      this.simulateKeyDown(e.key);
    });

    target.addEventListener('keyup', (e: any) => {
      this.simulateKeyUp(e.key);
    });

    target.addEventListener('mousedown', (e: any) => {
      this.simulateMouseDown(e.button);
    });

    target.addEventListener('mouseup', (e: any) => {
      this.simulateMouseUp(e.button);
    });

    target.addEventListener('mousemove', (e: any) => {
      this.simulateMouseMove(e.clientX, e.clientY);
    });
  }
}
