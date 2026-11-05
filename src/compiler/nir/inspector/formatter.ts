/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - NIR Formatter & Inspector
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { ControlFlowGraph } from '../cfg/control-flow-graph';
import { NIRFunction } from '../function';
import { NIRModule } from '../module';

export interface NIRModuleStatistics {
  functionCount: number;
  globalCount: number;
  basicBlockCount: number;
  instructionCount: number;
}

export class NIRFormatter {
  public static formatText(mod: NIRModule): string {
    return mod.toString();
  }

  public static getStatistics(mod: NIRModule): NIRModuleStatistics {
    let bbCount = 0;
    let instCount = 0;

    for (const fn of mod.functions.values()) {
      bbCount += fn.basicBlocks.length;
      for (const bb of fn.basicBlocks) {
        instCount += bb.getAllInstructions().length;
      }
    }

    return {
      functionCount: mod.functions.size,
      globalCount: mod.globals.size,
      basicBlockCount: bbCount,
      instructionCount: instCount,
    };
  }

  public static formatSummary(mod: NIRModule): string {
    const stats = this.getStatistics(mod);
    const lines: string[] = [
      '======================================================',
      `NIR MODULE SUMMARY: ${mod.name}`,
      '======================================================',
      `Target Triple    : ${mod.targetTriple}`,
      `Data Layout      : ${mod.dataLayout}`,
      `Total Functions  : ${stats.functionCount}`,
      `Total Globals    : ${stats.globalCount}`,
      `Total BasicBlocks: ${stats.basicBlockCount}`,
      `Total Instruction: ${stats.instructionCount}`,
      '------------------------------------------------------',
      'DAFTAR FUNGSI:',
    ];

    for (const fn of mod.functions.values()) {
      const kind = fn.isDeclaration ? 'declare' : 'define';
      lines.push(`  - ${kind} @${fn.name}(${fn.parameters.length} params) -> ${fn.returnType.toString()} [${fn.basicBlocks.length} blocks]`);
    }

    lines.push('======================================================');
    return lines.join('\n');
  }

  public static formatCFGDot(fn: NIRFunction): string {
    const lines: string[] = [
      `digraph CFG_${fn.name} {`,
      '  node [shape=record, fontname="Courier"];',
    ];

    for (const bb of fn.basicBlocks) {
      const instLines = bb
        .getAllInstructions()
        .map((i) => i.toString().replace(/([{}|<>])/g, '\\$1'))
        .join('\\l  ');
      const label = `{ %${bb.label} | ${instLines}\\l }`;
      lines.push(`  "${bb.label}" [label="${label}"];`);

      for (const succ of bb.successors) {
        lines.push(`  "${bb.label}" -> "${succ.label}";`);
      }
    }

    lines.push('}');
    return lines.join('\n');
  }
}
