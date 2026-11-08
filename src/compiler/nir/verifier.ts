/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - NIR Verifier
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { NIRBasicBlock } from './basic-block';
import { NIRFunction } from './function';
import {
  NIRBinaryInst,
  NIRCallInst,
  NIRCastInst,
  NIRFCmpInst,
  NIRGetElementPtrInst,
  NIRICmpInst,
  NIRInstruction,
  NIRLoadInst,
  NIROpcode,
  NIRPhiInst,
  NIRStoreInst,
} from './instruction';
import { NIRModule } from './module';
import { SSAVerifier } from './ssa/verifier';
import {
  NIRBranchInst,
  NIRCondBranchInst,
  NIRReturnInst,
  NIRTerminator,
} from './terminator';
import { NIRTypeKind } from './type';

export interface NIRVerificationResult {
  valid: boolean;
  isValid: boolean;
  errors: string[];
}

export class NIRVerifier {
  public verifyModule(mod: NIRModule): NIRVerificationResult {
    return NIRVerifier.verifyModule(mod);
  }

  public verifyFunction(fn: NIRFunction): NIRVerificationResult {
    return NIRVerifier.verifyFunction(fn);
  }

  public static verifyModule(mod: NIRModule): NIRVerificationResult {
    const errors: string[] = [];

    // 1. Validasi Variabel Global
    const globalNames = new Set<string>();
    for (const [name, global] of mod.globals.entries()) {
      if (globalNames.has(name)) {
        errors.push(`Definisi ganda variabel global '@${name}' pada modul '${mod.name}'`);
      }
      globalNames.add(name);

      if (global.type.isVoid()) {
        errors.push(`Variabel global '@${name}' tidak boleh bertipe void`);
      }
    }

    // 2. Validasi Fungsi-Fungsi
    const funcNames = new Set<string>();
    for (const [name, fn] of mod.functions.entries()) {
      if (funcNames.has(name)) {
        errors.push(`Definisi ganda fungsi '@${name}' pada modul '${mod.name}'`);
      }
      funcNames.add(name);

      const fnRes = this.verifyFunction(fn);
      if (!fnRes.valid) {
        errors.push(...fnRes.errors.map((e) => `[@${name}]: ${e}`));
      }
    }

    return {
      valid: errors.length === 0,
      isValid: errors.length === 0,
      errors,
    };
  }

  public static verifyFunction(fn: NIRFunction): NIRVerificationResult {
    const errors: string[] = [];

    if (fn.isDeclaration) {
      if (fn.basicBlocks.length > 0) {
        errors.push(`Fungsi deklarasi eksternal '@${fn.name}' tidak boleh memiliki basic block`);
      }
      return { valid: errors.length === 0, isValid: errors.length === 0, errors };
    }

    if (fn.basicBlocks.length === 0) {
      errors.push(`Fungsi terdefinisi '@${fn.name}' harus memiliki minimal 1 basic block`);
      return { valid: false, isValid: false, errors };
    }

    // 1. Validasi Entry Block
    const entry = fn.getEntryBlock()!;
    if (entry.predecessors.length > 0) {
      errors.push(`Entry block '%${entry.label}' tidak boleh memiliki predecessor`);
    }

    // 2. Validasi Basic Block
    const blockLabels = new Set<string>();
    for (const bb of fn.basicBlocks) {
      if (blockLabels.has(bb.label)) {
        errors.push(`Label basic block duplikat '%${bb.label}' dalam fungsi '@${fn.name}'`);
      }
      blockLabels.add(bb.label);

      // Pastikan ada terminator
      if (!bb.terminator) {
        errors.push(`Basic block '%${bb.label}' tidak memiliki terminator`);
      }

      // Validasi setiap instruksi dalam basic block
      const allInsts = bb.getAllInstructions();
      for (let i = 0; i < allInsts.length; i++) {
        const inst = allInsts[i];

        // Terminator hanya boleh berada di posisi paling akhir
        if (inst.isTerminator() && i !== allInsts.length - 1) {
          errors.push(`Instruksi terminator muncul di tengah basic block '%${bb.label}'`);
        }

        // Validasi aturan spesifik tiap opcode
        this.verifyInstruction(inst, fn, bb, errors);
      }
    }

    // 3. Jalankan SSA Verifier
    const ssaVerifier = new SSAVerifier(fn);
    const ssaRes = ssaVerifier.verify();
    if (!ssaRes.valid) {
      errors.push(...ssaRes.errors);
    }

    return {
      valid: errors.length === 0,
      isValid: errors.length === 0,
      errors,
    };
  }

  private static verifyInstruction(
    inst: NIRInstruction,
    fn: NIRFunction,
    bb: NIRBasicBlock,
    errors: string[]
  ): void {
    switch (inst.opcode) {
      case NIROpcode.ADD:
      case NIROpcode.SUB:
      case NIROpcode.MUL:
      case NIROpcode.SDIV:
      case NIROpcode.FDIV:
      case NIROpcode.SREM: {
        const bin = inst as NIRBinaryInst;
        if (!bin.lhs || !bin.rhs) {
          errors.push(`Instruksi ${inst.opcode} '${inst.id}' kekurangan operand`);
          break;
        }
        if (!bin.lhs.type.equals(bin.rhs.type)) {
          errors.push(
            `Ketidakcocokan tipe operand pada ${inst.opcode} '${inst.id}': ${bin.lhs.type.toString()} vs ${bin.rhs.type.toString()}`
          );
        }
        if (bin.lhs.type.isVoid() || bin.rhs.type.isVoid()) {
          errors.push(`Operand ${inst.opcode} '${inst.id}' tidak boleh bertipe void`);
        }
        break;
      }

      case NIROpcode.ICMP: {
        const icmp = inst as NIRICmpInst;
        if (!icmp.lhs.type.equals(icmp.rhs.type)) {
          errors.push(`Ketidakcocokan tipe pada icmp '${inst.id}'`);
        }
        break;
      }

      case NIROpcode.FCMP: {
        const fcmp = inst as NIRFCmpInst;
        if (!fcmp.lhs.type.isFloat() || !fcmp.rhs.type.isFloat()) {
          errors.push(`Operand fcmp '${inst.id}' harus bertipe floating point (f64)`);
        }
        break;
      }

      case NIROpcode.ALLOCA: {
        if (inst.type.kind !== NIRTypeKind.POINTER) {
          errors.push(`Hasil instruksi alloca '${inst.id}' harus bertipe pointer`);
        }
        break;
      }

      case NIROpcode.LOAD: {
        const load = inst as NIRLoadInst;
        if (!load.pointer || load.pointer.type.kind !== NIRTypeKind.POINTER) {
          errors.push(`Operand load '${inst.id}' harus bertipe pointer`);
        }
        break;
      }

      case NIROpcode.STORE: {
        const store = inst as NIRStoreInst;
        if (!store.pointer || store.pointer.type.kind !== NIRTypeKind.POINTER) {
          errors.push(`Pointer pada store '${inst.id}' harus bertipe pointer`);
        }
        break;
      }

      case NIROpcode.RET: {
        const ret = inst as NIRReturnInst;
        if (ret.returnValue) {
          if (!ret.returnValue.type.equals(fn.returnType)) {
            errors.push(
              `Nilai kembalian ret '${ret.returnValue.type.toString()}' tidak cocok dengan tipe kembalian fungsi '@${fn.name}' (${fn.returnType.toString()})`
            );
          }
        } else {
          if (!fn.returnType.isVoid()) {
            errors.push(`Instruksi ret void pada fungsi '@${fn.name}' yang mengembalikan non-void (${fn.returnType.toString()})`);
          }
        }
        break;
      }

      case NIROpcode.BR_COND: {
        const br = inst as NIRCondBranchInst;
        if (!br.condition.type.isBoolean()) {
          errors.push(`Kondisi br_cond '${inst.id}' harus bertipe boolean (i1)`);
        }
        if (!br.thenBlock || !br.elseBlock) {
          errors.push(`br_cond '${inst.id}' harus memiliki target then dan else yang valid`);
        }
        break;
      }

      case NIROpcode.CALL: {
        const call = inst as NIRCallInst;
        if (!call.calleeName) {
          errors.push(`Pemanggilan fungsi call '${inst.id}' kehilangan nama target`);
        }
        break;
      }

      // Concurrency & Actor Verification (Phase 46)
      case NIROpcode.ACTOR_CREATE: {
        if (!inst.type.isPointer()) {
          errors.push(`Hasil instruksi actor.create '${inst.id}' harus bertipe pointer (ptr)`);
        }
        break;
      }

      case NIROpcode.ACTOR_SEND: {
        const operands = (inst as any).operands || [];
        if (operands.length < 2) {
          errors.push(`Instruksi actor.send '${inst.id}' memerlukan target actor dan message payload`);
        }
        break;
      }

      case NIROpcode.ACTOR_STOP: {
        const operands = (inst as any).operands || [];
        if (operands.length < 1) {
          errors.push(`Instruksi actor.stop '${inst.id}' memerlukan target actor`);
        }
        break;
      }

      case NIROpcode.ASYNC_START: {
        if (!inst.type.isPointer()) {
          errors.push(`Hasil instruksi async.start '${inst.id}' harus bertipe pointer (task handle)`);
        }
        break;
      }

      case NIROpcode.AWAIT: {
        const operands = (inst as any).operands || [];
        if (operands.length < 1) {
          errors.push(`Instruksi await '${inst.id}' memerlukan task operand`);
        }
        break;
      }

      default:
        break;
    }
  }
}
