/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FrameProfile {
  fps: number;
  frameTimeMs: number;
  updateTimeMs: number;
  renderTimeMs: number;
  physicsTimeMs: number;
  drawCalls: number;
  entitiesCount: number;
  timestamp: number;
}

export class GameProfiler {
  private history: FrameProfile[] = [];
  private maxHistory: number = 300;
  private currentFrame: Partial<FrameProfile> = {};

  public startFrame(): void {
    this.currentFrame = {
      timestamp: Date.now(),
      drawCalls: 0,
      entitiesCount: 0,
    };
  }

  public recordUpdate(timeMs: number): void {
    this.currentFrame.updateTimeMs = timeMs;
  }

  public recordRender(timeMs: number, drawCalls: number): void {
    this.currentFrame.renderTimeMs = timeMs;
    this.currentFrame.drawCalls = drawCalls;
  }

  public recordPhysics(timeMs: number): void {
    this.currentFrame.physicsTimeMs = timeMs;
  }

  public endFrame(fps: number, frameTimeMs: number, entitiesCount: number = 0): void {
    const fullFrame: FrameProfile = {
      fps,
      frameTimeMs,
      updateTimeMs: this.currentFrame.updateTimeMs || 0,
      renderTimeMs: this.currentFrame.renderTimeMs || 0,
      physicsTimeMs: this.currentFrame.physicsTimeMs || 0,
      drawCalls: this.currentFrame.drawCalls || 0,
      entitiesCount,
      timestamp: this.currentFrame.timestamp || Date.now(),
    };

    this.history.push(fullFrame);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  public getAverageFps(): number {
    if (this.history.length === 0) return 0;
    const sum = this.history.reduce((acc, f) => acc + f.fps, 0);
    return Math.round((sum / this.history.length) * 10) / 10;
  }

  public getAverageFrameTime(): number {
    if (this.history.length === 0) return 0;
    const sum = this.history.reduce((acc, f) => acc + f.frameTimeMs, 0);
    return Math.round((sum / this.history.length) * 100) / 100;
  }

  public getLatestFrame(): FrameProfile | null {
    if (this.history.length === 0) return null;
    return this.history[this.history.length - 1];
  }

  public getSummary(): string {
    const avgFps = this.getAverageFps();
    const avgTime = this.getAverageFrameTime();
    const latest = this.getLatestFrame();
    return `[GameProfiler] FPS Rata-rata: ${avgFps} | Waktu Frame: ${avgTime}ms | Panggilan Gambar Terakhir: ${latest?.drawCalls ?? 0} | Entitas: ${latest?.entitiesCount ?? 0}`;
  }

  public exportReport(): object {
    return {
      averageFps: this.getAverageFps(),
      averageFrameTimeMs: this.getAverageFrameTime(),
      totalFramesLogged: this.history.length,
      latestFrame: this.getLatestFrame(),
    };
  }

  public clear(): void {
    this.history = [];
    this.currentFrame = {};
  }
}
