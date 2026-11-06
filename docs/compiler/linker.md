# Arsitektur Linker & Sistem Simbol NUSANTARA (Phase 45)

Dokumen ini menjelaskan arsitektur sistem linking bahasa pemrograman NUSANTARA pada versi v0.45.0. Sistem ini bertanggung jawab untuk meresolusi simbol antar-objek, memvalidasi relokasi, menghubungkan pustaka statis/dinamis, dan memproduksi berkas biner executable mandiri.

---

## 1. Ikhtisar Arsitektur

Pipeline linking Nusantara menghubungkan berkas objek (`.o`) yang dihasilkan oleh backend LLVM (Phase 44) dan runtime C stub menjadi executable native:

```
[ Berkas Objek Nusantara (.o) ]  +  [ Runtime C Stub / Pustaka ]
                    │
                    ▼
          ┌──────────────────┐
          │   Symbol Table   │  <-- Mangling _N_*, Visibilitas, Tipe
          └─────────┬────────┘
                    │
                    ▼
          ┌──────────────────┐
          │ Symbol Resolver  │  <-- Strong vs Weak, Duplicate & Undefined Check
          └─────────┬────────┘
                    │
                    ▼
          ┌──────────────────┐
          │ Relocation Engine│  <-- Validasi ELF/PE/Mach-O Relocations
          └─────────┬────────┘
                    │
                    ▼
          ┌──────────────────┐
          │  Library Manager │  <-- Resolusi .a / .so / .dll / .dylib
          └─────────┬────────┘
                    │
       ┌────────────┴────────────┐
       ▼                         ▼
┌──────────────┐          ┌──────────────┐
│Static Linker │          │Dynamic Linker│
└──────┬───────┘          └──────┬───────┘
       │                         │
       └────────────┬────────────┘
                    ▼
          [ Standalone Executable ]
```

---

## 2. Tabel Simbol & Name Mangling

### 2.1 Skema Name Mangling
Bahasa Nusantara menerapkan skema penamaan simbol terstruktur berbasis awalan `_N_`:
- **Fungsi**: `_N_F_<modul>_<nama_fungsi>` (misal: `_N_F_utama_tambah` atau `_N_F_modA_hitung`)
- **Variabel Global**: `_N_V_<modul>_<nama_variabel>`
- **Konstanta**: `_N_C_<modul>_<nama_konstanta>`
- **Entry Point**: `_N_F_utama_utama` atau `main`

### 2.2 Atribut Simbol
Setiap simbol direpresentasikan dengan struktur:
- `name`: Nama asli dalam kode sumber Nusantara
- `mangledName`: Nama unik setelah mangling
- `type`: `FUNCTION` | `VARIABLE` | `CONSTANT` | `SECTION` | `FILE`
- `binding`: `GLOBAL` | `LOCAL` | `WEAK`
- `visibility`: `DEFAULT` | `HIDDEN` | `PROTECTED`
- `section`: `.text`, `.data`, `.rodata`, `.bss`
- `isDefined`: Status apakah simbol terdefinisi atau merupakan referensi eksternal

---

## 3. Resolusi Simbol & Penanganan Konflik

`SymbolResolver` mengumpulkan seluruh tabel simbol dari berbagai berkas objek dan pustaka:
1. **Strong vs Weak Binding**: Simbol kuat (`GLOBAL`) menimpa simbol lemah (`WEAK`) dengan nama yang sama tanpa memicu galat duplikasi.
2. **Duplicate Symbol Detection**: Jika dua simbol kuat memiliki nama yang identik, resolusi memicu galat terstruktur:
   `LN4001: Konflik simbol ganda: simbol 'foo' terdefinisi lebih dari sekali.`
3. **Undefined Symbol Detection**: Jika terdapat simbol eksternal yang tidak memiliki definisi di modul manapun atau pustaka yang didaftarkan:
   `LN4002: Simbol belum terdefinisi: referensi ke 'bar' tidak dapat diresolusi.`
4. **Inter-Object Resolution**: Resolusi simbol lintas modul secara otomatis memetakan panggilan fungsi eksternal ke definisi modul target.

---

## 4. Mesin Relokasi Multi-Format

`RelocationManager` memvalidasi dan memodelkan relokasi biner untuk berbagai format biner modern:
- **ELF (Linux/BSD)**:
  - x86_64: `R_X86_64_64`, `R_X86_64_PC32`, `R_X86_64_PLT32`, `R_X86_64_GOTPCREL`
  - AArch64: `R_AARCH64_ABS64`, `R_AARCH64_CALL26`, `R_AARCH64_ADR_PREL_PG_HI21`
- **PE/COFF (Windows)**:
  - AMD64: `IMAGE_REL_AMD64_ADDR64`, `IMAGE_REL_AMD64_REL32`, `IMAGE_REL_AMD64_ADDR32NB`
- **Mach-O (macOS/iOS)**:
  - X86_64 / ARM64: `BRANCH`, `SIGNED`, `UNSIGNED`

Validasi relokasi mencakup:
- Keberadaan simbol target yang direlokasi
- Validitas batas offset terhadap ukuran seksi
- Deteksi overflow addend pada relokasi PC32 (-2GB sampai +2GB)

---

## 5. Pengelolaan Pustaka & Dependensi

`LibraryManager` mendeteksi dan mengelola pustaka statis (`.a`, `.lib`) dan dinamis (`.so`, `.dylib`, `.dll`) berdasarkan konfigurasi `nusantara.toml`:

```toml
[pustaka]
pencarian = ["./lib", "/usr/local/lib"]
statis = ["kripto", "matematika"]
dinamis = ["pthread", "m", "c"]
```

`DependencyInspector` memindai berkas biner pada sistem operasi target untuk mengidentifikasi dependensi pustaka bersama yang berhasil ditemukan maupun dependensi yang hilang (`missing`).

---

## 6. Antarmuka Baris Perintah (CLI)

Perintah `nusantara link` menyediakan antarmuka linking fleksibel:

```bash
# Linking statis berkas objek menjadi executable
nusantara link modul1.o modul2.o -o aplikasi --static

# Menentukan pustaka tambahan dan direktori pencarian
nusantara link main.o -L ./lib -l kripto -o app

# Menetapkan RPATH untuk shared libraries
nusantara link main.o -L ./lib -l mylib -rpath '$ORIGIN/../lib' -o app

# Inspeksi dependensi biner executable
nusantara inspect aplikasi --deps
```
