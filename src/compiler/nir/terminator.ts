/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - Instruksi Terminator
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { NIRInstruction, NIROpcode } from './instruction';
import { NIRType, NIRTypes } from './type';
import { NIRValue } from './value';

export abstract class NIRTerminator extends NIRInstruction {
  public abstract getSuccessors(): any[]; // NIRBasicBlock[]
}

export class NIRReturnInst extends NIRTerminator {
  constructor(returnValue?: NIRValue) {
    super(NIROpcode.RET, returnValue ? returnValue.type : NIRTypes.void(), undefined);
    if (returnValue) {
      this.addOperand(returnValue);
    }
  }

  public get returnValue(): NIRValue | undefined {
    return this.operands[0];
  }

  public getSuccessors(): any[] {
    return [];
  }

  public toString(): string {
    if (!this.returnValue) {
      return 'ret void';
    }
    return `ret ${this.returnValue.type.toString()} ${this.returnValue.id}`;
  }

  public override toJSON(): any {
    return {
      ...super.toJSON(),
      hasReturnValue: !!this.returnValue,
    };
  }
}

export class NIRBranchInst extends NIRTerminator {
  constructor(targetBlock: any) {
    super(NIROpcode.BR, NIRTypes.void(), undefined);
    if (targetBlock) {
      this.addOperand(targetBlock);
    }
  }

  public get targetBlock(): any {
    return this.operands[0];
  }

  public getSuccessors(): any[] {
    return this.targetBlock ? [this.targetBlock] : [];
  }

  public toString(): string {
    const label = this.targetBlock ? this.targetBlock.label : 'unknown';
    return `br label %${label}`;
  }

  public override toJSON(): any {
    return {
      ...super.toJSON(),
      targetBlock: this.targetBlock ? this.targetBlock.id : null,
    };
  }
}

export class NIRCondBranchInst extends NIRTerminator {
  constructor(
    condition: NIRValue,
    thenBlock: any,
    elseBlock: any
  ) {
    super(NIROpcode.BR_COND, NIRTypes.void(), undefined);
    this.addOperand(condition);
    if (thenBlock) this.addOperand(thenBlock);
    if (elseBlock) this.addOperand(elseBlock);
  }

  public get condition(): NIRValue {
    return this.operands[0];
  }

  public get thenBlock(): any {
    return this.operands[1];
  }

  public get elseBlock(): any {
    return this.operands[2];
  }

  public getSuccessors(): any[] {
    const res: any[] = [];
    if (this.thenBlock) res.push(this.thenBlock);
    if (this.elseBlock) res.push(this.elseBlock);
    return res;
  }

  public toString(): string {
    const thenLabel = this.thenBlock ? this.thenBlock.label : 'unknown';
    const elseLabel = this.elseBlock ? this.elseBlock.label : 'unknown';
    return `br_cond i1 ${this.condition.id}, label %${thenLabel}, label %${elseLabel}`;
  }

  public override toJSON(): any {
    return {
      ...super.toJSON(),
      thenBlock: this.thenBlock ? this.thenBlock.id : null,
      elseBlock: this.elseBlock ? this.elseBlock.id : null,
    };
  }
}

export class NIRUnreachableInst extends NIRTerminator {
  constructor() {
    super(NIROpcode.UNREACHABLE, NIRTypes.void(), undefined);
  }

  public getSuccessors(): any[] {
    return [];
  }

  public toString(): string {
    return 'unreachable';
  }
}
