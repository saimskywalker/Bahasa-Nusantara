/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA GAME SDK - Entitas ECS & Hirarki
 * Target Milestone: Phase 47 (v0.47.0)
 */

import { Component, ComponentConstructor } from './component';

export class Entity {
  private static _nextAutoId: number = 1;
  public readonly id: number;
  public name: string;
  public tag: string;
  public active: boolean = true;
  public parent: Entity | null = null;
  public children: Entity[] = [];
  public components: Map<Function, Component> = new Map();

  constructor(
    idOrName?: number | string,
    name?: string,
    tag: string = 'Default'
  ) {
    if (typeof idOrName === 'string') {
      this.id = Entity._nextAutoId++;
      this.name = idOrName;
      this.tag = name ?? tag;
    } else if (typeof idOrName === 'number') {
      this.id = idOrName;
      this.name = name ?? `Entitas_${idOrName}`;
      this.tag = tag;
    } else {
      this.id = Entity._nextAutoId++;
      this.name = name ?? `Entitas_${this.id}`;
      this.tag = tag;
    }
  }

  public getAllComponents(): Component[] {
    return Array.from(this.components.values());
  }

  public dapatkanSemuaKomponen(): Component[] {
    return this.getAllComponents();
  }

  public addComponent<T extends Component>(component: T): T {
    component.entityId = this.id;
    this.components.set(component.constructor, component);
    return component;
  }

  public tambahKomponen<T extends Component>(komponen: T): T {
    return this.addComponent(komponen);
  }

  public getComponent<T extends Component>(ctor: ComponentConstructor<T>): T | undefined {
    return this.components.get(ctor) as T | undefined;
  }

  public dapatkanKomponen<T extends Component>(ctor: ComponentConstructor<T>): T | undefined {
    return this.getComponent(ctor);
  }

  public hasComponent(ctor: ComponentConstructor): boolean {
    return this.components.has(ctor);
  }

  public memilikiKomponen(ctor: ComponentConstructor): boolean {
    return this.hasComponent(ctor);
  }

  public removeComponent(ctor: ComponentConstructor): boolean {
    return this.components.delete(ctor);
  }

  public hapusKomponen(ctor: ComponentConstructor): boolean {
    return this.removeComponent(ctor);
  }

  public addChild(child: Entity): void {
    if (child.parent) {
      child.parent.removeChild(child);
    }
    child.parent = this;
    this.children.push(child);
  }

  public removeChild(child: Entity): void {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parent = null;
    }
  }
}
