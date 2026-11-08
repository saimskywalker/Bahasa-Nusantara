/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA GAME SDK - Mesin Tata Suara & Audio (Audio Engine)
 * Target Milestone: Phase 47 (v0.47.0)
 */

export enum AudioCategory {
  MASTER = 'master',
  MUSIC = 'music',
  SFX = 'sfx',
}

export interface AudioClip {
  id: string;
  name?: string;
  path?: string;
  duration?: number;
  durationSeconds?: number;
  format?: 'wav' | 'ogg' | 'mp3' | string;
  isLoaded?: boolean;
  data?: any;
}

export interface ActiveSoundInstance {
  instanceId: number;
  clipId: string;
  category: AudioCategory | string;
  volume: number;
  loop: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  elapsedTime: number;
}

export class AudioManager {
  private clips: Map<string, AudioClip> = new Map();
  private activeInstances: Map<number, ActiveSoundInstance> = new Map();
  private nextInstanceId = 1;

  public masterVolume = 1.0;
  public musicVolume = 1.0;
  public sfxVolume = 1.0;

  public registerClip(clip: AudioClip): void {
    this.clips.set(clip.id, clip);
  }

  public daftarkanKlip(clip: AudioClip): void {
    this.registerClip(clip);
  }

  public hasClip(clipId: string): boolean {
    return this.clips.has(clipId);
  }

  public play(
    clipId: string,
    optionsOrVolume: number | { volume?: number; loop?: boolean; category?: AudioCategory | string } = 1.0,
    loop: boolean = false,
    category: AudioCategory | string = AudioCategory.SFX
  ): number {
    let vol = 1.0;
    let isLoop = loop;
    let cat = category;

    if (typeof optionsOrVolume === 'object' && optionsOrVolume !== null) {
      if (optionsOrVolume.volume !== undefined) vol = optionsOrVolume.volume;
      if (optionsOrVolume.loop !== undefined) isLoop = optionsOrVolume.loop;
      if (optionsOrVolume.category !== undefined) cat = optionsOrVolume.category;
    } else if (typeof optionsOrVolume === 'number') {
      vol = optionsOrVolume;
    }

    const instanceId = this.nextInstanceId++;

    const instance: ActiveSoundInstance = {
      instanceId,
      clipId,
      category: cat,
      volume: Math.max(0, Math.min(1, vol)),
      loop: isLoop,
      isPlaying: true,
      isPaused: false,
      elapsedTime: 0,
    };

    this.activeInstances.set(instanceId, instance);
    return instanceId;
  }

  public putar(clipId: string, volume: number = 1.0, loop: boolean = false): number {
    return this.play(clipId, volume, loop, AudioCategory.SFX);
  }

  public putarMusik(clipId: string, volume: number = 1.0, loop: boolean = true): number {
    return this.play(clipId, volume, loop, AudioCategory.MUSIC);
  }

  public stop(instanceId: number): void {
    const inst = this.activeInstances.get(instanceId);
    if (inst) {
      inst.isPlaying = false;
      this.activeInstances.delete(instanceId);
    }
  }

  public hentikan(instanceId: number): void {
    this.stop(instanceId);
  }

  public pause(instanceId: number): void {
    const inst = this.activeInstances.get(instanceId);
    if (inst) {
      inst.isPaused = true;
      inst.isPlaying = false;
    }
  }

  public jeda(instanceId: number): void {
    this.pause(instanceId);
  }

  public resume(instanceId: number): void {
    const inst = this.activeInstances.get(instanceId);
    if (inst) {
      inst.isPaused = false;
      inst.isPlaying = true;
    }
  }

  public lanjutkan(instanceId: number): void {
    this.resume(instanceId);
  }

  public isPlaying(instanceId: number): boolean {
    const inst = this.activeInstances.get(instanceId);
    return !!inst && inst.isPlaying && !inst.isPaused;
  }

  public stopAll(): void {
    this.activeInstances.clear();
  }

  public hentikanSemua(): void {
    this.stopAll();
  }

  public getActiveInstanceCount(): number {
    return this.activeInstances.size;
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  public setMasterVolume(v: number): void {
    this.masterVolume = Math.max(0, Math.min(1, v));
  }

  public setMusicVolume(v: number): void {
    this.musicVolume = Math.max(0, Math.min(1, v));
  }

  public setSfxVolume(v: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, v));
  }

  public getEffectiveVolume(category: AudioCategory | string, volume: number = 1.0): number {
    const catVol = category === AudioCategory.MUSIC || category === 'music' ? this.musicVolume : this.sfxVolume;
    return this.masterVolume * catVol * volume;
  }
}
