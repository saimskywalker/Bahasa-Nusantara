/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - Pass Constant Folding
 * Target Milestone: Phase 43 (v0.43.0)
 */

import {
  NIRConstant,
  NIRConstantBool,
  NIRConstantFloat,
  NIRConstantInt,
  NIRConstants,
} from '../constant';
import { NIRFunction } from '../function';
import {
  NIRBinaryInst,
  NIRFCmpInst,
  NIRICmpInst,
  NIROpcode,
  NIRPredicate,
} from '../instruction';
import { NIRValue } from '../value';
import { NIRFunctionPass } from './pass';

export class ConstantFoldingPass extends NIRFunctionPass {
  public readonly name = 'constant-folding';

  public runOnFunction(fn: NIRFunction): boolean {
    let modified = false;

    for (const bb of fn.basicBlocks) {
      const instructions = [...bb.instructions];
      for (const inst of instructions) {
        if (inst.isBinaryOp()) {
          const bin = inst as NIRBinaryInst;
          const folded = this.foldBinary(bin.opcode, bin.lhs, bin.rhs);
          if (folded) {
            inst.replaceAllUsesWith(folded);
            bb.removeInstruction(inst);
            modified = true;
          }
        } else if (inst.opcode === NIROpcode.ICMP) {
          const icmp = inst as NIRICmpInst;
          const folded = this.foldICmp(icmp.predicate, icmp.lhs, icmp.rhs);
          if (folded) {
            inst.replaceAllUsesWith(folded);
            bb.removeInstruction(inst);
            modified = true;
          }
        } else if (inst.opcode === NIROpcode.FCMP) {
          const fcmp = inst as NIRFCmpInst;
          const folded = this.foldFCmp(fcmp.predicate, fcmp.lhs, fcmp.rhs);
          if (folded) {
            inst.replaceAllUsesWith(folded);
            bb.removeInstruction(inst);
            modified = true;
          }
        }
      }
    }

    return modified;
  }

  private foldBinary(opcode: NIROpcode, lhs: NIRValue, rhs: NIRValue): NIRConstant | null {
    if (lhs instanceof NIRConstantInt && rhs instanceof NIRConstantInt) {
      const a = BigInt(lhs.value);
      const b = BigInt(rhs.value);

      switch (opcode) {
        case NIROpcode.ADD:
          return NIRConstants.i64(a + b);
        case NIROpcode.SUB:
          return NIRConstants.i64(a - b);
        case NIROpcode.MUL:
          return NIRConstants.i64(a * b);
        case NIROpcode.SDIV:
          if (b === 0n) return null;
          return NIRConstants.i64(a / b);
        case NIROpcode.SREM:
          if (b === 0n) return null;
          return NIRConstants.i64(a % b);
        case NIROpcode.AND:
          return NIRConstants.i64(a & b);
        case NIROpcode.OR:
          return NIRConstants.i64(a | b);
        case NIROpcode.XOR:
          return NIRConstants.i64(a ^ b);
        case NIROpcode.SHL:
          return NIRConstants.i64(a << b);
        case NIROpcode.ASHR:
          return NIRConstants.i64(a >> b);
        default:
          return null;
      }
    }

    if (lhs instanceof NIRConstantFloat && rhs instanceof NIRConstantFloat) {
      const a = lhs.value;
      const b = rhs.value;

      switch (opcode) {
        case NIROpcode.ADD:
          return NIRConstants.float(a + b);
        case NIROpcode.SUB:
          return NIRConstants.float(a - b);
        case NIROpcode.MUL:
          return NIRConstants.float(a * b);
        case NIROpcode.FDIV:
          if (b === 0) return null;
          return NIRConstants.float(a / b);
        default:
          return null;
      }
    }

    if (lhs instanceof NIRConstantBool && rhs instanceof NIRConstantBool) {
      const a = lhs.value;
      const b = rhs.value;

      switch (opcode) {
        case NIROpcode.AND:
          return NIRConstants.bool(a && b);
        case NIROpcode.OR:
          return NIRConstants.bool(a || b);
        case NIROpcode.XOR:
          return NIRConstants.bool(a !== b);
        default:
          return null;
      }
    }

    return null;
  }

  private foldICmp(pred: NIRPredicate, lhs: NIRValue, rhs: NIRValue): NIRConstantBool | null {
    if (lhs instanceof NIRConstantInt && rhs instanceof NIRConstantInt) {
      const a = BigInt(lhs.value);
      const b = BigInt(rhs.value);

      switch (pred) {
        case NIRPredicate.EQ:
          return NIRConstants.bool(a === b);
        case NIRPredicate.NE:
          return NIRConstants.bool(a !== b);
        case NIRPredicate.SLT:
        case NIRPredicate.ULT:
          return NIRConstants.bool(a < b);
        case NIRPredicate.SLE:
        case NIRPredicate.ULE:
          return NIRConstants.bool(a <= b);
        case NIRPredicate.SGT:
        case NIRPredicate.UGT:
          return NIRConstants.bool(a > b);
        case NIRPredicate.SGE:
        case NIRPredicate.UGE:
          return NIRConstants.bool(a >= b);
        default:
          return null;
      }
    }

    if (lhs instanceof NIRConstantBool && rhs instanceof NIRConstantBool) {
      const a = lhs.value;
      const b = rhs.value;
      if (pred === NIRPredicate.EQ) return NIRConstants.bool(a === b);
      if (pred === NIRPredicate.NE) return NIRConstants.bool(a !== b);
    }

    return null;
  }

  private foldFCmp(pred: NIRPredicate, lhs: NIRValue, rhs: NIRValue): NIRConstantBool | null {
    if (lhs instanceof NIRConstantFloat && rhs instanceof NIRConstantFloat) {
      const a = lhs.value;
      const b = rhs.value;

      switch (pred) {
        case NIRPredicate.OEQ:
          return NIRConstants.bool(a === b);
        case NIRPredicate.ONE:
          return NIRConstants.bool(a !== b);
        case NIRPredicate.OLT:
          return NIRConstants.bool(a < b);
        case NIRPredicate.OLE:
          return NIRConstants.bool(a <= b);
        case NIRPredicate.OGT:
          return NIRConstants.bool(a > b);
        case NIRPredicate.OGE:
          return NIRConstants.bool(a >= b);
        default:
          return null;
      }
    }
    return null;
  }
}
