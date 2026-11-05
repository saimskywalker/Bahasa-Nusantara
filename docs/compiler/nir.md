# Dokumentasi Teknis: Nusantara Intermediate Representation (NIR)

## 1. Ikhtisar Arsitektur

Nusantara Intermediate Representation (**NIR**) adalah representasi perantara tingkat rendah berbasis *Static Single Assignment* (SSA) dan *Control Flow Graph* (CFG) yang dirancang untuk menjembatani Abstract Syntax Tree (AST) tingkat tinggi bahasa Nusantara dengan berbagai target backend generasi kode (khususnya LLVM IR untuk kompilasi native pada Fase 44, WebAssembly, dan bytecode VM).

```
   [Kode Sumber .nusantara]
              │
              ▼
   [Lexer & Parser AST]
              │
              ▼
     [AST to NIR Lowering]
              │
              ▼
    [NIR In-Memory Module]
    ├── BasicBlock CFG
    ├── Alloca / Memori Lokal
    └── Kumpulan Instruksi NIR
              │
              ▼
   [Mem2Reg / SSA Conversion]
    ├── Analisis Dominator Tree
    ├── Iterated Dominance Frontier (IDF)
    ├── Penyisipan Phi Node
    └── SSA Variable Renaming
              │
              ▼
     [NIR Optimizer (Pass)]
    ├── Constant Folding
    ├── Algebraic Simplification
    ├── Dead Code Elimination (DCE)
    └── CFG Simplification
              │
              ▼
     [NIR Verifier / Emit]
    ├── CLI `nusantara nir`
    ├── Serialisasi JSON (Roundtrip)
    └── Backend Native LLVM (Fase 44)
```

## 2. Struktur Data Utama

Modul NIR diorganisir dalam paket `src/compiler/nir/`:
- **`NIRModule`** (`module.ts`): Kontainer tingkat atas yang memuat daftar fungsi, variabel global, target triple (misal `x86_64-pc-linux-gnu`), data layout, dan metadata.
- **`NIRFunction`** (`function.ts`): Representasi fungsi yang memiliki tipe kembalian, daftar parameter formal terurut, dan kumpulan *Basic Blocks*.
- **`NIRBasicBlock`** (`basic-block.ts`): Barisan linier instruksi yang diakhiri oleh tepat satu instruksi *terminator* (tanpa percabangan internal).
- **`NIRInstruction`** (`instruction.ts`): Unit komputasi atau manipulasi memori berorientasi SSA.
- **`NIRTerminator`** (`terminator.ts`): Instruksi pengakhiran blok seperti `ret`, `br`, `cond_br`, dan `unreachable`.
- **`NIRValue`** & **`NIRConstant`** (`value.ts`, `constant.ts`): Abstraksi nilai SSA dengan pelacakan def-use graf melalui metode `replaceAllUsesWith()`.

## 3. Fitur Utama

1. **Lowering Komprehensif**: Mendukung konversi seluruh konstruksi AST bahasa Nusantara meliputi deklarasi variabel (`variabel`), konstanta (`tetapan`), penugasan, ekspresi aritmetika, perbandingan, logika, percabangan (`jika`/`maka`/`selain`), perulangan (`selama`, `untuk`), dan fungsi (`fungsi`).
2. **Transformasi Mem2Reg SSA**: Mengubah alokasi tumpukan (`alloca`/`load`/`store`) menjadi nilai SSA murni berindeks tunggal menggunakan kalkulasi *Dominator Tree* dan *Dominance Frontier* karya Cytron et al.
3. **Optimasi Berbasis Pass**: Pipeline optimasi berurutan yang dapat dijalankan secara modular (`NIRPassManager`) dengan level O1/O2.
4. **Verifikasi Semantik Kuat**: Memeriksa kelayakan tipe operand, keterhubungan blok, dan keabsahan bentuk SSA sebelum diserahkan ke backend kode mesin.
5. **Ekspor & Interoperabilitas**: Serialisasi penuh ke skema JSON dan format representasi tekstual (MIR/LLVM-like) melalui CLI `nusantara nir`.
