/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA GAME SDK - Sistem Scene & Scene Manager
 * Target Milestone: Phase 47 (v0.47.0)
 */

import { World } from './world';

export abstract class Scene {
  public readonly world: World = new World();
  public isLoaded: boolean = false;

  constructor(public readonly name: string) {}

  public get nama(): string {
    return this.name;
  }

  public get dunia(): World {
    return this.world;
  }

  public saatMulai(): void {}
  public perbarui(dt: number): void {
    this.world.update(dt);
  }
  public gambar(_renderer?: any): void {}
  public saatBerhenti(): void {
    this.world.clear();
  }
}

export class DefaultScene extends Scene {
  constructor(name: string = 'SceneUtama') {
    super(name);
  }
}

export class SceneManager {
  private scenes: Map<string, Scene> = new Map();
  private currentScene: Scene | null = null;

  public registerScene(scene: Scene): void {
    this.scenes.set(scene.name, scene);
  }

  public daftarkanScene(scene: Scene): void {
    this.registerScene(scene);
  }

  public daftarAdegan(scene: Scene): void {
    this.registerScene(scene);
  }

  public loadScene(name: string): Scene {
    const nextScene = this.scenes.get(name);
    if (!nextScene) {
      throw new Error(`Scene '${name}' tidak ditemukan di SceneManager`);
    }

    if (this.currentScene) {
      this.currentScene.saatBerhenti();
      this.currentScene.isLoaded = false;
    }

    this.currentScene = nextScene;
    this.currentScene.isLoaded = true;
    this.currentScene.saatMulai();
    return this.currentScene;
  }

  public muatScene(name: string): Scene {
    return this.loadScene(name);
  }

  public gantiAdegan(name: string): Scene {
    return this.loadScene(name);
  }

  public get activeScene(): Scene | null {
    return this.currentScene;
  }

  public get sceneAktif(): Scene | null {
    return this.currentScene;
  }

  public get adeganAktif(): Scene | null {
    return this.currentScene;
  }

  public update(dt: number): void {
    if (this.currentScene) {
      this.currentScene.perbarui(dt);
    }
  }

  public perbarui(dt: number): void {
    this.update(dt);
  }

  public render(renderer?: any): void {
    if (this.currentScene) {
      this.currentScene.gambar(renderer);
    }
  }

  public gambar(renderer?: any): void {
    this.render(renderer);
  }
}
