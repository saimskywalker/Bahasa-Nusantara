/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - Antarmuka Pass Optimizer
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { NIRFunction } from '../function';
import { NIRModule } from '../module';

export interface NIRPass {
  readonly name: string;
  run(mod: NIRModule): boolean;
}

export abstract class NIRFunctionPass implements NIRPass {
  public abstract readonly name: string;

  public run(mod: NIRModule): boolean {
    let modified = false;
    for (const fn of mod.functions.values()) {
      if (!fn.isDeclaration) {
        if (this.runOnFunction(fn)) {
          modified = true;
        }
      }
    }
    return modified;
  }

  public abstract runOnFunction(fn: NIRFunction): boolean;
}
