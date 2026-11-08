/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA GAME SDK - Komponen ECS (Entity Component System)
 * Target Milestone: Phase 47 (v0.47.0)
 */

import { Color, Rect, Vector2, Vector3 } from '../types';
import { ActorRef } from '../../actor/actor-ref';

export abstract class Component {
  public enabled: boolean = true;
  public entityId: any = 0;
}

export type ComponentConstructor<T extends Component = Component> = new (...args: any[]) => T;

export class Transform2D extends Component {
  public position: Vector2;
  public rotation: number;
  public scale: Vector2;

  constructor(
    xOrPos: number | Vector2 = 0,
    yOrRot: number = 0,
    rotOrScale: number | Vector2 = 0,
    scale: Vector2 = new Vector2(1, 1)
  ) {
    super();
    if (xOrPos instanceof Vector2) {
      this.position = xOrPos;
      this.rotation = yOrRot;
      this.scale = rotOrScale instanceof Vector2 ? rotOrScale : scale;
    } else {
      this.position = new Vector2(xOrPos, yOrRot);
      this.rotation = typeof rotOrScale === 'number' ? rotOrScale : 0;
      this.scale = scale;
    }
  }

  public get x(): number {
    return this.position.x;
  }
  public set x(val: number) {
    this.position.x = val;
  }

  public get y(): number {
    return this.position.y;
  }
  public set y(val: number) {
    this.position.y = val;
  }
}

export class Transform3D extends Component {
  public position: Vector3;
  public rotation: Vector3;
  public scale: Vector3;

  constructor(
    pos: Vector3 = new Vector3(0, 0, 0),
    rot: Vector3 = new Vector3(0, 0, 0),
    scale: Vector3 = new Vector3(1, 1, 1)
  ) {
    super();
    this.position = pos;
    this.rotation = rot;
    this.scale = scale;
  }
}

export class Sprite extends Component {
  public textureId: string;
  public size: Vector2;
  public tint: Color;
  public sourceRect?: Rect;
  public flipX: boolean;
  public flipY: boolean;
  public zIndex: number;

  constructor(
    textureId: string = 'tex_default',
    widthOrSize: number | Vector2 = 32,
    heightOrTint: number | Color = 32,
    tint: Color = Color.white(),
    sourceRect?: Rect,
    flipX: boolean = false,
    flipY: boolean = false,
    zIndex: number = 0
  ) {
    super();
    this.textureId = textureId;
    if (widthOrSize instanceof Vector2) {
      this.size = widthOrSize;
      this.tint = (heightOrTint as Color) || Color.white();
    } else {
      const h = typeof heightOrTint === 'number' ? heightOrTint : 32;
      this.size = new Vector2(widthOrSize, h);
      this.tint = (tint as Color) || Color.white();
    }
    this.sourceRect = sourceRect;
    this.flipX = flipX;
    this.flipY = flipY;
    this.zIndex = zIndex;
  }

  public get width(): number {
    return this.size.x;
  }
  public set width(v: number) {
    this.size.x = v;
  }

  public get height(): number {
    return this.size.y;
  }
  public set height(v: number) {
    this.size.y = v;
  }
}

export class MeshRenderer extends Component {
  constructor(
    public meshId: string = 'cube_default',
    public materialId: string = 'mat_default',
    public castShadows: boolean = true
  ) {
    super();
  }
}

export class CameraComponent extends Component {
  constructor(
    public isPrimary: boolean = true,
    public zoom: number = 1.0,
    public backgroundColor: Color = Color.black()
  ) {
    super();
  }
}

export class RigidBody2D extends Component {
  constructor(
    public mass: number = 1.0,
    public restitution: number = 0.0,
    public isStatic: boolean = false,
    public gravityScale: number = 1.0,
    public velocity: Vector2 = new Vector2(0, 0),
    public acceleration: Vector2 = new Vector2(0, 0),
    public drag: number = 0.0
  ) {
    super();
    if (mass === 0) {
      this.isStatic = true;
    }
  }
}

export class RigidBody3D extends Component {
  constructor(
    public mass: number = 1.0,
    public isStatic: boolean = false,
    public velocity: Vector3 = new Vector3(0, 0, 0),
    public gravityScale: number = 1.0
  ) {
    super();
    if (mass === 0) {
      this.isStatic = true;
    }
  }
}

export class BoxCollider2D extends Component {
  public size: Vector2;
  public offset: Vector2;
  public isTrigger: boolean;

  constructor(
    wOrSize: number | Vector2 = 32,
    hOrOffset: number | Vector2 = 32,
    offset: Vector2 = new Vector2(0, 0),
    isTrigger: boolean = false
  ) {
    super();
    if (wOrSize instanceof Vector2) {
      this.size = wOrSize;
      this.offset = hOrOffset instanceof Vector2 ? hOrOffset : offset;
      this.isTrigger = isTrigger;
    } else {
      const h = typeof hOrOffset === 'number' ? hOrOffset : 32;
      this.size = new Vector2(wOrSize, h);
      this.offset = offset;
      this.isTrigger = isTrigger;
    }
  }

  public get width(): number {
    return this.size.x;
  }
  public set width(v: number) {
    this.size.x = v;
  }

  public get height(): number {
    return this.size.y;
  }
  public set height(v: number) {
    this.size.y = v;
  }
}

export class CircleCollider2D extends Component {
  constructor(
    public radius: number = 16,
    public offset: Vector2 = new Vector2(0, 0),
    public isTrigger: boolean = false
  ) {
    super();
  }
}

export class BoxCollider3D extends Component {
  constructor(
    public size: Vector3 = new Vector3(1, 1, 1),
    public offset: Vector3 = new Vector3(0, 0, 0),
    public isTrigger: boolean = false
  ) {
    super();
  }
}

export class SphereCollider3D extends Component {
  constructor(
    public radius: number = 0.5,
    public offset: Vector3 = new Vector3(0, 0, 0),
    public isTrigger: boolean = false
  ) {
    super();
  }
}

export class AudioSourceComponent extends Component {
  constructor(
    public clipId: string = '',
    public volume: number = 1.0,
    public loop: boolean = false,
    public playOnAwake: boolean = false
  ) {
    super();
  }
}

export class AnimationComponent extends Component {
  constructor(
    public currentClipName: string = '',
    public isPlaying: boolean = false,
    public speed: number = 1.0
  ) {
    super();
  }
}

export class ScriptComponent extends Component {
  public onUpdate?: (dt: number, entity: any) => void;
  public onFixedUpdate?: (fixedDt: number, entity: any) => void;
  public onStart?: (entity: any) => void;
  public onDestroy?: (entity: any) => void;
}

export class ActorComponent extends Component {
  constructor(public actorRef: ActorRef) {
    super();
  }
}

export class NetworkIdentity extends Component {
  constructor(
    public networkId: string = '',
    public isOwner: boolean = false,
    public syncIntervalMs: number = 50
  ) {
    super();
  }
}
