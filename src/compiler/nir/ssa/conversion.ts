/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - Konversi SSA (Mem2Reg)
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { NIRBasicBlock } from '../basic-block';
import { ControlFlowGraph } from '../cfg/control-flow-graph';
import { DominatorTree } from '../cfg/dominator';
import { NIRFunction } from '../function';
import {
  NIRAllocaInst,
  NIRInstruction,
  NIRLoadInst,
  NIROpcode,
  NIRPhiInst,
  NIRStoreInst,
} from '../instruction';
import { NIRConstants } from '../constant';
import { NIRValue } from '../value';
import { PhiHelper } from './phi';

export class SSAConverter {
  constructor(public readonly fn: NIRFunction) {}

  public run(): boolean {
    const cfg = new ControlFlowGraph(this.fn);
    const domTree = new DominatorTree(cfg);

    // 1. Kumpulkan semua instruksi alloca yang dapat dipromosikan ke register SSA
    const allocas: NIRAllocaInst[] = [];
    for (const bb of this.fn.basicBlocks) {
      for (const inst of bb.instructions) {
        if (inst instanceof NIRAllocaInst) {
          if (this.isPromotableAlloca(inst)) {
            allocas.push(inst);
          }
        }
      }
    }

    if (allocas.length === 0) return false;

    // 2. Kumpulkan blok definisi (store) untuk setiap alloca
    const defBlocks = new Map<NIRAllocaInst, Set<NIRBasicBlock>>();
    for (const alloca of allocas) {
      defBlocks.set(alloca, new Set());
    }

    for (const bb of this.fn.basicBlocks) {
      for (const inst of bb.instructions) {
        if (inst instanceof NIRStoreInst) {
          const ptr = inst.pointer;
          if (ptr instanceof NIRAllocaInst && defBlocks.has(ptr)) {
            defBlocks.get(ptr)!.add(bb);
          }
        }
      }
    }

    // 3. Sisipkan Phi Node pada Iterated Dominance Frontier (IDF)
    const phiNodes = new Map<NIRAllocaInst, Map<NIRBasicBlock, NIRPhiInst>>();
    for (const alloca of allocas) {
      phiNodes.set(alloca, new Map());
      const defs = defBlocks.get(alloca)!;
      const workQueue = Array.from(defs);
      const inserted = new Set<NIRBasicBlock>();

      while (workQueue.length > 0) {
        const d = workQueue.shift()!;
        const df = domTree.getDominanceFrontier(d);
        for (const frontier of df) {
          if (!inserted.has(frontier)) {
            inserted.add(frontier);
            const phi = PhiHelper.createPhiNode(
              frontier,
              alloca.allocatedType,
              `${alloca.id.replace('%', '')}.phi`
            );
            phiNodes.get(alloca)!.set(frontier, phi);

            if (!defs.has(frontier)) {
              workQueue.push(frontier);
            }
          }
        }
      }
    }

    // 4. Penggantian nama variabel (Renaming) melalui penelusuran Dominator Tree
    const valueStacks = new Map<NIRAllocaInst, NIRValue[]>();
    for (const alloca of allocas) {
      valueStacks.set(alloca, [NIRConstants.null(alloca.allocatedType)]);
    }

    const deadInstructions = new Set<NIRInstruction>();

    const rename = (bb: NIRBasicBlock) => {
      const pushes = new Map<NIRAllocaInst, number>();
      for (const alloca of allocas) {
        pushes.set(alloca, 0);
      }

      // a. Periksa Phi node pada blok ini
      for (const alloca of allocas) {
        const phi = phiNodes.get(alloca)?.get(bb);
        if (phi) {
          valueStacks.get(alloca)!.push(phi);
          pushes.set(alloca, (pushes.get(alloca) || 0) + 1);
        }
      }

      // b. Proses instruksi dalam blok
      for (const inst of bb.instructions) {
        if (inst instanceof NIRLoadInst) {
          const ptr = inst.pointer;
          if (ptr instanceof NIRAllocaInst && valueStacks.has(ptr)) {
            const stack = valueStacks.get(ptr)!;
            const currentVal = stack[stack.length - 1];
            inst.replaceAllUsesWith(currentVal);
            deadInstructions.add(inst);
          }
        } else if (inst instanceof NIRStoreInst) {
          const ptr = inst.pointer;
          if (ptr instanceof NIRAllocaInst && valueStacks.has(ptr)) {
            const stack = valueStacks.get(ptr)!;
            stack.push(inst.value);
            pushes.set(ptr, (pushes.get(ptr) || 0) + 1);
            deadInstructions.add(inst);
          }
        }
      }

      // c. Isi incoming operands pada Phi node di semua successor
      for (const succ of bb.successors) {
        for (const alloca of allocas) {
          const phi = phiNodes.get(alloca)?.get(succ);
          if (phi) {
            const stack = valueStacks.get(alloca)!;
            const currentVal = stack[stack.length - 1];
            phi.addIncoming(currentVal, bb);
          }
        }
      }

      // d. Telusuri anak-anak dalam Dominator Tree secara rekursif
      const children = domTree.getDomChildren(bb);
      for (const child of children) {
        rename(child);
      }

      // e. Pop nilai dari stack ketika keluar dari blok
      for (const alloca of allocas) {
        const count = pushes.get(alloca) || 0;
        const stack = valueStacks.get(alloca)!;
        for (let i = 0; i < count; i++) {
          stack.pop();
        }
      }
    };

    const entry = this.fn.getEntryBlock();
    if (entry) {
      rename(entry);
    }

    // 5. Hapus instruksi alloca, load, dan store yang sudah dipromosikan
    for (const alloca of allocas) {
      deadInstructions.add(alloca);
    }

    for (const bb of this.fn.basicBlocks) {
      for (const dead of deadInstructions) {
        bb.removeInstruction(dead);
      }
    }

    // 6. Sederhanakan Phi Node yang trivial
    for (const bb of this.fn.basicBlocks) {
      const phis = [...bb.phiNodes];
      for (const phi of phis) {
        const simplified = PhiHelper.simplifyTrivialPhi(phi);
        if (simplified) {
          phi.replaceAllUsesWith(simplified);
          bb.removeInstruction(phi);
        }
      }
    }

    return true;
  }

  private isPromotableAlloca(alloca: NIRAllocaInst): boolean {
    for (const use of alloca.uses) {
      const user = use.user;
      if (user instanceof NIRLoadInst) {
        if (user.pointer !== alloca) return false;
      } else if (user instanceof NIRStoreInst) {
        if (user.pointer !== alloca) return false;
      } else {
        // Digunakan di luar load/store (misal: pointer escape) -> tidak promotable
        return false;
      }
    }
    return true;
  }
}
