/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - Fungsi NIR
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { NIRBasicBlock } from './basic-block';
import { NIRReturnInst } from './terminator';
import { NIRType, NIRTypes } from './type';
import { NIRParameter, NIRValue, NIRValueKind } from './value';

export class NIRFunction extends NIRValue {
  public parent: any = null; // NIRModule
  public readonly parameters: NIRParameter[] = [];
  public readonly basicBlocks: NIRBasicBlock[] = [];
  public isDeclaration: boolean = false;

  constructor(
    public readonly name: string,
    public returnType: NIRType,
    paramTypes: Array<{ name: string; type: NIRType }> = [],
    parent?: any
  ) {
    const fnType = NIRTypes.function(
      paramTypes.map((p) => p.type),
      returnType
    );
    super(NIRValueKind.INSTRUCTION, fnType, `@${name}`);

    for (let i = 0; i < paramTypes.length; i++) {
      const param = new NIRParameter(paramTypes[i].name, paramTypes[i].type, i);
      this.parameters.push(param);
    }

    if (parent) {
      this.parent = parent;
      parent.addFunction(this);
    }
  }

  public addBasicBlock(bb: NIRBasicBlock): void {
    bb.parent = this;
    if (!this.basicBlocks.includes(bb)) {
      this.basicBlocks.push(bb);
    }
  }

  public createBasicBlock(label: string): NIRBasicBlock {
    const bb = new NIRBasicBlock(label, this);
    return bb;
  }

  public removeBasicBlock(bb: NIRBasicBlock): void {
    const idx = this.basicBlocks.indexOf(bb);
    if (idx !== -1) {
      this.basicBlocks.splice(idx, 1);
      bb.parent = null;
    }
    this.rebuildCFG();
  }

  public getEntryBlock(): NIRBasicBlock | undefined {
    return this.basicBlocks[0];
  }

  public getExitBlocks(): NIRBasicBlock[] {
    return this.basicBlocks.filter((bb) => bb.terminator instanceof NIRReturnInst);
  }

  public rebuildCFG(): void {
    // Reset all predecessors and successors
    for (const bb of this.basicBlocks) {
      bb.predecessors = [];
      bb.updateSuccessors();
    }

    // Connect predecessors from successors
    for (const bb of this.basicBlocks) {
      for (const succ of bb.successors) {
        if (!succ.predecessors.includes(bb)) {
          succ.predecessors.push(bb);
        }
      }
    }
  }

  public getBasicBlockByLabel(label: string): NIRBasicBlock | undefined {
    return this.basicBlocks.find((bb) => bb.label === label);
  }

  public toString(): string {
    const paramsStr = this.parameters.map((p) => p.toString()).join(', ');
    if (this.isDeclaration) {
      return `declare ${this.returnType.toString()} @${this.name}(${paramsStr})`;
    }

    const blocksStr = this.basicBlocks.map((bb) => bb.toString()).join('\n\n');
    return `define ${this.returnType.toString()} @${this.name}(${paramsStr}) {\n${blocksStr}\n}`;
  }

  public override toJSON(): any {
    return {
      ...super.toJSON(),
      name: this.name,
      returnType: this.returnType.toJSON(),
      parameters: this.parameters.map((p) => p.toJSON()),
      isDeclaration: this.isDeclaration,
      basicBlocks: this.basicBlocks.map((b) => b.toJSON()),
    };
  }
}
