/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - Basic Block
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { NIRInstruction, NIRPhiInst } from './instruction';
import { NIRTerminator } from './terminator';
import { NIRTypes } from './type';
import { NIRValue, NIRValueKind } from './value';

export class NIRBasicBlock extends NIRValue {
  public parent: any = null; // NIRFunction
  public readonly phiNodes: NIRPhiInst[] = [];
  public readonly instructions: NIRInstruction[] = [];
  public terminator: NIRTerminator | null = null;
  public predecessors: NIRBasicBlock[] = [];
  public successors: NIRBasicBlock[] = [];

  constructor(
    public label: string,
    parent?: any
  ) {
    super(NIRValueKind.BASIC_BLOCK, NIRTypes.void(), `%bb.${label}`);
    if (parent) {
      this.parent = parent;
      parent.addBasicBlock(this);
    }
  }

  public addInstruction(inst: NIRInstruction): void {
    if (inst instanceof NIRPhiInst) {
      inst.parent = this;
      this.phiNodes.push(inst);
      return;
    }

    if (inst instanceof NIRTerminator) {
      this.setTerminator(inst);
      return;
    }

    inst.parent = this;
    this.instructions.push(inst);
  }

  public getInstructions(): NIRInstruction[] {
    const list: NIRInstruction[] = [...this.phiNodes, ...this.instructions];
    if (this.terminator) {
      list.push(this.terminator);
    }
    return list;
  }

  public insertInstructionBefore(newInst: NIRInstruction, beforeInst: NIRInstruction): void {
    newInst.parent = this;
    if (newInst instanceof NIRPhiInst) {
      const idx = this.phiNodes.indexOf(beforeInst as any);
      if (idx !== -1) {
        this.phiNodes.splice(idx, 0, newInst);
      } else {
        this.phiNodes.push(newInst);
      }
      return;
    }

    const idx = this.instructions.indexOf(beforeInst);
    if (idx !== -1) {
      this.instructions.splice(idx, 0, newInst);
    } else {
      this.instructions.push(newInst);
    }
  }

  public removeInstruction(inst: NIRInstruction): void {
    if (inst instanceof NIRPhiInst) {
      const idx = this.phiNodes.indexOf(inst);
      if (idx !== -1) {
        this.phiNodes.splice(idx, 1);
        inst.parent = null;
      }
      return;
    }

    if (inst === this.terminator) {
      this.terminator = null;
      inst.parent = null;
      return;
    }

    const idx = this.instructions.indexOf(inst);
    if (idx !== -1) {
      this.instructions.splice(idx, 1);
      inst.parent = null;
    }
  }

  public setTerminator(term: NIRTerminator): void {
    if (this.terminator) {
      this.terminator.parent = null;
    }
    this.terminator = term;
    term.parent = this;
    this.updateSuccessors();
  }

  public updateSuccessors(): void {
    if (!this.terminator) {
      this.successors = [];
      return;
    }
    this.successors = this.terminator.getSuccessors();
  }

  public hasTerminator(): boolean {
    return this.terminator !== null;
  }

  public isEntryBlock(): boolean {
    if (!this.parent) return false;
    return this.parent.getEntryBlock() === this;
  }

  public getAllInstructions(): NIRInstruction[] {
    const list: NIRInstruction[] = [...this.phiNodes, ...this.instructions];
    if (this.terminator) {
      list.push(this.terminator);
    }
    return list;
  }

  public toString(): string {
    const lines: string[] = [`${this.label}:`];
    for (const phi of this.phiNodes) {
      lines.push(`  ${phi.toString()}`);
    }
    for (const inst of this.instructions) {
      lines.push(`  ${inst.toString()}`);
    }
    if (this.terminator) {
      lines.push(`  ${this.terminator.toString()}`);
    }
    return lines.join('\n');
  }

  public override toJSON(): any {
    return {
      ...super.toJSON(),
      label: this.label,
      phiNodes: this.phiNodes.map((p) => p.toJSON()),
      instructions: this.instructions.map((i) => i.toJSON()),
      terminator: this.terminator ? this.terminator.toJSON() : null,
      predecessors: this.predecessors.map((p) => p.label),
      successors: this.successors.map((s) => s.label),
    };
  }
}
