/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - Serializer JSON
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { NIRModule } from './module';

export class NIRSerializer {
  public static toJSON(mod: NIRModule): any {
    return mod.toJSON();
  }

  public static toJSONString(mod: NIRModule, pretty: boolean = true): string {
    const obj = this.toJSON(mod);
    return pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
  }
}
