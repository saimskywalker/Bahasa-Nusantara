# Spesifikasi Kumpulan Instruksi (Instruction Set) NIR

Kumpulan instruksi Nusantara Intermediate Representation (NIR) mengadopsi model register tak terbatas mirip LLVM IR. Setiap instruksi menghasilkan satu nilai tunggal (SSA Value) dengan identifier unik berawalan `%` untuk nilai lokal dan `@` untuk simbol global.

## 1. Instruksi Aritmetika & Logika (`NIRBinaryInst`)

Sintaks tekstual:
```
%dst = <op> <tipe> <lhs>, <rhs>
```

| Opcode | Keterangan | Tipe yang Didukung |
|---|---|---|
| `add` | Penjumlahan integer atau floating point | `i32`, `i64`, `f64` |
| `sub` | Pengurangan integer atau floating point | `i32`, `i64`, `f64` |
| `mul` | Perkalian integer atau floating point | `i32`, `i64`, `f64` |
| `sdiv` | Pembagian bertanda (signed division) | `i32`, `i64` |
| `fdiv` | Pembagian floating point | `f64` |
| `srem` | Sisa bagi bertanda (modulo) | `i32`, `i64` |
| `frem` | Sisa bagi floating point | `f64` |
| `and` | Operasi logika AND bitwise / boolean | `i1`, `i32`, `i64` |
| `or` | Operasi logika OR bitwise / boolean | `i1`, `i32`, `i64` |
| `xor` | Operasi logika XOR bitwise / boolean | `i1`, `i32`, `i64` |
| `shl` | Shift left bitwise | `i32`, `i64` |
| `ashr` | Arithmetic shift right | `i32`, `i64` |
| `lshr` | Logical shift right | `i32`, `i64` |

Contoh:
```llvm
%v1 = add i32 %a, 10
%v2 = mul i32 %v1, 2
```

## 2. Instruksi Perbandingan (`NIRICmpInst` & `NIRFCmpInst`)

### Perbandingan Integer (`icmp`)
Sintaks tekstual:
```
%dst = icmp <predikat> <tipe> <lhs>, <rhs>
```
Predikat yang didukung:
- `eq`: Sama dengan ($==$)
- `ne`: Tidak sama dengan (!=)
- `sgt`: Lebih besar bertanda ($>$)
- `sge`: Lebih besar atau sama bertanda ($\ge$)
- `slt`: Lebih kecil bertanda ($<$)
- `sle`: Lebih kecil atau sama bertanda ($\le$)

### Perbandingan Floating Point (`fcmp`)
Sintaks tekstual:
```
%dst = fcmp <predikat> f64 <lhs>, <rhs>
```
Predikat: `oeq`, `one`, `ogt`, `oge`, `olt`, `ole`.

Instruksi perbandingan selalu mengembalikan nilai berjenis boolean (`i1`).

## 3. Instruksi Memori

| Instruksi | Sintaks | Keterangan |
|---|---|---|
| `alloca` | `%ptr = alloca <tipe>` | Mengalokasikan ruang di tumpukan (stack) untuk tipe data yang ditentukan. Mengembalikan pointer (`ptr`). |
| `load` | `%val = load <tipe>, ptr %ptr` | Membaca nilai dari alamat memori `ptr`. |
| `store` | `store <tipe> %val, ptr %ptr` | Menyimpan nilai ke alamat memori `ptr`. Tidak mengembalikan nilai (`void`). |
| `gep` | `%elem = gep <tipe>, ptr %ptr, <indeks...>` | GetElementPtr: Menghitung alamat sub-elemen array atau field struct tanpa mengakses memori. |

Contoh:
```llvm
%x.addr = alloca i32
store i32 42, ptr %x.addr
%0 = load i32, ptr %x.addr
```

## 4. Instruksi Kontrol Alur & Terminator

Instruksi terminator mengakhiri setiap Basic Block dan menentukan target eksekusi selanjutnya:

1. **`ret` (`NIRReturnInst`)**:
   - `ret void`
   - `ret <tipe> <nilai>`
   Mengembalikan nilai dari fungsi ke pemanggil.

2. **`br` (`NIRBranchInst`)**:
   - `br label %<target>`
   Lompatan tanpa syarat (*unconditional jump*) ke Basic Block target.

3. **`cond_br` (`NIRCondBranchInst`)**:
   - `cond_br i1 <kondisi>, label %<then>, label %<else>`
   Lompatan bersyarat berdasarkan nilai boolean `kondisi`.

4. **`unreachable` (`NIRUnreachableInst`)**:
   - Menandai titik program yang tidak mungkin dicapai secara logis.

## 5. Instruksi Pemanggilan & SSA

1. **`call` (`NIRCallInst`)**:
   - `%dst = call <retType> @<callee>(<arg1>, <arg2>, ...)`
   Memanggil fungsi global dengan argumen yang diberikan.

2. **`phi` (`NIRPhiInst`)**:
   - `%dst = phi <tipe> [ <val1>, %<block1> ], [ <val2>, %<block2> ], ...`
   Memilih nilai bergantung pada Basic Block pendahulu (*predecessor*) dari mana eksekusi berasal.

3. **`cast` (`NIRCastInst`)**:
   - `%dst = <cast_op> <srcType> <val> to <destType>`
   Konversi tipe: `bitcast`, `sitofp`, `fptosi`, `zext`, `trunc`.
