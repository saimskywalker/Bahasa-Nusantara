/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - Pass Dead Code Elimination (DCE)
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { NIRFunction } from '../function';
import { NIRInstruction, NIROpcode } from '../instruction';
import { NIRFunctionPass } from './pass';

export class DeadCodeEliminationPass extends NIRFunctionPass {
  public readonly name = 'dead-code-elimination';

  public runOnFunction(fn: NIRFunction): boolean {
    let modified = false;
    let iterationChanged = true;

    while (iterationChanged) {
      iterationChanged = false;

      for (const bb of fn.basicBlocks) {
        const instructions = [...bb.instructions];
        for (const inst of instructions) {
          if (this.isDead(inst)) {
            // Hapus operand uses sebelum menghapus instruksi
            for (let i = 0; i < inst.getOperands().length; i++) {
              const op = inst.getOperand(i);
              if (op) {
                op.removeUse(inst, i);
              }
            }
            bb.removeInstruction(inst);
            modified = true;
            iterationChanged = true;
          }
        }

        // Periksa phi nodes
        const phis = [...bb.phiNodes];
        for (const phi of phis) {
          if (!phi.hasUsers()) {
            for (let i = 0; i < phi.getOperands().length; i++) {
              const op = phi.getOperand(i);
              if (op) {
                op.removeUse(phi, i);
              }
            }
            bb.removeInstruction(phi);
            modified = true;
            iterationChanged = true;
          }
        }
      }
    }

    return modified;
  }

  private isDead(inst: NIRInstruction): boolean {
    // Instruksi dengan efek samping tidak boleh dihapus
    if (inst.isTerminator()) return false;
    if (inst.opcode === NIROpcode.STORE) return false;
    if (inst.opcode === NIROpcode.CALL) return false; // Panggilan fungsi berpotensi memiliki efek samping

    // Jika tidak memiliki user dan bertipe non-void, instruksi ini adalah kode mati
    return !inst.hasUsers();
  }
}
