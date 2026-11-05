/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - Analisis Dominator & Dominance Frontier
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { NIRBasicBlock } from '../basic-block';
import { ControlFlowGraph } from './control-flow-graph';

export class DominatorTree {
  private idomMap: Map<NIRBasicBlock, NIRBasicBlock> = new Map();
  private domChildrenMap: Map<NIRBasicBlock, NIRBasicBlock[]> = new Map();
  private domFrontierMap: Map<NIRBasicBlock, Set<NIRBasicBlock>> = new Map();
  private reachable: NIRBasicBlock[] = [];

  constructor(public readonly cfg: ControlFlowGraph) {
    this.compute();
  }

  public compute(): void {
    this.idomMap.clear();
    this.domChildrenMap.clear();
    this.domFrontierMap.clear();

    this.reachable = this.cfg.getReachableBlocks();
    const entry = this.cfg.getEntryBlock();
    if (!entry || this.reachable.length === 0) return;

    // Index blocks in reverse post-order (RPO)
    const rpo = this.computeRPO(entry);
    const rpoIndex = new Map<NIRBasicBlock, number>();
    for (let i = 0; i < rpo.length; i++) {
      rpoIndex.set(rpo[i], i);
      this.domChildrenMap.set(rpo[i], []);
      this.domFrontierMap.set(rpo[i], new Set());
    }

    // Algoritma Iteratif Cooper, Harvey & Kennedy (2001)
    const idom = new Map<NIRBasicBlock, NIRBasicBlock>();
    idom.set(entry, entry);

    const intersect = (b1: NIRBasicBlock, b2: NIRBasicBlock): NIRBasicBlock => {
      let finger1 = b1;
      let finger2 = b2;
      while (finger1 !== finger2) {
        while ((rpoIndex.get(finger1) ?? 0) > (rpoIndex.get(finger2) ?? 0)) {
          finger1 = idom.get(finger1)!;
        }
        while ((rpoIndex.get(finger2) ?? 0) > (rpoIndex.get(finger1) ?? 0)) {
          finger2 = idom.get(finger2)!;
        }
      }
      return finger1;
    };

    let changed = true;
    while (changed) {
      changed = false;
      // Iterasi untuk semua blok selain entry dalam urutan RPO
      for (let i = 1; i < rpo.length; i++) {
        const b = rpo[i];
        const preds = b.predecessors.filter((p) => idom.has(p));
        if (preds.length === 0) continue;

        let newIdom = preds[0];
        for (let j = 1; j < preds.length; j++) {
          const p = preds[j];
          if (idom.has(p)) {
            newIdom = intersect(p, newIdom);
          }
        }

        if (idom.get(b) !== newIdom) {
          idom.set(b, newIdom);
          changed = true;
        }
      }
    }

    // Simpan idom (kecuali entry terhadap dirinya sendiri)
    for (const [b, parent] of idom.entries()) {
      if (b !== entry) {
        this.idomMap.set(b, parent);
        const children = this.domChildrenMap.get(parent) || [];
        children.push(b);
        this.domChildrenMap.set(parent, children);
      }
    }

    // Hitung Dominance Frontier (DF)
    for (const b of this.reachable) {
      if (b.predecessors.length >= 2) {
        for (const p of b.predecessors) {
          let runner = p;
          while (runner && runner !== this.getIdom(b)) {
            const dfSet = this.domFrontierMap.get(runner);
            if (dfSet) {
              dfSet.add(b);
            }
            runner = this.getIdom(runner)!;
          }
        }
      }
    }
  }

  private computeRPO(entry: NIRBasicBlock): NIRBasicBlock[] {
    const visited = new Set<NIRBasicBlock>();
    const postOrder: NIRBasicBlock[] = [];

    const dfs = (b: NIRBasicBlock) => {
      visited.add(b);
      for (const succ of b.successors) {
        if (!visited.has(succ)) {
          dfs(succ);
        }
      }
      postOrder.push(b);
    };

    dfs(entry);
    return postOrder.reverse();
  }

  public getIdom(b: NIRBasicBlock): NIRBasicBlock | undefined {
    return this.idomMap.get(b);
  }

  public getDomChildren(b: NIRBasicBlock): NIRBasicBlock[] {
    return this.domChildrenMap.get(b) || [];
  }

  public getDominanceFrontier(b: NIRBasicBlock): Set<NIRBasicBlock> {
    return this.domFrontierMap.get(b) || new Set();
  }

  public dominates(a: NIRBasicBlock, b: NIRBasicBlock): boolean {
    if (a === b) return true;
    let curr = this.getIdom(b);
    while (curr) {
      if (curr === a) return true;
      if (curr === this.cfg.getEntryBlock()) break;
      curr = this.getIdom(curr);
    }
    return false;
  }

  public strictlyDominates(a: NIRBasicBlock, b: NIRBasicBlock): boolean {
    return a !== b && this.dominates(a, b);
  }
}
