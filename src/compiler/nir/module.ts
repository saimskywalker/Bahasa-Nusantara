/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - Modul NIR
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { NIRFunction } from './function';
import { NIRType } from './type';
import { NIRGlobal } from './value';

export class NIRModule {
  public targetTriple: string = 'x86_64-unknown-linux-gnu';
  public dataLayout: string = 'e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128';
  public readonly functions: Map<string, NIRFunction> = new Map();
  public readonly globals: Map<string, NIRGlobal> = new Map();
  public readonly metadata: Map<string, any> = new Map();

  constructor(public readonly name: string) {}

  public addFunction(fn: NIRFunction): void {
    fn.parent = this;
    this.functions.set(fn.name, fn);
  }

  public getFunction(name: string): NIRFunction | undefined {
    return this.functions.get(name);
  }

  public hasFunction(name: string): boolean {
    return this.functions.has(name);
  }

  public createFunction(
    name: string,
    returnType: NIRType,
    params: Array<{ name: string; type: NIRType }> = []
  ): NIRFunction {
    const fn = new NIRFunction(name, returnType, params, this);
    return fn;
  }

  public addGlobal(global: NIRGlobal): void {
    this.globals.set(global.globalName, global);
  }

  public getGlobal(name: string): NIRGlobal | undefined {
    return this.globals.get(name);
  }

  public setMetadata(key: string, value: any): void {
    this.metadata.set(key, value);
  }

  public getMetadata(key: string): any {
    return this.metadata.get(key);
  }

  public toString(): string {
    const lines: string[] = [
      `; Modul NIR Bahasa NUSANTARA: ${this.name}`,
      `target datalayout = "${this.dataLayout}"`,
      `target triple = "${this.targetTriple}"`,
      '',
    ];

    if (this.globals.size > 0) {
      lines.push('; --- Variabel Global ---');
      for (const global of this.globals.values()) {
        lines.push(global.toString());
      }
      lines.push('');
    }

    if (this.functions.size > 0) {
      lines.push('; --- Fungsi-Fungsi ---');
      for (const fn of this.functions.values()) {
        lines.push(fn.toString());
        lines.push('');
      }
    }

    return lines.join('\n');
  }

  public toJSON(): any {
    const globalsObj: Record<string, any> = {};
    for (const [k, v] of this.globals.entries()) {
      globalsObj[k] = v.toJSON();
    }

    const funcsObj: Record<string, any> = {};
    for (const [k, v] of this.functions.entries()) {
      funcsObj[k] = v.toJSON();
    }

    const metaObj: Record<string, any> = {};
    for (const [k, v] of this.metadata.entries()) {
      metaObj[k] = v;
    }

    return {
      version: '1.0.0',
      schema: 'nusantara-nir-v1',
      name: this.name,
      targetTriple: this.targetTriple,
      dataLayout: this.dataLayout,
      globals: globalsObj,
      functions: funcsObj,
      metadata: metaObj,
    };
  }
}
