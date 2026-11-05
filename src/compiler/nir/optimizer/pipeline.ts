/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - NIR Optimization Pipeline
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { NIRModule } from '../module';
import { CFGCleanupPass } from './cfg-cleanup';
import { ConstantFoldingPass } from './constant-folding';
import { ConstantPropagationPass } from './constant-propagation';
import { DeadCodeEliminationPass } from './dead-code-elimination';
import { NIRPass } from './pass';
import { SimplificationPass } from './simplification';

export class NIRPassManager {
  private passes: NIRPass[] = [];

  public addPass(pass: NIRPass): this {
    this.passes.push(pass);
    return this;
  }

  public run(mod: NIRModule): boolean {
    let anyModified = false;
    for (const pass of this.passes) {
      const modified = pass.run(mod);
      if (modified) {
        anyModified = true;
      }
    }
    return anyModified;
  }

  public static createDefaultPipeline(): NIRPassManager {
    const pm = new NIRPassManager();
    pm.addPass(new ConstantFoldingPass());
    pm.addPass(new SimplificationPass());
    pm.addPass(new ConstantPropagationPass());
    pm.addPass(new DeadCodeEliminationPass());
    pm.addPass(new CFGCleanupPass());
    return pm;
  }

  public static createO1Pipeline(): NIRPassManager {
    const pm = new NIRPassManager();
    pm.addPass(new ConstantFoldingPass());
    pm.addPass(new SimplificationPass());
    pm.addPass(new DeadCodeEliminationPass());
    return pm;
  }

  public static createO2Pipeline(): NIRPassManager {
    const pm = new NIRPassManager();
    // Run two cycles to reach fixpoint
    pm.addPass(new ConstantFoldingPass());
    pm.addPass(new SimplificationPass());
    pm.addPass(new ConstantPropagationPass());
    pm.addPass(new DeadCodeEliminationPass());
    pm.addPass(new CFGCleanupPass());
    pm.addPass(new ConstantFoldingPass());
    pm.addPass(new SimplificationPass());
    pm.addPass(new DeadCodeEliminationPass());
    return pm;
  }
}
