/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA GAME SDK - Sistem Animasi Sprite 2D
 * Target Milestone: Phase 47 (v0.47.0)
 */

import { Rect } from '../types';

export interface AnimationKeyframe {
  rect: Rect;
  duration: number; // in seconds
}

export class AnimationClip {
  constructor(
    public readonly name: string,
    public keyframes: AnimationKeyframe[] = [],
    public loop: boolean = true
  ) {}

  public get frames(): AnimationKeyframe[] {
    return this.keyframes;
  }

  public get totalDuration(): number {
    return this.keyframes.reduce((acc, kf) => acc + kf.duration, 0);
  }

  public static fromSpriteSheet(
    name: string,
    frameWidth: number,
    frameHeight: number,
    frameCount: number,
    fps: number = 10,
    loop: boolean = true
  ): AnimationClip {
    const durationPerFrame = 1 / Math.max(1, fps);
    const keyframes: AnimationKeyframe[] = [];

    for (let i = 0; i < frameCount; i++) {
      keyframes.push({
        rect: new Rect(i * frameWidth, 0, frameWidth, frameHeight),
        duration: durationPerFrame,
      });
    }

    return new AnimationClip(name, keyframes, loop);
  }
}

export class SpriteAnimationController {
  private clips: Map<string, AnimationClip> = new Map();
  private activeClip: AnimationClip | null = null;
  private currentFrameIndex: number = 0;
  private elapsedTimeInFrame: number = 0;
  public isPlaying: boolean = false;
  public speed: number = 1.0;
  public onComplete?: () => void;

  public static createFromSpritesheet(
    name: string,
    totalWidth: number,
    totalHeight: number,
    frameWidth: number,
    frameHeight: number,
    frameDuration: number = 0.1,
    loop: boolean = true
  ): AnimationClip {
    const cols = Math.floor(totalWidth / frameWidth);
    const rows = Math.floor(totalHeight / frameHeight);
    const keyframes: AnimationKeyframe[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        keyframes.push({
          rect: new Rect(c * frameWidth, r * frameHeight, frameWidth, frameHeight),
          duration: frameDuration,
        });
      }
    }

    return new AnimationClip(name, keyframes, loop);
  }

  public registerClip(clip: AnimationClip): void {
    this.clips.set(clip.name, clip);
  }

  public addClip(clip: AnimationClip): void {
    this.registerClip(clip);
  }

  public getCurrentFrameIndex(): number {
    return this.currentFrameIndex;
  }

  public play(name: string): void {
    const clip = this.clips.get(name);
    if (!clip) return;

    if (this.activeClip !== clip) {
      this.activeClip = clip;
      this.currentFrameIndex = 0;
      this.elapsedTimeInFrame = 0;
    }
    this.isPlaying = true;
  }

  public stop(): void {
    this.isPlaying = false;
    this.currentFrameIndex = 0;
    this.elapsedTimeInFrame = 0;
  }

  public pause(): void {
    this.isPlaying = false;
  }

  public update(dt: number): void {
    if (!this.isPlaying || !this.activeClip || this.activeClip.keyframes.length === 0) return;

    this.elapsedTimeInFrame += dt * this.speed;
    const currentKf = this.activeClip.keyframes[this.currentFrameIndex];

    while (this.elapsedTimeInFrame >= currentKf.duration) {
      this.elapsedTimeInFrame -= currentKf.duration;
      this.currentFrameIndex++;

      if (this.currentFrameIndex >= this.activeClip.keyframes.length) {
        if (this.activeClip.loop) {
          this.currentFrameIndex = 0;
        } else {
          this.currentFrameIndex = this.activeClip.keyframes.length - 1;
          this.isPlaying = false;
          if (this.onComplete) {
            this.onComplete();
          }
          break;
        }
      }
    }
  }

  public getCurrentRect(): Rect | undefined {
    if (!this.activeClip || this.activeClip.keyframes.length === 0) return undefined;
    return this.activeClip.keyframes[this.currentFrameIndex].rect;
  }
}
