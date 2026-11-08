/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA GAME SDK - Manajemen Waktu & Delta Time
 * Target Milestone: Phase 47 (v0.47.0)
 */

export class Time {
  private static _deltaTime = 0;
  private static _unscaledDeltaTime = 0;
  private static _fixedDeltaTime = 0.02; // 50 Hz default
  private static _timeScale = 1.0;
  private static _totalTime = 0;
  private static _frameCount = 0;
  private static _fps = 0;

  public static get deltaTime(): number {
    return this._deltaTime;
  }

  public static get unscaledDeltaTime(): number {
    return this._unscaledDeltaTime;
  }

  public static get fixedDeltaTime(): number {
    return this._fixedDeltaTime;
  }

  public static set fixedDeltaTime(val: number) {
    if (val > 0) this._fixedDeltaTime = val;
  }

  public static get timeScale(): number {
    return this._timeScale;
  }

  public static set timeScale(val: number) {
    this._timeScale = Math.max(0, val);
  }

  public static get totalTime(): number {
    return this._totalTime;
  }

  public static get frameCount(): number {
    return this._frameCount;
  }

  public static get fps(): number {
    return this._fps;
  }

  public static update(rawDeltaSeconds: number): void {
    this._unscaledDeltaTime = Math.min(rawDeltaSeconds, 0.25); // cap at 250ms
    this._deltaTime = this._unscaledDeltaTime * this._timeScale;
    this._totalTime += this._deltaTime;
    this._frameCount++;
    if (this._unscaledDeltaTime > 0) {
      this._fps = Math.round(1 / this._unscaledDeltaTime);
    }
  }

  public static reset(): void {
    this._deltaTime = 0;
    this._unscaledDeltaTime = 0;
    this._fixedDeltaTime = 0.02;
    this._timeScale = 1.0;
    this._totalTime = 0;
    this._frameCount = 0;
    this._fps = 0;
  }

  // Instance proxies for object usage (e.g. const t = new Time(); t.update(0.016))
  public get deltaTime(): number {
    return Time.deltaTime;
  }
  public get unscaledDeltaTime(): number {
    return Time.unscaledDeltaTime;
  }
  public get fixedDeltaTime(): number {
    return Time.fixedDeltaTime;
  }
  public set fixedDeltaTime(val: number) {
    Time.fixedDeltaTime = val;
  }
  public get timeScale(): number {
    return Time.timeScale;
  }
  public set timeScale(val: number) {
    Time.timeScale = val;
  }
  public get totalTime(): number {
    return Time.totalTime;
  }
  public get frameCount(): number {
    return Time.frameCount;
  }
  public get fps(): number {
    return Time.fps;
  }
  public update(rawDeltaSeconds: number): void {
    Time.update(rawDeltaSeconds);
  }
  public reset(): void {
    Time.reset();
  }
}
