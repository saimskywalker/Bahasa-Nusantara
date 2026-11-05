/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - Kumpulan Instruksi (Instruction Set)
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { NIRType, NIRTypes } from './type';
import { NIRValue, NIRValueKind } from './value';

export enum NIROpcode {
  // Memory
  ALLOCA = 'alloca',
  LOAD = 'load',
  STORE = 'store',
  GEP = 'gep',

  // Arithmetic
  ADD = 'add',
  SUB = 'sub',
  MUL = 'mul',
  SDIV = 'sdiv',
  FDIV = 'fdiv',
  SREM = 'srem',

  // Bitwise / Logical
  AND = 'and',
  OR = 'or',
  XOR = 'xor',
  SHL = 'shl',
  ASHR = 'ashr',
  LSHR = 'lshr',

  // Comparison
  ICMP = 'icmp',
  FCMP = 'fcmp',

  // Control Flow / Terminator
  RET = 'ret',
  BR = 'br',
  BR_COND = 'br_cond',
  UNREACHABLE = 'unreachable',

  // Function
  CALL = 'call',

  // SSA
  PHI = 'phi',

  // Cast / Conversion
  CAST = 'cast',
}

export enum NIRPredicate {
  // Integer comparison predicates
  EQ = 'eq',
  NE = 'ne',
  SLT = 'slt',
  SLE = 'sle',
  SGT = 'sgt',
  SGE = 'sge',
  ULT = 'ult',
  ULE = 'ule',
  UGT = 'ugt',
  UGE = 'uge',

  // Floating point comparison predicates
  OEQ = 'oeq',
  ONE = 'one',
  OLT = 'olt',
  OLE = 'ole',
  OGT = 'ogt',
  OGE = 'oge',
}

export enum NIRCastKind {
  BITCAST = 'bitcast',
  INT_TO_FP = 'sitofp',
  FP_TO_INT = 'fptosi',
  ZEXT = 'zext',
  SEXT = 'sext',
  TRUNC = 'trunc',
}

export interface NIRSourceLoc {
  file?: string;
  line?: number;
  column?: number;
}

export abstract class NIRInstruction extends NIRValue {
  public parent: any = null; // NIRBasicBlock
  public sourceLoc?: NIRSourceLoc;
  protected operands: NIRValue[] = [];

  constructor(
    public readonly opcode: NIROpcode,
    type: NIRType,
    name?: string
  ) {
    super(NIRValueKind.INSTRUCTION, type, name);
  }

  public getOperands(): NIRValue[] {
    return this.operands;
  }

  public getOperand(index: number): NIRValue {
    if (index < 0 || index >= this.operands.length) {
      throw new Error(`Operand index ${index} di luar batas untuk instruksi ${this.opcode}`);
    }
    return this.operands[index];
  }

  public setOperand(index: number, val: NIRValue): void {
    if (index < 0 || index >= this.operands.length) {
      throw new Error(`Operand index ${index} di luar batas untuk instruksi ${this.opcode}`);
    }
    const oldVal = this.operands[index];
    if (oldVal) {
      oldVal.removeUse(this, index);
    }
    this.operands[index] = val;
    val.addUse(this, index);
  }

  protected addOperand(val: NIRValue): void {
    const idx = this.operands.length;
    this.operands.push(val);
    val.addUse(this, idx);
  }

  public isTerminator(): boolean {
    return (
      this.opcode === NIROpcode.RET ||
      this.opcode === NIROpcode.BR ||
      this.opcode === NIROpcode.BR_COND ||
      this.opcode === NIROpcode.UNREACHABLE
    );
  }

  public isMemoryAccess(): boolean {
    return (
      this.opcode === NIROpcode.ALLOCA ||
      this.opcode === NIROpcode.LOAD ||
      this.opcode === NIROpcode.STORE ||
      this.opcode === NIROpcode.GEP
    );
  }

  public isBinaryOp(): boolean {
    return (
      this.opcode === NIROpcode.ADD ||
      this.opcode === NIROpcode.SUB ||
      this.opcode === NIROpcode.MUL ||
      this.opcode === NIROpcode.SDIV ||
      this.opcode === NIROpcode.FDIV ||
      this.opcode === NIROpcode.SREM ||
      this.opcode === NIROpcode.AND ||
      this.opcode === NIROpcode.OR ||
      this.opcode === NIROpcode.XOR ||
      this.opcode === NIROpcode.SHL ||
      this.opcode === NIROpcode.ASHR ||
      this.opcode === NIROpcode.LSHR
    );
  }

  public override toJSON(): any {
    return {
      ...super.toJSON(),
      opcode: this.opcode,
      operands: this.operands.map((op) => (op ? op.id : null)),
      sourceLoc: this.sourceLoc,
    };
  }
}

export class NIRBinaryInst extends NIRInstruction {
  constructor(
    opcode: NIROpcode,
    lhs: NIRValue,
    rhs: NIRValue,
    name?: string
  ) {
    super(opcode, lhs.type, name);
    this.addOperand(lhs);
    this.addOperand(rhs);
  }

  public get lhs(): NIRValue {
    return this.operands[0];
  }

  public get rhs(): NIRValue {
    return this.operands[1];
  }

  public toString(): string {
    return `${this.id} = ${this.opcode} ${this.type.toString()} ${this.lhs.id}, ${this.rhs.id}`;
  }
}

export class NIRICmpInst extends NIRInstruction {
  constructor(
    public readonly predicate: NIRPredicate,
    lhs: NIRValue,
    rhs: NIRValue,
    name?: string
  ) {
    super(NIROpcode.ICMP, NIRTypes.i1(), name);
    this.addOperand(lhs);
    this.addOperand(rhs);
  }

  public get lhs(): NIRValue {
    return this.operands[0];
  }

  public get rhs(): NIRValue {
    return this.operands[1];
  }

  public toString(): string {
    return `${this.id} = icmp ${this.predicate} ${this.lhs.type.toString()} ${this.lhs.id}, ${this.rhs.id}`;
  }

  public override toJSON(): any {
    return {
      ...super.toJSON(),
      predicate: this.predicate,
    };
  }
}

export class NIRFCmpInst extends NIRInstruction {
  constructor(
    public readonly predicate: NIRPredicate,
    lhs: NIRValue,
    rhs: NIRValue,
    name?: string
  ) {
    super(NIROpcode.FCMP, NIRTypes.i1(), name);
    this.addOperand(lhs);
    this.addOperand(rhs);
  }

  public get lhs(): NIRValue {
    return this.operands[0];
  }

  public get rhs(): NIRValue {
    return this.operands[1];
  }

  public toString(): string {
    return `${this.id} = fcmp ${this.predicate} ${this.lhs.type.toString()} ${this.lhs.id}, ${this.rhs.id}`;
  }

  public override toJSON(): any {
    return {
      ...super.toJSON(),
      predicate: this.predicate,
    };
  }
}

export class NIRAllocaInst extends NIRInstruction {
  constructor(
    public readonly allocatedType: NIRType,
    name?: string
  ) {
    super(NIROpcode.ALLOCA, NIRTypes.pointer(allocatedType), name);
  }

  public toString(): string {
    return `${this.id} = alloca ${this.allocatedType.toString()}`;
  }

  public override toJSON(): any {
    return {
      ...super.toJSON(),
      allocatedType: this.allocatedType.toJSON(),
    };
  }
}

export class NIRLoadInst extends NIRInstruction {
  constructor(
    pointer: NIRValue,
    name?: string
  ) {
    const loadedType = pointer.type.elementType || NIRTypes.any();
    super(NIROpcode.LOAD, loadedType, name);
    this.addOperand(pointer);
  }

  public get pointer(): NIRValue {
    return this.operands[0];
  }

  public toString(): string {
    return `${this.id} = load ${this.type.toString()}, ptr ${this.pointer.id}`;
  }
}

export class NIRStoreInst extends NIRInstruction {
  constructor(
    value: NIRValue,
    pointer: NIRValue
  ) {
    super(NIROpcode.STORE, NIRTypes.void(), undefined);
    this.addOperand(value);
    this.addOperand(pointer);
  }

  public get value(): NIRValue {
    return this.operands[0];
  }

  public get pointer(): NIRValue {
    return this.operands[1];
  }

  public toString(): string {
    return `store ${this.value.type.toString()} ${this.value.id}, ptr ${this.pointer.id}`;
  }
}

export class NIRGetElementPtrInst extends NIRInstruction {
  constructor(
    public basePtr: NIRValue,
    public indices: NIRValue[],
    resultType: NIRType,
    name?: string
  ) {
    super(NIROpcode.GEP, resultType, name);
    this.addOperand(basePtr);
    for (const idx of indices) {
      this.addOperand(idx);
    }
  }

  public toString(): string {
    const idxStr = this.indices.map((i) => `${i.type.toString()} ${i.id}`).join(', ');
    return `${this.id} = gep ${this.basePtr.type.toString()} ${this.basePtr.id}, ${idxStr}`;
  }
}

export class NIRCallInst extends NIRInstruction {
  constructor(
    public calleeName: string,
    public args: NIRValue[],
    returnType: NIRType,
    name?: string
  ) {
    super(NIROpcode.CALL, returnType, returnType.isVoid() ? undefined : name);
    for (const arg of args) {
      this.addOperand(arg);
    }
  }

  public toString(): string {
    const argsStr = this.args.map((a) => `${a.type.toString()} ${a.id}`).join(', ');
    if (this.type.isVoid()) {
      return `call void @${this.calleeName}(${argsStr})`;
    }
    return `${this.id} = call ${this.type.toString()} @${this.calleeName}(${argsStr})`;
  }

  public override toJSON(): any {
    return {
      ...super.toJSON(),
      calleeName: this.calleeName,
    };
  }
}

export class NIRPhiInst extends NIRInstruction {
  public readonly incoming: Array<{ value: NIRValue; block: any }> = [];

  constructor(type: NIRType, name?: string) {
    super(NIROpcode.PHI, type, name);
  }

  public addIncoming(value: NIRValue, block: any): void {
    const idx = this.operands.length;
    this.incoming.push({ value, block });
    this.addOperand(value);
  }

  public override setOperand(index: number, val: NIRValue): void {
    super.setOperand(index, val);
    if (index >= 0 && index < this.incoming.length) {
      this.incoming[index].value = val;
    }
  }

  public getIncomingValueForBlock(block: any): NIRValue | undefined {
    const found = this.incoming.find((inc) => inc.block === block || inc.block.id === block.id);
    return found ? found.value : undefined;
  }

  public setIncomingValue(block: any, value: NIRValue): void {
    const idx = this.incoming.findIndex((inc) => inc.block === block || inc.block.id === block.id);
    if (idx !== -1) {
      this.incoming[idx].value = value;
      this.setOperand(idx, value);
    } else {
      this.addIncoming(value, block);
    }
  }

  public toString(): string {
    const branches = this.incoming
      .map((inc) => `[ ${inc.value.id}, %${inc.block ? inc.block.label : 'unknown'} ]`)
      .join(', ');
    return `${this.id} = phi ${this.type.toString()} ${branches}`;
  }

  public override toJSON(): any {
    return {
      ...super.toJSON(),
      incoming: this.incoming.map((inc) => ({
        value: inc.value.id,
        block: inc.block ? inc.block.id : null,
      })),
    };
  }
}

export class NIRCastInst extends NIRInstruction {
  constructor(
    public readonly castKind: NIRCastKind,
    public sourceValue: NIRValue,
    targetType: NIRType,
    name?: string
  ) {
    super(NIROpcode.CAST, targetType, name);
    this.addOperand(sourceValue);
  }

  public toString(): string {
    return `${this.id} = ${this.castKind} ${this.sourceValue.type.toString()} ${this.sourceValue.id} to ${this.type.toString()}`;
  }

  public override toJSON(): any {
    return {
      ...super.toJSON(),
      castKind: this.castKind,
    };
  }
}
