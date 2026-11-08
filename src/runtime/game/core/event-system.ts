/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA GAME SDK - Sistem Peristiwa Game (Event System)
 * Target Milestone: Phase 47 (v0.47.0)
 */

export type GameEventListener<T = any> = (data: T) => void;

export class GameEventBus {
  private listeners: Map<string, Set<GameEventListener>> = new Map();
  private onceListeners: Map<string, Set<GameEventListener>> = new Map();

  public on<T = any>(event: string, listener: GameEventListener<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
    return () => this.off(event, listener);
  }

  public langganan<T = any>(event: string, listener: GameEventListener<T>): () => void {
    return this.on(event, listener);
  }

  public once<T = any>(event: string, listener: GameEventListener<T>): void {
    if (!this.onceListeners.has(event)) {
      this.onceListeners.set(event, new Set());
    }
    this.onceListeners.get(event)!.add(listener);
  }

  public off(event: string, listener: GameEventListener): void {
    const list = this.listeners.get(event);
    if (list) {
      list.delete(listener);
    }
    const onceList = this.onceListeners.get(event);
    if (onceList) {
      onceList.delete(listener);
    }
  }

  public lepas(event: string, listener: GameEventListener): void {
    this.off(event, listener);
  }

  public emit<T = any>(event: string, data?: T): void {
    const list = this.listeners.get(event);
    if (list) {
      for (const listener of Array.from(list)) {
        try {
          listener(data);
        } catch (err) {
          console.error(`Galat pada penangan peristiwa game '${event}':`, err);
        }
      }
    }

    const onceList = this.onceListeners.get(event);
    if (onceList) {
      const copy = Array.from(onceList);
      this.onceListeners.delete(event);
      for (const listener of copy) {
        try {
          listener(data);
        } catch (err) {
          console.error(`Galat pada once-listener peristiwa game '${event}':`, err);
        }
      }
    }
  }

  public kirimPeristiwa<T = any>(event: string, data?: T): void {
    this.emit(event, data);
  }

  public clear(): void {
    this.listeners.clear();
    this.onceListeners.clear();
  }
}
