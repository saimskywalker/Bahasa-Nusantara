/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - Pass Constant Propagation
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { NIRConstant } from '../constant';
import { NIRFunction } from '../function';
import { NIRInstruction, NIROpcode } from '../instruction';
import { NIRValue } from '../value';
import { NIRFunctionPass } from './pass';

export class ConstantPropagationPass extends NIRFunctionPass {
  public readonly name = 'constant-propagation';

  public runOnFunction(fn: NIRFunction): boolean {
    let modified = false;
    const constMap = new Map<NIRInstruction, NIRConstant>();

    // 1. Identifikasi instruksi yang menghasilkan konstanta
    for (const bb of fn.basicBlocks) {
      for (const inst of bb.getAllInstructions()) {
        // Jika ada instruksi yang hanya memindahkan/mengembalikan konstanta
        if (inst.opcode === NIROpcode.CAST) {
          const src = inst.getOperand(0);
          if (src instanceof NIRConstant) {
            // Propagasi langsung jika jenis tipe identik
            if (src.type.equals(inst.type)) {
              constMap.set(inst, src);
            }
          }
        }
      }
    }

    // 2. Gantikan penggunaan dengan konstanta
    for (const [inst, constant] of constMap.entries()) {
      inst.replaceAllUsesWith(constant);
      if (inst.parent) {
        inst.parent.removeInstruction(inst);
      }
      modified = true;
    }

    return modified;
  }
}
