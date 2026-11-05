/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA INTERMEDIATE REPRESENTATION (NIR) - Sistem Tipe Data
 * Target Milestone: Phase 43 (v0.43.0)
 */

import { NamaTipe } from '../../tipe/jenisTipe';

export enum NIRTypeKind {
  VOID = 'void',
  BOOLEAN = 'i1',
  INT32 = 'i32',
  INT64 = 'i64',
  FLOAT64 = 'f64',
  STRING = 'string',
  POINTER = 'ptr',
  ARRAY = 'array',
  FUNCTION = 'function',
  STRUCT = 'struct',
  ANY = 'any',
}

export class NIRType {
  constructor(
    public readonly kind: NIRTypeKind,
    public readonly elementType?: NIRType,
    public readonly size?: number,
    public readonly paramTypes?: NIRType[],
    public readonly returnType?: NIRType,
    public readonly structName?: string,
    public readonly fieldTypes?: Map<string, NIRType>
  ) {}

  public isVoid(): boolean {
    return this.kind === NIRTypeKind.VOID;
  }

  public isBoolean(): boolean {
    return this.kind === NIRTypeKind.BOOLEAN;
  }

  public isInteger(): boolean {
    return this.kind === NIRTypeKind.INT32 || this.kind === NIRTypeKind.INT64;
  }

  public isFloat(): boolean {
    return this.kind === NIRTypeKind.FLOAT64;
  }

  public isNumeric(): boolean {
    return this.isInteger() || this.isFloat();
  }

  public isPointer(): boolean {
    return this.kind === NIRTypeKind.POINTER;
  }

  public isArray(): boolean {
    return this.kind === NIRTypeKind.ARRAY;
  }

  public isFunction(): boolean {
    return this.kind === NIRTypeKind.FUNCTION;
  }

  public isStruct(): boolean {
    return this.kind === NIRTypeKind.STRUCT;
  }

  public equals(other: NIRType): boolean {
    if (this.kind !== other.kind) return false;
    if (this.kind === NIRTypeKind.POINTER) {
      if (!this.elementType || !other.elementType) return true;
      return this.elementType.equals(other.elementType);
    }
    if (this.kind === NIRTypeKind.ARRAY) {
      return (
        this.size === other.size &&
        !!this.elementType &&
        !!other.elementType &&
        this.elementType.equals(other.elementType)
      );
    }
    if (this.kind === NIRTypeKind.FUNCTION) {
      if (!this.returnType || !other.returnType) return false;
      if (!this.returnType.equals(other.returnType)) return false;
      const paramsA = this.paramTypes || [];
      const paramsB = other.paramTypes || [];
      if (paramsA.length !== paramsB.length) return false;
      for (let i = 0; i < paramsA.length; i++) {
        if (!paramsA[i].equals(paramsB[i])) return false;
      }
      return true;
    }
    if (this.kind === NIRTypeKind.STRUCT) {
      return this.structName === other.structName;
    }
    return true;
  }

  public toString(): string {
    switch (this.kind) {
      case NIRTypeKind.VOID:
        return 'void';
      case NIRTypeKind.BOOLEAN:
        return 'i1';
      case NIRTypeKind.INT32:
        return 'i32';
      case NIRTypeKind.INT64:
        return 'i64';
      case NIRTypeKind.FLOAT64:
        return 'f64';
      case NIRTypeKind.STRING:
        return 'string';
      case NIRTypeKind.POINTER:
        return this.elementType ? `${this.elementType.toString()}*` : 'ptr';
      case NIRTypeKind.ARRAY:
        return `[${this.size ?? 0} x ${this.elementType?.toString() ?? 'any'}]`;
      case NIRTypeKind.FUNCTION: {
        const params = (this.paramTypes || []).map((p) => p.toString()).join(', ');
        return `(${params}) -> ${this.returnType?.toString() ?? 'void'}`;
      }
      case NIRTypeKind.STRUCT:
        return `%struct.${this.structName ?? 'anon'}`;
      case NIRTypeKind.ANY:
        return 'any';
      default:
        return this.kind;
    }
  }

  public toJSON(): any {
    return {
      kind: this.kind,
      elementType: this.elementType ? this.elementType.toJSON() : undefined,
      size: this.size,
      paramTypes: this.paramTypes ? this.paramTypes.map((p) => p.toJSON()) : undefined,
      returnType: this.returnType ? this.returnType.toJSON() : undefined,
      structName: this.structName,
    };
  }

  public static fromJSON(json: any): NIRType {
    if (!json || !json.kind) return NIRTypes.void();
    const elem = json.elementType ? NIRType.fromJSON(json.elementType) : undefined;
    const params = json.paramTypes ? json.paramTypes.map((p: any) => NIRType.fromJSON(p)) : undefined;
    const ret = json.returnType ? NIRType.fromJSON(json.returnType) : undefined;
    return new NIRType(json.kind, elem, json.size, params, ret, json.structName);
  }
}

export class NIRTypes {
  public static void(): NIRType {
    return new NIRType(NIRTypeKind.VOID);
  }

  public static i1(): NIRType {
    return new NIRType(NIRTypeKind.BOOLEAN);
  }

  public static bool(): NIRType {
    return new NIRType(NIRTypeKind.BOOLEAN);
  }

  public static i32(): NIRType {
    return new NIRType(NIRTypeKind.INT32);
  }

  public static i64(): NIRType {
    return new NIRType(NIRTypeKind.INT64);
  }

  public static f64(): NIRType {
    return new NIRType(NIRTypeKind.FLOAT64);
  }

  public static string(): NIRType {
    return new NIRType(NIRTypeKind.STRING);
  }

  public static pointer(elem?: NIRType): NIRType {
    return new NIRType(NIRTypeKind.POINTER, elem);
  }

  public static array(elem: NIRType, size: number = 0): NIRType {
    return new NIRType(NIRTypeKind.ARRAY, elem, size);
  }

  public static function(paramTypes: NIRType[], returnType: NIRType): NIRType {
    return new NIRType(NIRTypeKind.FUNCTION, undefined, undefined, paramTypes, returnType);
  }

  public static struct(name: string, fields?: Map<string, NIRType>): NIRType {
    return new NIRType(NIRTypeKind.STRUCT, undefined, undefined, undefined, undefined, name, fields);
  }

  public static any(): NIRType {
    return new NIRType(NIRTypeKind.ANY);
  }

  public static dariNamaTipe(namaTipe: NamaTipe | string): NIRType {
    switch (namaTipe) {
      case NamaTipe.BILANGAN:
      case 'bilangan':
        return NIRTypes.i64();
      case NamaTipe.DESIMAL:
      case 'desimal':
        return NIRTypes.f64();
      case NamaTipe.LOGIKA:
      case 'logika':
        return NIRTypes.i1();
      case NamaTipe.TEKS:
      case 'teks':
      case NamaTipe.KARAKTER:
      case 'karakter':
        return NIRTypes.string();
      case NamaTipe.DAFTAR:
      case 'daftar':
        return NIRTypes.pointer(NIRTypes.any());
      case NamaTipe.PETA:
      case 'peta':
        return NIRTypes.pointer(NIRTypes.any());
      case NamaTipe.KOSONG:
      case 'kosong':
        return NIRTypes.void();
      default:
        return NIRTypes.any();
    }
  }
}
