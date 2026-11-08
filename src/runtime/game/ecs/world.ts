/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA GAME SDK - ECS World & Sistem Query
 * Target Milestone: Phase 47 (v0.47.0)
 */

import { Component, ComponentConstructor, Transform2D, Sprite } from './component';
import { Entity } from './entity';

export type SystemFn = (dt: number, world: World) => void;

export interface RegisteredSystem {
  name: string;
  fn: SystemFn;
  priority: number;
  enabled: boolean;
}

export class World {
  private nextEntityId = 1;
  private entities: Map<any, Entity> = new Map();
  private systems: RegisteredSystem[] = [];

  public createEntity(name?: string, tag?: string): Entity {
    const id = this.nextEntityId++;
    const entity = new Entity(id, name, tag);
    this.entities.set(id, entity);
    return entity;
  }

  public buatEntitas(nama?: string, tag?: string): Entity {
    return this.createEntity(nama, tag);
  }

  public getEntity(id: any): Entity | undefined {
    return this.entities.get(id);
  }

  public dapatkanEntitas(id: any): Entity | undefined {
    return this.getEntity(id);
  }

  public findEntityByName(name: string): Entity | undefined {
    for (const entity of this.entities.values()) {
      if (entity.name === name) return entity;
    }
    return undefined;
  }

  public destroyEntity(id: any): boolean {
    const entity = this.entities.get(id);
    if (!entity) return false;

    // Remove from parent
    if (entity.parent) {
      entity.parent.removeChild(entity);
    }

    // Destroy children
    for (const child of Array.from(entity.children)) {
      this.destroyEntity(child.id);
    }

    return this.entities.delete(id);
  }

  public hapusEntitas(id: any): boolean {
    return this.destroyEntity(id);
  }

  public get entityCount(): number {
    return this.entities.size;
  }

  public get jumlahEntitas(): number {
    return this.entities.size;
  }

  public dapatkanJumlahEntitas(): number {
    return this.entities.size;
  }

  public getAllEntities(): Entity[] {
    return Array.from(this.entities.values());
  }

  public query(components: ComponentConstructor[]): Entity[] {
    const result: Entity[] = [];
    for (const entity of this.entities.values()) {
      if (!entity.active) continue;
      let matches = true;
      for (const ctor of components) {
        if (!entity.hasComponent(ctor)) {
          matches = false;
          break;
        }
      }
      if (matches) {
        result.push(entity);
      }
    }
    return result;
  }

  public cari(komponen: ComponentConstructor[]): Entity[] {
    return this.query(komponen);
  }

  public findByTag(tag: string): Entity[] {
    const result: Entity[] = [];
    for (const entity of this.entities.values()) {
      if (entity.active && entity.tag === tag) {
        result.push(entity);
      }
    }
    return result;
  }

  public registerSystem(name: string, fn: SystemFn, priority: number = 0): void {
    this.systems.push({ name, fn, priority, enabled: true });
    this.systems.sort((a, b) => b.priority - a.priority);
  }

  public daftarkanSistem(nama: string, fn: SystemFn, prioritas: number = 0): void {
    this.registerSystem(nama, fn, prioritas);
  }

  public update(dt: number): void {
    for (const sys of this.systems) {
      if (sys.enabled) {
        try {
          sys.fn(dt, this);
        } catch (err) {
          console.error(`Galat pada eksekusi sistem ECS '${sys.name}':`, err);
        }
      }
    }
  }

  public clear(): void {
    this.entities.clear();
    this.nextEntityId = 1;
  }

  public serialize(): any {
    const serializedEntities: any[] = [];
    for (const entity of this.entities.values()) {
      const componentsData: any[] = [];
      for (const [ctor, comp] of (entity as any).components.entries()) {
        componentsData.push({
          type: (ctor as any).name,
          data: { ...comp },
        });
      }
      serializedEntities.push({
        id: entity.id,
        name: entity.name,
        tag: entity.tag,
        active: entity.active,
        parentId: entity.parent ? entity.parent.id : null,
        components: componentsData,
      });
    }
    return {
      version: '1.0',
      entities: serializedEntities,
    };
  }

  public deserialize(data: any): void {
    this.clear();
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    if (!parsed || !Array.isArray(parsed.entities)) return;
    for (const edata of parsed.entities) {
      const e = this.createEntity(edata.name, edata.tag);
      e.active = edata.active !== undefined ? edata.active : true;
      if (Array.isArray(edata.components)) {
        for (const cdata of edata.components) {
          if (cdata.type === 'Transform2D' && cdata.data) {
            const posX = cdata.data.position?.x !== undefined ? cdata.data.position.x : (cdata.data.x ?? 0);
            const posY = cdata.data.position?.y !== undefined ? cdata.data.position.y : (cdata.data.y ?? 0);
            const rot = cdata.data.rotation ?? 0;
            e.addComponent(new Transform2D(posX, posY, rot));
          } else if (cdata.type === 'Sprite' && cdata.data) {
            e.addComponent(new Sprite(cdata.data.textureId ?? 'tex_default', cdata.data.size?.x ?? 32, cdata.data.size?.y ?? 32));
          }
        }
      }
    }
  }
}
