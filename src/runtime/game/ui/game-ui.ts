/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Vector2, Color, Rect } from '../types';
import { IRenderer } from '../graphics/renderer';
import { InputManager } from '../input/input-manager';

export interface UIEventHandlers {
  onClick?: (el: UIElement) => void;
  onPointerDown?: (el: UIElement) => void;
  onPointerUp?: (el: UIElement) => void;
  onPointerEnter?: (el: UIElement) => void;
  onPointerLeave?: (el: UIElement) => void;
}

export abstract class UIElement {
  public id: string;
  public bounds: Rect;
  public visible: boolean = true;
  public interactive: boolean = true;
  public isHovered: boolean = false;
  public isPressed: boolean = false;
  public parent: UIElement | null = null;
  public children: UIElement[] = [];
  public zIndex: number = 0;

  public handlers: UIEventHandlers = {};

  constructor(id: string, x: number, y: number, width: number, height: number) {
    this.id = id;
    this.bounds = new Rect(x, y, width, height);
  }

  public addChild(child: UIElement): void {
    child.parent = this;
    this.children.push(child);
    this.children.sort((a, b) => a.zIndex - b.zIndex);
  }

  public removeChild(childId: string): boolean {
    const idx = this.children.findIndex((c) => c.id === childId);
    if (idx !== -1) {
      this.children[idx].parent = null;
      this.children.splice(idx, 1);
      return true;
    }
    return false;
  }

  public getGlobalPosition(): Vector2 {
    if (!this.parent) {
      return new Vector2(this.bounds.x, this.bounds.y);
    }
    const parentPos = this.parent.getGlobalPosition();
    return new Vector2(parentPos.x + this.bounds.x, parentPos.y + this.bounds.y);
  }

  public getGlobalBounds(): Rect {
    const pos = this.getGlobalPosition();
    return new Rect(pos.x, pos.y, this.bounds.width, this.bounds.height);
  }

  public containsPoint(x: number, y: number): boolean {
    return this.getGlobalBounds().contains(x, y);
  }

  public update(_dt: number): void {
    for (const child of this.children) {
      if (child.visible) {
        child.update(_dt);
      }
    }
  }

  public abstract draw(renderer: IRenderer): void;

  public render(renderer: IRenderer): void {
    if (!this.visible) return;
    this.draw(renderer);
    for (const child of this.children) {
      child.render(renderer);
    }
  }
}

export class UIPanel extends UIElement {
  public backgroundColor: Color;
  public borderColor: Color;
  public borderWidth: number;

  constructor(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    backgroundColor: Color = new Color(0.15, 0.15, 0.2, 0.8),
    borderColor: Color = new Color(0.3, 0.3, 0.4, 1),
    borderWidth: number = 1
  ) {
    super(id, x, y, width, height);
    this.backgroundColor = backgroundColor;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
  }

  public draw(renderer: IRenderer): void {
    const gb = this.getGlobalBounds();
    renderer.drawRect(gb.x, gb.y, gb.width, gb.height, this.backgroundColor);
  }
}

export class UIButton extends UIElement {
  public label: string;
  public normalColor: Color;
  public hoverColor: Color;
  public pressedColor: Color;
  public textColor: Color;
  public fontSize: number;

  constructor(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    onClick?: (el: UIElement) => void
  ) {
    super(id, x, y, width, height);
    this.label = label;
    this.normalColor = new Color(0.2, 0.45, 0.85, 1);
    this.hoverColor = new Color(0.25, 0.55, 0.95, 1);
    this.pressedColor = new Color(0.12, 0.3, 0.65, 1);
    this.textColor = Color.putih();
    this.fontSize = 14;

    if (onClick) {
      this.handlers.onClick = onClick;
    }
  }

  public draw(renderer: IRenderer): void {
    const gb = this.getGlobalBounds();
    let col = this.normalColor;
    if (this.isPressed) {
      col = this.pressedColor;
    } else if (this.isHovered) {
      col = this.hoverColor;
    }

    renderer.drawRect(gb.x, gb.y, gb.width, gb.height, col);
    const textX = gb.x + 8;
    const textY = gb.y + gb.height / 2 + 5;
    renderer.drawText(this.label, textX, textY, this.textColor, `${this.fontSize}px sans-serif`);
  }
}

export class UILabel extends UIElement {
  public text: string;
  public color: Color;
  public fontSize: number;
  public fontFamily: string;

  constructor(
    id: string,
    x: number,
    y: number,
    text: string,
    color: Color = Color.putih(),
    fontSize: number = 14,
    fontFamily: string = 'sans-serif'
  ) {
    super(id, x, y, 100, 20);
    this.text = text;
    this.color = color;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.interactive = false;
  }

  public draw(renderer: IRenderer): void {
    const pos = this.getGlobalPosition();
    renderer.drawText(this.text, pos.x, pos.y + this.fontSize, this.color, `${this.fontSize}px ${this.fontFamily}`);
  }
}

export class UIProgressBar extends UIElement {
  public min: number = 0;
  public max: number = 100;
  public value: number = 50;
  public trackColor: Color;
  public fillColor: Color;

  constructor(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    value: number = 50,
    fillColor: Color = new Color(0.2, 0.8, 0.3, 1),
    trackColor: Color = new Color(0.2, 0.2, 0.25, 1)
  ) {
    super(id, x, y, width, height);
    this.value = value;
    this.fillColor = fillColor;
    this.trackColor = trackColor;
    this.interactive = false;
  }

  public setProgress(val: number): void {
    this.value = Math.max(this.min, Math.min(this.max, val));
  }

  public getNormalized(): number {
    if (this.max === this.min) return 0;
    return (this.value - this.min) / (this.max - this.min);
  }

  public draw(renderer: IRenderer): void {
    const gb = this.getGlobalBounds();
    // Track
    renderer.drawRect(gb.x, gb.y, gb.width, gb.height, this.trackColor);
    // Fill
    const fillWidth = gb.width * this.getNormalized();
    if (fillWidth > 0) {
      renderer.drawRect(gb.x, gb.y, fillWidth, gb.height, this.fillColor);
    }
  }
}

export class UISlider extends UIElement {
  public min: number = 0;
  public max: number = 100;
  public value: number = 50;
  public trackColor: Color = new Color(0.2, 0.2, 0.25, 1);
  public fillColor: Color = new Color(0.3, 0.6, 0.9, 1);
  public handleColor: Color = Color.putih();
  public handleWidth: number = 12;
  public isDragging: boolean = false;
  public onChange?: (value: number) => void;

  constructor(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    value: number = 50,
    onChange?: (val: number) => void
  ) {
    super(id, x, y, width, height);
    this.value = value;
    this.onChange = onChange;
  }

  public setNormalizedValue(normalized: number): void {
    const clamped = Math.max(0, Math.min(1, normalized));
    this.value = this.min + clamped * (this.max - this.min);
    if (this.onChange) {
      this.onChange(this.value);
    }
  }

  public getNormalized(): number {
    if (this.max === this.min) return 0;
    return (this.value - this.min) / (this.max - this.min);
  }

  public draw(renderer: IRenderer): void {
    const gb = this.getGlobalBounds();
    const trackHeight = Math.max(4, gb.height * 0.4);
    const trackY = gb.y + (gb.height - trackHeight) / 2;

    renderer.drawRect(gb.x, trackY, gb.width, trackHeight, this.trackColor);

    const norm = this.getNormalized();
    const fillW = gb.width * norm;
    renderer.drawRect(gb.x, trackY, fillW, trackHeight, this.fillColor);

    const handleX = gb.x + fillW - this.handleWidth / 2;
    renderer.drawRect(handleX, gb.y, this.handleWidth, gb.height, this.handleColor);
  }
}

export class GameUI {
  private elements: UIElement[] = [];
  private hoveredElement: UIElement | null = null;
  private activeElement: UIElement | null = null;

  public add(element: UIElement): void {
    this.elements.push(element);
    this.elements.sort((a, b) => a.zIndex - b.zIndex);
  }

  public remove(id: string): boolean {
    const idx = this.elements.findIndex((e) => e.id === id);
    if (idx !== -1) {
      this.elements.splice(idx, 1);
      return true;
    }
    return false;
  }

  public getElement(id: string): UIElement | undefined {
    return this.findRecursive(this.elements, id);
  }

  private findRecursive(list: UIElement[], id: string): UIElement | undefined {
    for (const el of list) {
      if (el.id === id) return el;
      const found = this.findRecursive(el.children, id);
      if (found) return found;
    }
    return undefined;
  }

  public processInput(input: InputManager): void {
    const mousePos = input.posisiMouse();
    const isMouseDown = input.apakahTombolMouseDitekan(0);
    const wasMouseClicked = input.apakahTombolMouseBaruDitekan(0);
    const wasMouseReleased = input.apakahTombolMouseDilepas(0);

    const hit = this.hitTest(mousePos.x, mousePos.y);

    // Hover transitions
    if (hit !== this.hoveredElement) {
      if (this.hoveredElement) {
        this.hoveredElement.isHovered = false;
        if (this.hoveredElement.handlers.onPointerLeave) {
          this.hoveredElement.handlers.onPointerLeave(this.hoveredElement);
        }
      }
      this.hoveredElement = hit;
      if (this.hoveredElement) {
        this.hoveredElement.isHovered = true;
        if (this.hoveredElement.handlers.onPointerEnter) {
          this.hoveredElement.handlers.onPointerEnter(this.hoveredElement);
        }
      }
    }

    // Click / press
    if (wasMouseClicked && hit) {
      this.activeElement = hit;
      hit.isPressed = true;
      if (hit.handlers.onPointerDown) {
        hit.handlers.onPointerDown(hit);
      }
      if (hit instanceof UISlider) {
        hit.isDragging = true;
        const gb = hit.getGlobalBounds();
        hit.setNormalizedValue((mousePos.x - gb.x) / gb.width);
      }
    }

    if (this.activeElement && isMouseDown && this.activeElement instanceof UISlider && this.activeElement.isDragging) {
      const gb = this.activeElement.getGlobalBounds();
      this.activeElement.setNormalizedValue((mousePos.x - gb.x) / gb.width);
    }

    if (wasMouseReleased && this.activeElement) {
      this.activeElement.isPressed = false;
      if (this.activeElement instanceof UISlider) {
        this.activeElement.isDragging = false;
      }
      if (this.activeElement.handlers.onPointerUp) {
        this.activeElement.handlers.onPointerUp(this.activeElement);
      }
      if (hit === this.activeElement) {
        if (this.activeElement.handlers.onClick) {
          this.activeElement.handlers.onClick(this.activeElement);
        }
      }
      this.activeElement = null;
    }
  }

  public hitTest(x: number, y: number): UIElement | null {
    // Reverse order for top-most
    for (let i = this.elements.length - 1; i >= 0; i--) {
      const hit = this.hitTestElement(this.elements[i], x, y);
      if (hit) return hit;
    }
    return null;
  }

  private hitTestElement(el: UIElement, x: number, y: number): UIElement | null {
    if (!el.visible || !el.interactive) return null;
    // Check children first
    for (let i = el.children.length - 1; i >= 0; i--) {
      const hit = this.hitTestElement(el.children[i], x, y);
      if (hit) return hit;
    }
    if (el.containsPoint(x, y)) {
      return el;
    }
    return null;
  }

  public update(dt: number): void {
    for (const el of this.elements) {
      if (el.visible) {
        el.update(dt);
      }
    }
  }

  public draw(renderer: IRenderer): void {
    for (const el of this.elements) {
      el.render(renderer);
    }
  }

  public clear(): void {
    this.elements = [];
    this.hoveredElement = null;
    this.activeElement = null;
  }
}
