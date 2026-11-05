/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - Penanganan Node Phi SSA
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { NIRBasicBlock } from '../basic-block';
import { NIRPhiInst } from '../instruction';
import { NIRType } from '../type';
import { NIRValue } from '../value';

export class PhiHelper {
  public static createPhiNode(
    block: NIRBasicBlock,
    type: NIRType,
    name?: string
  ): NIRPhiInst {
    const phi = new NIRPhiInst(type, name);
    block.addInstruction(phi);
    return phi;
  }

  public static isComplete(phi: NIRPhiInst, block: NIRBasicBlock): boolean {
    const preds = block.predecessors;
    if (phi.incoming.length !== preds.length) return false;
    for (const pred of preds) {
      const found = phi.incoming.some((inc) => inc.block === pred);
      if (!found) return false;
    }
    return true;
  }

  public static removeIncomingFromBlock(phi: NIRPhiInst, block: NIRBasicBlock): void {
    const idx = phi.incoming.findIndex((inc) => inc.block === block);
    if (idx !== -1) {
      phi.incoming.splice(idx, 1);
      // Re-link operands
      const ops = phi.getOperands();
      if (idx < ops.length) {
        ops[idx].removeUse(phi, idx);
        ops.splice(idx, 1);
      }
    }
  }

  public static simplifyTrivialPhi(phi: NIRPhiInst): NIRValue | null {
    // Phi dengan nilai yang sama dari semua predecessor adalah redundan
    let sameVal: NIRValue | null = null;
    for (const inc of phi.incoming) {
      const val = inc.value;
      if (val === phi || val === sameVal) continue;
      if (sameVal !== null) return null; // Lebih dari 1 nilai berbeda
      sameVal = val;
    }
    return sameVal;
  }
}
