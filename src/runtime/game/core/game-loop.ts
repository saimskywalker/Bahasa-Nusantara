/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA GAME SDK - Game Loop & Penjadwalan Frame
 * Target Milestone: Phase 47 (v0.47.0)
 */

import { Time } from './time';

export interface GameLoopCallbacks {
  onUpdate: (dt: number) => void;
  onFixedUpdate?: (fixedDt: number) => void;
  onRender?: (alpha?: number) => void;
}

export interface GameLoopOptions {
  targetFps?: number;
  fixedTimestep?: number;
  maxFrameTime?: number;
  time?: Time;
}

export class GameLoop {
  private isRunning = false;
  private lastTime = 0;
  private physicsAccumulator = 0;
  private animationFrameId: any = null;
  private targetFps = 60;
  private fixedTimestep = 0.02; // 50 Hz
  private maxFrameTime = 0.25;
  private _lastFrameTimeMs = 0;
  private callbacks: GameLoopCallbacks;

  constructor(
    arg1: GameLoopCallbacks | GameLoopOptions,
    arg2?: GameLoopCallbacks | GameLoopOptions
  ) {
    let callbacks: GameLoopCallbacks;
    let options: GameLoopOptions = {};

    if (arg1 && typeof (arg1 as any).onUpdate === 'function') {
      callbacks = arg1 as GameLoopCallbacks;
      options = (arg2 as GameLoopOptions) || {};
    } else if (arg2 && typeof (arg2 as any).onUpdate === 'function') {
      callbacks = arg2 as GameLoopCallbacks;
      options = (arg1 as GameLoopOptions) || {};
    } else {
      callbacks = { onUpdate: () => {} };
      options = (arg1 as GameLoopOptions) || {};
    }

    this.callbacks = callbacks;

    if (options.targetFps && options.targetFps > 0) this.targetFps = options.targetFps;
    if (options.fixedTimestep && options.fixedTimestep > 0) {
      this.fixedTimestep = options.fixedTimestep;
      Time.fixedDeltaTime = options.fixedTimestep;
    }
    if (options.maxFrameTime) this.maxFrameTime = options.maxFrameTime;
  }

  public get running(): boolean {
    return this.isRunning;
  }

  public get lastFrameTimeMs(): number {
    return this._lastFrameTimeMs;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = this.getCurrentTimeSeconds();
    this.physicsAccumulator = 0;

    const tick = () => {
      if (!this.isRunning) return;
      const now = this.getCurrentTimeSeconds();
      const rawDelta = Math.min(now - this.lastTime, this.maxFrameTime);
      this.lastTime = now;

      this.step(rawDelta);

      if (typeof requestAnimationFrame !== 'undefined') {
        this.animationFrameId = requestAnimationFrame(tick);
      } else {
        const frameIntervalMs = Math.max(1, Math.floor(1000 / this.targetFps));
        this.animationFrameId = setTimeout(tick, frameIntervalMs);
      }
    };

    if (typeof requestAnimationFrame !== 'undefined') {
      this.animationFrameId = requestAnimationFrame(tick);
    } else {
      this.animationFrameId = setTimeout(tick, Math.floor(1000 / this.targetFps));
    }
  }

  public pause(): void {
    this.stop();
  }

  public resume(): void {
    this.start();
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      if (typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(this.animationFrameId);
      } else {
        clearTimeout(this.animationFrameId);
      }
      this.animationFrameId = null;
    }
  }

  public step(deltaSeconds: number): void {
    const startMs = Date.now();
    Time.update(deltaSeconds);

    // 1. Fixed Timestep Physics Update
    this.physicsAccumulator += Time.deltaTime;
    const maxSubSteps = 10;
    let subSteps = 0;
    while (this.physicsAccumulator >= this.fixedTimestep && subSteps < maxSubSteps) {
      if (this.callbacks.onFixedUpdate) {
        this.callbacks.onFixedUpdate(this.fixedTimestep);
      }
      this.physicsAccumulator -= this.fixedTimestep;
      subSteps++;
    }

    // 2. Variable Update
    this.callbacks.onUpdate(Time.deltaTime);

    // 3. Render
    if (this.callbacks.onRender) {
      const alpha = this.physicsAccumulator / this.fixedTimestep;
      this.callbacks.onRender(alpha);
    }

    this._lastFrameTimeMs = Date.now() - startMs;
  }

  private getCurrentTimeSeconds(): number {
    if (typeof performance !== 'undefined' && performance.now) {
      return performance.now() / 1000;
    }
    return Date.now() / 1000;
  }
}
