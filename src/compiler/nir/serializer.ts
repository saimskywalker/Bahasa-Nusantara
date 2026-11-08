/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - Serializer JSON
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { NIRFunction } from './function';
import { NIRModule } from './module';

export class NIRSerializer {
  public static toJSON(mod: NIRModule): any {
    return mod.toJSON();
  }

  public static toJSONString(mod: NIRModule, pretty: boolean = true): string {
    const obj = this.toJSON(mod);
    return pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
  }

  public static serializeModule(mod: NIRModule, pretty: boolean = true): string {
    return this.toJSONString(mod, pretty);
  }

  public static serializeFunction(fn: NIRFunction, pretty: boolean = true): string {
    const mod = new NIRModule('modul_' + fn.name);
    mod.addFunction(fn);
    return this.toJSONString(mod, pretty);
  }
}

