/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - NIR Instruction Builder
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { NIRBasicBlock } from './basic-block';
import {
  NIRAllocaInst,
  NIRBinaryInst,
  NIRCallInst,
  NIRCastInst,
  NIRCastKind,
  NIRFCmpInst,
  NIRGetElementPtrInst,
  NIRICmpInst,
  NIRInstruction,
  NIRLoadInst,
  NIROpcode,
  NIRPhiInst,
  NIRPredicate,
  NIRStoreInst,
} from './instruction';
import {
  NIRBranchInst,
  NIRCondBranchInst,
  NIRReturnInst,
  NIRUnreachableInst,
} from './terminator';
import { NIRType, NIRTypes } from './type';
import { NIRValue } from './value';

export class NIRBuilder {
  private insertBlock: NIRBasicBlock | null = null;

  constructor(insertBlock?: NIRBasicBlock) {
    if (insertBlock) {
      this.setInsertPoint(insertBlock);
    }
  }

  public setInsertPoint(bb: NIRBasicBlock): void {
    this.insertBlock = bb;
  }

  public getInsertBlock(): NIRBasicBlock | null {
    return this.insertBlock;
  }

  private insert<T extends NIRInstruction>(inst: T): T {
    if (!this.insertBlock) {
      throw new Error('Insert point belum diatur pada NIRBuilder');
    }
    this.insertBlock.addInstruction(inst);
    return inst;
  }

  // --- Memory Instructions ---
  public createAlloca(type: NIRType, name?: string): NIRAllocaInst {
    return this.insert(new NIRAllocaInst(type, name));
  }

  public createLoad(ptr: NIRValue, name?: string): NIRLoadInst {
    return this.insert(new NIRLoadInst(ptr, name));
  }

  public createStore(val: NIRValue, ptr: NIRValue): NIRStoreInst {
    return this.insert(new NIRStoreInst(val, ptr));
  }

  public createGEP(
    base: NIRValue,
    indices: NIRValue[],
    resType: NIRType,
    name?: string
  ): NIRGetElementPtrInst {
    return this.insert(new NIRGetElementPtrInst(base, indices, resType, name));
  }

  // --- Arithmetic Instructions ---
  public createAdd(lhs: NIRValue, rhs: NIRValue, name?: string): NIRBinaryInst {
    return this.insert(new NIRBinaryInst(NIROpcode.ADD, lhs, rhs, name));
  }

  public createSub(lhs: NIRValue, rhs: NIRValue, name?: string): NIRBinaryInst {
    return this.insert(new NIRBinaryInst(NIROpcode.SUB, lhs, rhs, name));
  }

  public createMul(lhs: NIRValue, rhs: NIRValue, name?: string): NIRBinaryInst {
    return this.insert(new NIRBinaryInst(NIROpcode.MUL, lhs, rhs, name));
  }

  public createSDiv(lhs: NIRValue, rhs: NIRValue, name?: string): NIRBinaryInst {
    return this.insert(new NIRBinaryInst(NIROpcode.SDIV, lhs, rhs, name));
  }

  public createFDiv(lhs: NIRValue, rhs: NIRValue, name?: string): NIRBinaryInst {
    return this.insert(new NIRBinaryInst(NIROpcode.FDIV, lhs, rhs, name));
  }

  public createSRem(lhs: NIRValue, rhs: NIRValue, name?: string): NIRBinaryInst {
    return this.insert(new NIRBinaryInst(NIROpcode.SREM, lhs, rhs, name));
  }

  // --- Bitwise & Logical Instructions ---
  public createAnd(lhs: NIRValue, rhs: NIRValue, name?: string): NIRBinaryInst {
    return this.insert(new NIRBinaryInst(NIROpcode.AND, lhs, rhs, name));
  }

  public createOr(lhs: NIRValue, rhs: NIRValue, name?: string): NIRBinaryInst {
    return this.insert(new NIRBinaryInst(NIROpcode.OR, lhs, rhs, name));
  }

  public createXor(lhs: NIRValue, rhs: NIRValue, name?: string): NIRBinaryInst {
    return this.insert(new NIRBinaryInst(NIROpcode.XOR, lhs, rhs, name));
  }

  public createShl(lhs: NIRValue, rhs: NIRValue, name?: string): NIRBinaryInst {
    return this.insert(new NIRBinaryInst(NIROpcode.SHL, lhs, rhs, name));
  }

  public createAShr(lhs: NIRValue, rhs: NIRValue, name?: string): NIRBinaryInst {
    return this.insert(new NIRBinaryInst(NIROpcode.ASHR, lhs, rhs, name));
  }

  public createLShr(lhs: NIRValue, rhs: NIRValue, name?: string): NIRBinaryInst {
    return this.insert(new NIRBinaryInst(NIROpcode.LSHR, lhs, rhs, name));
  }

  // --- Comparison Instructions ---
  public createICmp(
    pred: NIRPredicate,
    lhs: NIRValue,
    rhs: NIRValue,
    name?: string
  ): NIRICmpInst {
    return this.insert(new NIRICmpInst(pred, lhs, rhs, name));
  }

  public createFCmp(
    pred: NIRPredicate,
    lhs: NIRValue,
    rhs: NIRValue,
    name?: string
  ): NIRFCmpInst {
    return this.insert(new NIRFCmpInst(pred, lhs, rhs, name));
  }

  // --- Function Call ---
  public createCall(
    callee: string,
    args: NIRValue[],
    returnType: NIRType = NIRTypes.void(),
    name?: string
  ): NIRCallInst {
    return this.insert(new NIRCallInst(callee, args, returnType, name));
  }

  // --- Phi Node ---
  public createPhi(type: NIRType, name?: string): NIRPhiInst {
    return this.insert(new NIRPhiInst(type, name));
  }

  // --- Cast Instruction ---
  public createCast(
    kind: NIRCastKind,
    val: NIRValue,
    targetType: NIRType,
    name?: string
  ): NIRCastInst {
    return this.insert(new NIRCastInst(kind, val, targetType, name));
  }

  // --- Terminator Instructions ---
  public createRet(val?: NIRValue): NIRReturnInst {
    return this.insert(new NIRReturnInst(val));
  }

  public createRetVoid(): NIRReturnInst {
    return this.insert(new NIRReturnInst(undefined));
  }

  public createBr(target: NIRBasicBlock): NIRBranchInst {
    return this.insert(new NIRBranchInst(target));
  }

  public createCondBr(
    cond: NIRValue,
    thenBlock: NIRBasicBlock,
    elseBlock: NIRBasicBlock
  ): NIRCondBranchInst {
    return this.insert(new NIRCondBranchInst(cond, thenBlock, elseBlock));
  }

  public createUnreachable(): NIRUnreachableInst {
    return this.insert(new NIRUnreachableInst());
  }
}
