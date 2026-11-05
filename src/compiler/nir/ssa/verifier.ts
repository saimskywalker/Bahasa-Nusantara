/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - Verifikator Bentuk SSA
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { NIRBasicBlock } from '../basic-block';
import { ControlFlowGraph } from '../cfg/control-flow-graph';
import { DominatorTree } from '../cfg/dominator';
import { NIRFunction } from '../function';
import { NIRInstruction, NIRPhiInst } from '../instruction';
import { NIRParameter, NIRValueKind } from '../value';
import { PhiHelper } from './phi';

export interface SSAVerificationResult {
  valid: boolean;
  errors: string[];
}

export class SSAVerifier {
  constructor(public readonly fn: NIRFunction) {}

  public verify(): SSAVerificationResult {
    const errors: string[] = [];
    const definedValues = new Set<string>();
    const cfg = new ControlFlowGraph(this.fn);
    const domTree = new DominatorTree(cfg);

    // 1. Periksa parameter fungsi
    for (const param of this.fn.parameters) {
      if (definedValues.has(param.id)) {
        errors.push(`Definisi ganda SSA pada parameter '${param.id}'`);
      }
      definedValues.add(param.id);
    }

    // 2. Kumpulkan semua nilai terdefinisi dan periksa keunikan
    for (const bb of this.fn.basicBlocks) {
      for (const inst of bb.getAllInstructions()) {
        if (!inst.type.isVoid()) {
          if (definedValues.has(inst.id)) {
            errors.push(`Definisi ganda SSA pada instruksi '${inst.id}' di blok '${bb.label}'`);
          }
          definedValues.add(inst.id);
        }
      }
    }

    // 3. Periksa aturan Phi Node dan Dominance
    for (const bb of this.fn.basicBlocks) {
      // a. Phi node harus berada di bagian terdepan blok
      let seenNonPhi = false;
      for (const inst of bb.getAllInstructions()) {
        if (inst instanceof NIRPhiInst) {
          if (seenNonPhi) {
            errors.push(`Instruksi Phi '${inst.id}' muncul setelah instruksi non-phi di blok '${bb.label}'`);
          }

          // b. Validasi kesesuaian incoming blocks dengan CFG predecessors
          const preds = bb.predecessors;
          for (const inc of inst.incoming) {
            if (!preds.includes(inc.block)) {
              errors.push(
                `Phi node '${inst.id}' memiliki incoming block '${inc.block ? inc.block.label : 'null'}' yang bukan predecessor dari '${bb.label}'`
              );
            }
          }

          for (const pred of preds) {
            const hasIncoming = inst.incoming.some((inc) => inc.block === pred);
            if (!hasIncoming) {
              errors.push(
                `Phi node '${inst.id}' di blok '${bb.label}' kehilangan nilai incoming untuk predecessor '${pred.label}'`
              );
            }
          }
        } else {
          seenNonPhi = true;
        }

        // c. Aturan Dominansi untuk penggunaan operand non-phi
        if (!(inst instanceof NIRPhiInst)) {
          const ops = inst.getOperands();
          for (const op of ops) {
            if (op.kind === NIRValueKind.INSTRUCTION) {
              const defInst = op as NIRInstruction;
              const defBlock = defInst.parent;
              if (defBlock && defBlock !== bb) {
                if (!domTree.dominates(defBlock, bb)) {
                  errors.push(
                    `Pelanggaran SSA: Definisi '${defInst.id}' di blok '${defBlock.label}' tidak mendominasi penggunaan di blok '${bb.label}'`
                  );
                }
              }
            }
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
