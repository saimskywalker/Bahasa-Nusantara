# Arsitektur Compiler NIR & Kesiapan Backend Native (Phase 44)

## 1. Modul Compiler NIR

Direktori `src/compiler/nir/` terdiri dari subsistem terpadu berikut:

```
src/compiler/nir/
├── type.ts                  <- Sistem tipe data NIR (i1, i32, i64, f64, string, ptr, struct)
├── value.ts                 <- Basis NIRValue dengan sistem def-use chain & replaceAllUsesWith
├── constant.ts              <- Representasi nilai konstanta integer, float, bool, string, null
├── instruction.ts           <- Instruksi NIR (alloca, load, store, add, sub, icmp, call, phi, dll)
├── terminator.ts            <- Instruksi terminator blok (ret, br, cond_br, unreachable)
├── basic-block.ts           <- Struktur Basic Block dengan daftar pendahulu & penerus
├── function.ts              <- Entitas fungsi dengan daftar parameter dan blok kontrol
├── module.ts                <- Wadah global modul NIR (triple, layout, fungsi, variabel global)
├── builder.ts               <- NIRBuilder untuk konstruksi instruksi yang mudah dan aman
├── verifier.ts              <- NIRVerifier untuk audit keutuhan semantik dan aturan SSA
├── serializer.ts            <- Serializer NIR ke format JSON
├── deserializer.ts          <- Deserializer NIR dari JSON kembali ke graf memori lengkap
├── cfg/
│   ├── control-flow-graph.ts<- Analisis graf aliran kontrol dan kalkulasi ketercapaian blok
│   ├── dominator.ts         <- Perhitungan Dominator Tree dan Dominance Frontier
│   └── index.ts
├── ssa/
│   ├── phi.ts               <- Representasi dan penyederhanaan simpul Phi
│   ├── conversion.ts        <- Transformasi Mem2Reg berbasis Iterated Dominance Frontier
│   ├── verifier.ts          <- Pemeriksa keabsahan properti bentuk SSA
│   └── index.ts
├── lowering/
│   ├── ast-to-nir.ts        <- Transformasi AST Bahasa Nusantara ke NIR In-Memory
│   └── index.ts
├── optimizer/
│   ├── pass.ts              <- Antarmuka NIRFunctionPass dan NIRModulePass
│   ├── constant-folding.ts  <- Pelipatan konstanta saat waktu kompilasi
│   ├── simplification.ts    <- Penyederhanaan identitas aljabar (+0, *1, dll)
│   ├── dead-code-elimination.ts <- Penghapusan instruksi tanpa pengguna (DCE)
│   ├── cfg-cleanup.ts       <- Penggabungan blok redundan dan eliminasi blok mati
│   ├── pipeline.ts          <- NIRPassManager dan preset optimasi O1/O2
│   └── index.ts
├── inspector/
│   ├── formatter.ts         <- Generator representasi tekstual (disassembler IR)
│   └── index.ts
└── index.ts                 <- Entrypoint publik modul NIR
```

## 2. Pipeline Eksekusi CLI

Perintah CLI `nusantara nir` menyediakan utilitas lengkap bagi pengembang untuk memeriksa perantara kompilasi:

- **Inspeksi Tekstual IR**:
  ```bash
  nusantara nir berkas.nusantara
  ```
- **Pemeriksaan Verifikasi Semantik**:
  ```bash
  nusantara nir --verify berkas.nusantara
  ```
- **Ekspor Skema JSON**:
  ```bash
  nusantara nir --json berkas.nusantara
  ```
- **Optimasi Penuh (O2)**:
  ```bash
  nusantara nir --optimize berkas.nusantara
  ```
- **Konversi Mem2Reg (SSA murni)**:
  ```bash
  nusantara nir --ssa berkas.nusantara
  ```

## 3. Integrasi & Kesiapan Backend LLVM (Fase 44)

Dengan terselesaikannya Fase 43 (NIR), bahasa Nusantara kini memiliki fondasi intermediate representation berstandar industri yang memetakan 1:1 ke konsep LLVM:

| Konsep NIR Nusantara (Fase 43) | Ekivalen Target LLVM IR (Fase 44) |
|---|---|
| `NIRModule` | `llvm::Module` |
| `NIRFunction` | `llvm::Function` |
| `NIRBasicBlock` | `llvm::BasicBlock` |
| `NIRBuilder` | `llvm::IRBuilder<>` |
| `NIRBinaryInst` | `llvm::BinaryOperator` |
| `NIRICmpInst` / `NIRFCmpInst` | `llvm::ICmpInst` / `llvm::FCmpInst` |
| `NIRPhiInst` | `llvm::PHINode` |
| `NIRAllocaInst` / `NIRLoadInst` / `NIRStoreInst` | `llvm::AllocaInst` / `llvm::LoadInst` / `llvm::StoreInst` |
| `NIRBranchInst` / `NIRCondBranchInst` | `llvm::BranchInst` |
| `NIRReturnInst` | `llvm::ReturnInst` |

Fase 44 dapat langsung mengonsumsi modul `NIRModule` yang telah dioptimasi oleh NIRPassManager untuk menghasilkan berkas objek biner native (`.o`, `.obj`) atau pustaka dinamis melalui LLVM C API atau binding WebAssembly LLVM.
