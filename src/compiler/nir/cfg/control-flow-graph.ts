/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - Control Flow Graph (CFG)
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { NIRBasicBlock } from '../basic-block';
import { NIRFunction } from '../function';

export interface CFGValidationResult {
  valid: boolean;
  errors: string[];
  unreachableBlocks: NIRBasicBlock[];
}

export class ControlFlowGraph {
  private blockMap: Map<string, NIRBasicBlock> = new Map();

  constructor(public readonly fn: NIRFunction) {
    this.rebuild();
  }

  public rebuild(): void {
    this.blockMap.clear();
    for (const bb of this.fn.basicBlocks) {
      this.blockMap.set(bb.label, bb);
    }
    this.fn.rebuildCFG();
  }

  public getEntryBlock(): NIRBasicBlock | undefined {
    return this.fn.getEntryBlock();
  }

  public getExitBlocks(): NIRBasicBlock[] {
    return this.fn.getExitBlocks();
  }

  public getSuccessors(bb: NIRBasicBlock): NIRBasicBlock[] {
    return bb.successors;
  }

  public getPredecessors(bb: NIRBasicBlock): NIRBasicBlock[] {
    return bb.predecessors;
  }

  public getReachableBlocks(): NIRBasicBlock[] {
    const entry = this.getEntryBlock();
    if (!entry) return [];

    const visited = new Set<NIRBasicBlock>();
    const queue: NIRBasicBlock[] = [entry];
    visited.add(entry);

    while (queue.length > 0) {
      const curr = queue.shift()!;
      for (const succ of curr.successors) {
        if (!visited.has(succ)) {
          visited.add(succ);
          queue.push(succ);
        }
      }
    }

    return Array.from(visited);
  }

  public hasPath(from: NIRBasicBlock, to: NIRBasicBlock): boolean {
    const visited = new Set<NIRBasicBlock>();
    const queue: NIRBasicBlock[] = [from];
    visited.add(from);

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (curr === to) return true;
      for (const succ of curr.successors) {
        if (!visited.has(succ)) {
          visited.add(succ);
          queue.push(succ);
        }
      }
    }

    return false;
  }

  public validate(): CFGValidationResult {
    const errors: string[] = [];
    const reachable = new Set(this.getReachableBlocks());
    const unreachableBlocks: NIRBasicBlock[] = [];

    for (const bb of this.fn.basicBlocks) {
      if (!reachable.has(bb) && bb !== this.getEntryBlock()) {
        unreachableBlocks.push(bb);
      }

      // 1. Validasi Terminator
      if (!bb.hasTerminator()) {
        errors.push(`BasicBlock '${bb.label}' dalam fungsi '@${this.fn.name}' tidak memiliki terminator`);
      }

      // 2. Validasi konsistensi Predecessor & Successor
      for (const succ of bb.successors) {
        if (!succ.predecessors.includes(bb)) {
          errors.push(
            `Ketidakkonsistenan CFG: '${succ.label}' adalah successor dari '${bb.label}', tetapi '${bb.label}' bukan predecessor dari '${succ.label}'`
          );
        }
      }

      for (const pred of bb.predecessors) {
        if (!pred.successors.includes(bb)) {
          errors.push(
            `Ketidakkonsistenan CFG: '${pred.label}' adalah predecessor dari '${bb.label}', tetapi '${bb.label}' bukan successor dari '${pred.label}'`
          );
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      unreachableBlocks,
    };
  }
}
