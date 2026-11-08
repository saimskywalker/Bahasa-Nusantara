/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Vector2, Color } from '../types';
import { IRenderer } from '../graphics/renderer';

export interface Particle {
  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  color: Color;
  startColor: Color;
  endColor: Color;
  size: number;
  startSize: number;
  endSize: number;
  life: number;
  maxLife: number;
  rotation: number;
  angularVelocity: number;
  alpha: number;
}

export interface EmitterConfig {
  rate: number; // Partikel per detik
  maxParticles: number;
  lifetimeMin: number;
  lifetimeMax: number;
  speedMin: number;
  speedMax: number;
  angleMin: number; // dalam radian
  angleMax: number;
  sizeMin: number;
  sizeMax: number;
  endSizeMultiplier: number;
  startColor: Color;
  endColor: Color;
  gravity: Vector2;
  position: Vector2;
  autoEmit: boolean;
}

export class ParticleEmitter2D {
  public config: EmitterConfig;
  public particles: Particle[] = [];
  private emitAccumulator: number = 0;
  public isActive: boolean = true;

  constructor(config?: Partial<EmitterConfig>) {
    this.config = {
      rate: 30,
      maxParticles: 200,
      lifetimeMin: 0.5,
      lifetimeMax: 1.5,
      speedMin: 20,
      speedMax: 80,
      angleMin: 0,
      angleMax: Math.PI * 2,
      sizeMin: 4,
      sizeMax: 8,
      endSizeMultiplier: 0.2,
      startColor: new Color(1, 0.8, 0.2, 1),
      endColor: new Color(1, 0.2, 0, 0),
      gravity: new Vector2(0, 50),
      position: new Vector2(0, 0),
      autoEmit: true,
      ...config,
    };
  }

  public setPosition(x: number, y: number): void {
    this.config.position.x = x;
    this.config.position.y = y;
  }

  public emit(count: number = 1): void {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.config.maxParticles) {
        break;
      }
      this.spawnParticle();
    }
  }

  public burst(count: number): void {
    this.emit(count);
  }

  private spawnParticle(): void {
    const angle = this.config.angleMin + Math.random() * (this.config.angleMax - this.config.angleMin);
    const speed = this.config.speedMin + Math.random() * (this.config.speedMax - this.config.speedMin);
    const life = this.config.lifetimeMin + Math.random() * (this.config.lifetimeMax - this.config.lifetimeMin);
    const size = this.config.sizeMin + Math.random() * (this.config.sizeMax - this.config.sizeMin);

    const velocity = new Vector2(Math.cos(angle) * speed, Math.sin(angle) * speed);

    const particle: Particle = {
      position: this.config.position.clone(),
      velocity,
      acceleration: this.config.gravity.clone(),
      color: this.config.startColor.clone(),
      startColor: this.config.startColor.clone(),
      endColor: this.config.endColor.clone(),
      size,
      startSize: size,
      endSize: size * this.config.endSizeMultiplier,
      life,
      maxLife: life,
      rotation: Math.random() * Math.PI * 2,
      angularVelocity: (Math.random() - 0.5) * 4,
      alpha: this.config.startColor.a,
    };

    this.particles.push(particle);
  }

  public update(dt: number): void {
    if (this.isActive && this.config.autoEmit && this.config.rate > 0) {
      this.emitAccumulator += dt;
      const interval = 1 / this.config.rate;
      while (this.emitAccumulator >= interval) {
        this.emit(1);
        this.emitAccumulator -= interval;
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      // Integrasi gerak
      p.velocity.x += p.acceleration.x * dt;
      p.velocity.y += p.acceleration.y * dt;
      p.position.x += p.velocity.x * dt;
      p.position.y += p.velocity.y * dt;
      p.rotation += p.angularVelocity * dt;

      // Interpolasi ukuran dan warna (t: 0 -> 1)
      const t = 1 - p.life / p.maxLife;
      p.size = p.startSize + (p.endSize - p.startSize) * t;

      p.color.r = p.startColor.r + (p.endColor.r - p.startColor.r) * t;
      p.color.g = p.startColor.g + (p.endColor.g - p.startColor.g) * t;
      p.color.b = p.startColor.b + (p.endColor.b - p.startColor.b) * t;
      p.color.a = p.startColor.a + (p.endColor.a - p.startColor.a) * t;
      p.alpha = p.color.a;
    }
  }

  public draw(renderer: IRenderer): void {
    for (const p of this.particles) {
      const half = p.size / 2;
      renderer.drawRect(p.position.x - half, p.position.y - half, p.size, p.size, p.color);
    }
  }

  public reset(): void {
    this.particles = [];
    this.emitAccumulator = 0;
  }

  public getActiveCount(): number {
    return this.particles.length;
  }
}
