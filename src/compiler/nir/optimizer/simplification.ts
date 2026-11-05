/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - Pass Penyederhanaan Aljabar (Simplification)
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { NIRConstant, NIRConstantBool, NIRConstantInt, NIRConstants } from '../constant';
import { NIRFunction } from '../function';
import { NIRBinaryInst, NIRICmpInst, NIROpcode, NIRPredicate } from '../instruction';
import { NIRValue } from '../value';
import { NIRFunctionPass } from './pass';

export class SimplificationPass extends NIRFunctionPass {
  public readonly name = 'algebraic-simplification';

  public runOnFunction(fn: NIRFunction): boolean {
    let modified = false;

    for (const bb of fn.basicBlocks) {
      const instructions = [...bb.instructions];
      for (const inst of instructions) {
        if (inst.isBinaryOp()) {
          const bin = inst as NIRBinaryInst;
          const simplified = this.simplifyBinary(bin.opcode, bin.lhs, bin.rhs);
          if (simplified) {
            inst.replaceAllUsesWith(simplified);
            bb.removeInstruction(inst);
            modified = true;
          }
        } else if (inst.opcode === NIROpcode.ICMP) {
          const icmp = inst as NIRICmpInst;
          const simplified = this.simplifyICmp(icmp.predicate, icmp.lhs, icmp.rhs);
          if (simplified) {
            inst.replaceAllUsesWith(simplified);
            bb.removeInstruction(inst);
            modified = true;
          }
        }
      }
    }

    return modified;
  }

  private simplifyBinary(opcode: NIROpcode, lhs: NIRValue, rhs: NIRValue): NIRValue | null {
    // 1. Identitas Penjumlahan: x + 0 = x, 0 + x = x
    if (opcode === NIROpcode.ADD) {
      if (rhs instanceof NIRConstant && rhs.isZero()) return lhs;
      if (lhs instanceof NIRConstant && lhs.isZero()) return rhs;
    }

    // 2. Identitas Pengurangan: x - 0 = x
    if (opcode === NIROpcode.SUB) {
      if (rhs instanceof NIRConstant && rhs.isZero()) return lhs;
      if (lhs === rhs) return NIRConstants.int(0, lhs.type);
    }

    // 3. Perkalian: x * 1 = x, x * 0 = 0
    if (opcode === NIROpcode.MUL) {
      if (rhs instanceof NIRConstant && rhs.isOne()) return lhs;
      if (lhs instanceof NIRConstant && lhs.isOne()) return rhs;
      if (rhs instanceof NIRConstant && rhs.isZero()) return rhs;
      if (lhs instanceof NIRConstant && lhs.isZero()) return lhs;
    }

    // 4. Pembagian: x / 1 = x
    if (opcode === NIROpcode.SDIV || opcode === NIROpcode.FDIV) {
      if (rhs instanceof NIRConstant && rhs.isOne()) return lhs;
    }

    // 5. Logika AND: x && true = x, x && false = false
    if (opcode === NIROpcode.AND) {
      if (rhs instanceof NIRConstantBool) {
        if (rhs.value) return lhs;
        return rhs;
      }
      if (lhs instanceof NIRConstantBool) {
        if (lhs.value) return rhs;
        return lhs;
      }
      if (lhs === rhs) return lhs;
    }

    // 6. Logika OR: x || false = x, x || true = true
    if (opcode === NIROpcode.OR) {
      if (rhs instanceof NIRConstantBool) {
        if (!rhs.value) return lhs;
        return rhs;
      }
      if (lhs instanceof NIRConstantBool) {
        if (!lhs.value) return rhs;
        return lhs;
      }
      if (lhs === rhs) return lhs;
    }

    // 7. XOR: x ^ x = 0, x ^ 0 = x
    if (opcode === NIROpcode.XOR) {
      if (lhs === rhs) return NIRConstants.int(0, lhs.type);
      if (rhs instanceof NIRConstant && rhs.isZero()) return lhs;
      if (lhs instanceof NIRConstant && lhs.isZero()) return rhs;
    }

    return null;
  }

  private simplifyICmp(pred: NIRPredicate, lhs: NIRValue, rhs: NIRValue): NIRValue | null {
    if (lhs === rhs) {
      if (pred === NIRPredicate.EQ || pred === NIRPredicate.SLE || pred === NIRPredicate.SGE) {
        return NIRConstants.bool(true);
      }
      if (pred === NIRPredicate.NE || pred === NIRPredicate.SLT || pred === NIRPredicate.SGT) {
        return NIRConstants.bool(false);
      }
    }
    return null;
  }
}
