/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameLoop } from './game-loop';
import { Time } from './time';
import { GameEventBus } from './event-system';
import { Canvas2DRenderer } from '../graphics/canvas2d-renderer';
import { SceneManager, Scene } from '../ecs/scene';
import { InputManager } from '../input/input-manager';
import { AudioManager } from '../audio/audio-manager';
import { AssetManager } from '../assets/asset-manager';
import { SaveManager } from '../save/save-manager';
import { GameUI } from '../ui/game-ui';
import { PhysicsWorld2D } from '../physics/physics2d';
import { Color } from '../types';

export interface GameAppConfig {
  title: string;
  width: number;
  height: number;
  targetFps: number;
  fixedTimestep: number;
  canvasId?: string;
  backgroundColor: Color;
  debug: boolean;
}

export class GameApp {
  public config: GameAppConfig;
  public time: Time;
  public eventBus: GameEventBus;
  public renderer: Canvas2DRenderer;
  public sceneManager: SceneManager;
  public input: InputManager;
  public audio: AudioManager;
  public assets: AssetManager;
  public save: SaveManager;
  public ui: GameUI;
  public physics: PhysicsWorld2D;
  public loop: GameLoop;
  public isRunning: boolean = false;

  constructor(config?: Partial<GameAppConfig>) {
    this.config = {
      title: 'Aplikasi Game Nusantara',
      width: 800,
      height: 600,
      targetFps: 60,
      fixedTimestep: 1 / 60,
      backgroundColor: new Color(0.1, 0.1, 0.12, 1),
      debug: false,
      ...config,
    };

    this.time = new Time();
    this.eventBus = new GameEventBus();
    this.renderer = new Canvas2DRenderer(this.config.width, this.config.height);
    this.sceneManager = new SceneManager();
    this.input = new InputManager();
    this.audio = new AudioManager();
    this.assets = new AssetManager({}, undefined, this.audio);
    this.save = new SaveManager();
    this.ui = new GameUI();
    this.physics = new PhysicsWorld2D();

    // Inisialisasi loop
    this.loop = new GameLoop(
      {
        targetFps: this.config.targetFps,
        fixedTimestep: this.config.fixedTimestep,
        time: this.time,
      },
      {
        onUpdate: (dt) => this.onUpdate(dt),
        onFixedUpdate: (fdt) => this.onFixedUpdate(fdt),
        onRender: (alpha) => this.onRender(alpha ?? 1.0),
      }
    );
  }

  public init(): void {
    this.eventBus.emit('game:init', { title: this.config.title });
  }

  public start(): void {
    if (this.isRunning) return;
    this.init();
    this.isRunning = true;
    this.eventBus.emit('game:start');
    this.loop.start();
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.loop.stop();
    this.isRunning = false;
    this.audio.stopAll();
    this.eventBus.emit('game:stop');
  }

  public pause(): void {
    this.loop.pause();
    this.eventBus.emit('game:pause');
  }

  public resume(): void {
    this.loop.resume();
    this.eventBus.emit('game:resume');
  }

  public addScene(scene: Scene): void {
    this.sceneManager.daftarAdegan(scene);
  }

  public switchScene(name: string): void {
    this.sceneManager.gantiAdegan(name);
  }

  /**
   * Pembaruan logika variabel per frame
   */
  public onUpdate(dt: number): void {
    // Proses input UI
    this.ui.processInput(this.input);
    this.ui.update(dt);

    // Perbarui adegan aktif
    this.sceneManager.perbarui(dt);

    // Bersihkan penanda tombol baru ditekan/dilepas untuk frame selanjutnya
    this.input.akhirFrame();
  }

  /**
   * Pembaruan fisika sub-step tetap
   */
  public onFixedUpdate(fdt: number): void {
    this.physics.step(fdt);
  }

  /**
   * Penggambaran frame
   */
  public onRender(_alpha: number): void {
    this.renderer.clear(this.config.backgroundColor);

    // Gambar adegan aktif
    this.sceneManager.gambar(this.renderer);

    // Gambar UI di lapisan atas
    this.ui.draw(this.renderer);

    this.renderer.flush();
  }

  /**
   * Eksekusi satu langkah simulasi deterministik (cocok untuk pengujian & CLI)
   */
  public step(deltaSeconds: number = 1 / 60): void {
    this.loop.step(deltaSeconds);
  }
}
