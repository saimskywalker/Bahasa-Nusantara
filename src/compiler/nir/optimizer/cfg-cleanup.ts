/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - Pass CFG Cleanup & Simplification
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { ControlFlowGraph } from '../cfg/control-flow-graph';
import { NIRConstantBool } from '../constant';
import { NIRFunction } from '../function';
import { NIRBranchInst, NIRCondBranchInst } from '../terminator';
import { NIRFunctionPass } from './pass';

export class CFGCleanupPass extends NIRFunctionPass {
  public readonly name = 'cfg-cleanup';

  public runOnFunction(fn: NIRFunction): boolean {
    let modified = false;

    // 1. Sederhanakan br_cond dengan kondisi konstan
    for (const bb of fn.basicBlocks) {
      if (bb.terminator instanceof NIRCondBranchInst) {
        const condBr = bb.terminator;
        if (condBr.condition instanceof NIRConstantBool) {
          const isTrue = condBr.condition.value;
          const target = isTrue ? condBr.thenBlock : condBr.elseBlock;
          const deadTarget = isTrue ? condBr.elseBlock : condBr.thenBlock;

          // Hapus incoming dari deadTarget pada phi nodes
          if (deadTarget) {
            for (const phi of deadTarget.phiNodes) {
              const idx = phi.incoming.findIndex((inc: any) => inc.block === bb);
              if (idx !== -1) {
                phi.incoming.splice(idx, 1);
              }
            }
          }

          bb.setTerminator(new NIRBranchInst(target));
          modified = true;
        }
      }
    }

    // 2. Bangun ulang CFG
    fn.rebuildCFG();

    // 3. Hapus basic block yang tidak dapat dijangkau dari entry
    const cfg = new ControlFlowGraph(fn);
    const reachable = new Set(cfg.getReachableBlocks());

    const allBlocks = [...fn.basicBlocks];
    for (const bb of allBlocks) {
      if (!reachable.has(bb) && bb !== fn.getEntryBlock()) {
        fn.removeBasicBlock(bb);
        modified = true;
      }
    }

    if (modified) {
      fn.rebuildCFG();
    }

    return modified;
  }
}
