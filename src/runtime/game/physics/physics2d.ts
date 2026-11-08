/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA GAME SDK - Mesin Fisika & Deteksi Tabrakan 2D
 * Target Milestone: Phase 47 (v0.47.0)
 */

import { BoxCollider2D, CircleCollider2D, RigidBody2D, Transform2D } from '../ecs/component';
import { Entity } from '../ecs/entity';
import { World } from '../ecs/world';
import { Vector2 } from '../types';

export interface Collision2D {
  entityA: Entity;
  entityB: Entity;
  normal: Vector2;
  penetration: number;
}

export interface RaycastHit2D {
  entity: Entity;
  point: Vector2;
  normal: Vector2;
  distance: number;
}

export class PhysicsWorld2D {
  public gravity: Vector2 = new Vector2(0, 980); // pixels per sec^2
  public iterations: number = 4;
  private internalWorld: World = new World();

  constructor(gravity?: Vector2) {
    if (gravity) {
      this.gravity = gravity.salin();
    }
  }

  public addBody(rb: RigidBody2D, col: BoxCollider2D | CircleCollider2D, transform: Transform2D): Entity {
    const e = this.internalWorld.createEntity();
    e.addComponent(transform);
    e.addComponent(rb);
    e.addComponent(col);
    return e;
  }

  public getBodyCount(): number {
    return this.internalWorld.dapatkanJumlahEntitas();
  }

  public step(dt: number, world?: World): Collision2D[] {
    const targetWorld = world || this.internalWorld;
    const bodies = targetWorld.query([Transform2D, RigidBody2D]);

    // 1. Integrasi Kecepatan & Gravitasi
    for (const entity of bodies) {
      const transform = entity.getComponent(Transform2D)!;
      const rb = entity.getComponent(RigidBody2D)!;

      if (!rb.isStatic) {
        // v = v + (g * scale + a) * dt
        rb.velocity.x += (this.gravity.x * rb.gravityScale + rb.acceleration.x) * dt;
        rb.velocity.y += (this.gravity.y * rb.gravityScale + rb.acceleration.y) * dt;

        // p = p + v * dt
        transform.position.x += rb.velocity.x * dt;
        transform.position.y += rb.velocity.y * dt;
      }
    }

    // 2. Deteksi & Resolusi Tabrakan
    const collisions: Collision2D[] = [];
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const entA = bodies[i];
        const entB = bodies[j];
        const col = this.checkCollision(entA, entB);
        if (col) {
          collisions.push(col);
          this.resolveCollision(col);
        }
      }
    }

    return collisions;
  }

  public checkCollision(entA: Entity, entB: Entity): Collision2D | null {
    const tA = entA.getComponent(Transform2D)!;
    const tB = entB.getComponent(Transform2D)!;
    const boxA = entA.getComponent(BoxCollider2D);
    const boxB = entB.getComponent(BoxCollider2D);
    const circA = entA.getComponent(CircleCollider2D);
    const circB = entB.getComponent(CircleCollider2D);

    // Box vs Box
    if (boxA && boxB) {
      const posA = tA.position.tambah(boxA.offset);
      const posB = tB.position.tambah(boxB.offset);
      const halfWA = boxA.size.x / 2;
      const halfHA = boxA.size.y / 2;
      const halfWB = boxB.size.x / 2;
      const halfHB = boxB.size.y / 2;

      const dx = posB.x - posA.x;
      const px = halfWA + halfWB - Math.abs(dx);
      if (px <= 0) return null;

      const dy = posB.y - posA.y;
      const py = halfHA + halfHB - Math.abs(dy);
      if (py <= 0) return null;

      let normal = new Vector2(0, 0);
      let penetration = 0;

      // Normal points from A to B
      if (px < py) {
        normal = new Vector2(dx < 0 ? -1 : 1, 0);
        penetration = px;
      } else {
        normal = new Vector2(0, dy < 0 ? -1 : 1);
        penetration = py;
      }

      return { entityA: entA, entityB: entB, normal, penetration };
    }

    // Circle vs Circle
    if (circA && circB) {
      const posA = tA.position.tambah(circA.offset);
      const posB = tB.position.tambah(circB.offset);
      const delta = posB.kurang(posA);
      const dist = delta.panjang();
      const radiusSum = circA.radius + circB.radius;

      if (dist < radiusSum) {
        const penetration = radiusSum - dist;
        const normal = dist > 0 ? delta.normalisasi() : new Vector2(0, 1);
        return { entityA: entA, entityB: entB, normal, penetration };
      }
    }

    return null;
  }

  public resolveCollision(col: Collision2D): void {
    const rbA = col.entityA.getComponent(RigidBody2D);
    const rbB = col.entityB.getComponent(RigidBody2D);
    const tA = col.entityA.getComponent(Transform2D)!;
    const tB = col.entityB.getComponent(Transform2D)!;

    if (!rbA || !rbB) return;

    const invMassA = rbA.isStatic ? 0 : 1 / rbA.mass;
    const invMassB = rbB.isStatic ? 0 : 1 / rbB.mass;
    const totalInvMass = invMassA + invMassB;
    if (totalInvMass === 0) return;

    // Positional separation (normal points from A to B)
    const percent = 1.0;
    const correction = col.normal.kali((col.penetration * percent) / totalInvMass);

    if (!rbA.isStatic) {
      tA.position = tA.position.kurang(correction.kali(invMassA));
    }
    if (!rbB.isStatic) {
      tB.position = tB.position.tambah(correction.kali(invMassB));
    }

    // Velocity impulse
    const rv = rbB.velocity.kurang(rbA.velocity);
    const velAlongNormal = rv.titik(col.normal);
    if (velAlongNormal > 0) return; // moving away

    const e = Math.min(rbA.restitution, rbB.restitution);
    const j = -(1 + e) * velAlongNormal / totalInvMass;
    const impulse = col.normal.kali(j);

    if (!rbA.isStatic) {
      rbA.velocity = rbA.velocity.kurang(impulse.kali(invMassA));
    }
    if (!rbB.isStatic) {
      rbB.velocity = rbB.velocity.tambah(impulse.kali(invMassB));
    }
  }

  public raycast(origin: Vector2, direction: Vector2, maxDistance: number, world?: World): RaycastHit2D | null {
    const targetWorld = world || this.internalWorld;
    const dirNorm = direction.normalisasi();
    const entities = targetWorld.query([Transform2D, BoxCollider2D]);
    let closestHit: RaycastHit2D | null = null;
    let closestDist = maxDistance;

    for (const ent of entities) {
      const t = ent.getComponent(Transform2D)!;
      const col = ent.getComponent(BoxCollider2D)!;
      const center = t.position.tambah(col.offset);
      const halfW = col.size.x / 2;
      const halfH = col.size.y / 2;

      // Slab test
      const minX = center.x - halfW;
      const maxX = center.x + halfW;
      const minY = center.y - halfH;
      const maxY = center.y + halfH;

      let tmin = (minX - origin.x) / (dirNorm.x || 1e-8);
      let tmax = (maxX - origin.x) / (dirNorm.x || 1e-8);
      if (tmin > tmax) [tmin, tmax] = [tmax, tmin];

      let tymin = (minY - origin.y) / (dirNorm.y || 1e-8);
      let tymax = (maxY - origin.y) / (dirNorm.y || 1e-8);
      if (tymin > tymax) [tymin, tymax] = [tymax, tymin];

      if (tmin > tymax || tymin > tmax) continue;

      const hitDist = Math.max(tmin, tymin);
      if (hitDist >= 0 && hitDist < closestDist) {
        closestDist = hitDist;
        closestHit = {
          entity: ent,
          point: origin.tambah(dirNorm.kali(hitDist)),
          normal: dirNorm.kali(-1),
          distance: hitDist,
        };
      }
    }

    return closestHit;
  }
}
