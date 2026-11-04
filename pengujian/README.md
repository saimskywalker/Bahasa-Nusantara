# Kerangka Kerja & Sistem Pengujian Otomatis NUSANTARA

> **Dokumentasi Resmi Rangkaian Pengujian Mutu (Quality Gate) Bahasa Pemrograman NUSANTARA**  
> **Versi Rilis:** `v0.42.0` | **Status:** 38 Suite Pengujian Lulus 100%

Direktori `pengujian/` menampung seluruh kerangka pengujian mutu komprehensif bahasa pemrograman NUSANTARA, mulai dari verifikasi dokumen fondasi, analisis leksikal, parsing AST, evaluasi semantik & tipe, interpreter runtime, toolchain, framework web & desktop, hingga ekosistem mobile (Phase 1 s/d Phase 42).

---

## 1. Definisi & Rekapitulasi Metrik Pengujian

Sesuai audit teknis resmi dan transparan, berikut rincian metrik pengujian repositori:

| Metrik | Jumlah Aktual | Penjelasan Operasional |
|---|:---:|---|
| **Skrip Pengujian** | **38 Berkas** | Terdiri dari 1 skrip audit fondasi (`skrip/periksa_fondasi.js`) dan 37 skrip pengujian TypeScript (`pengujian/**/*.ts`). |
| **Suite Pengujian** | **38 Suite** | Masing-masing berkas pengujian bertindak sebagai test suite terisolasi untuk menguji modul atau fase tertentu. |
| **Pemeriksaan Dokumen Fondasi** | **167 Berkas** | Pemeriksaan keberadaan, kelengkapan isi, format lisensi, dan tata kelola pada Phase 1–5 oleh `skrip/periksa_fondasi.js`. |
| **Kasus Pengujian TypeScript (Test Cases)** | **1.030 Kasus** | Total skenario pengujian unit, integrasi, dan e2e yang dieksekusi pada 37 suite TypeScript (9 s/d 90 uji per file). |
| **Total Pemeriksaan Gabungan** | **1.197 Pemeriksaan** | **167 pemeriksaan dokumen fondasi + 1.030 kasus uji TypeScript = 1.197 pemeriksaan (Lulus 100%).** |

---

## 2. Klasifikasi Status Validasi Implementasi

Setiap fitur dan subsistem diklasifikasikan secara jujur dan transparan berdasarkan tingkat pembuktian pengujian aktual:

- 🟢 **SOURCE IMPLEMENTED:** Kode sumber telah ditulis dan tersedia secara lengkap di direktori `src/`.
- 🟢 **UNIT TEST PASSED:** Fungsi, logika, parsing, dan algoritma internal telah diuji unit dengan hasil 100% lulus.
- 🟢 **INTEGRATION TEST PASSED:** Integrasi antar-modul (misal: Parser + TypeChecker + Interpreter, atau CLI + Pustaka Standar) lulus pengujian.
- 🟡 **SIMULATOR TEST PASSED:** Subsistem beroperasi dan lulus pengujian menggunakan adapter simulator / mock (misal: sensor mobile, jembatan native bridge, atau simulasi respon Google Play / Apple Store API).
- ⚪ **REAL DEVICE TEST PASSED:** Pengujian pada perangkat fisik seluler nyata (Android / iOS).
- ⚪ **PRODUCTION VERIFIED:** Verifikasi langsung pada server cloud publik atau akun toko aplikasi komersial aktif.
- 🔴 **NOT VERIFIED:** Belum diuji atau belum tersedia lingkungan pengujian fisik.

---

## 3. Matriks Hasil Pengujian Komprehensif (38 Suite)

| No | Target Fase | Modul & Nama Pengujian | Perintah Eksekusi | Kasus Uji | Status | Klasifikasi Validasi |
|:---:|:---:|---|---|:---:|:---:|---|
| 1 | Phase 1–5 | Verifikasi Integritas Fondasi & Tata Bahasa | `node skrip/periksa_fondasi.js` | 167 berkas | LULUS | INTEGRATION TEST PASSED |
| 2 | Phase 6 | Lexer & Tokenizer UTF-8 | `npx tsx pengujian/lexer/uji_lexer.ts` | 21 uji | LULUS | UNIT TEST PASSED |
| 3 | Phase 7 | Parser & Pohon Sintaksis Abstrak (AST) | `npx tsx pengujian/parser/uji_parser.ts` | 11 uji | LULUS | UNIT TEST PASSED |
| 4 | Phase 8 | Interpreter & Evaluator Runtime | `npx tsx pengujian/interpreter/uji_interpreter.ts` | 15 uji | LULUS | INTEGRATION TEST PASSED |
| 5 | Phase 9 | Pemeriksa Tipe Statis & Immutability | `npx tsx pengujian/tipe/uji_tipe.ts` | 13 uji | LULUS | UNIT TEST PASSED |
| 6 | Phase 10 | Operator 8 Tingkat & Evaluasi Short-Circuit | `npx tsx pengujian/operator/uji_operator.ts` | 21 uji | LULUS | UNIT TEST PASSED |
| 7 | Phase 11 | Percabangan Kondisional (`jika..maka..akhir`) | `npx tsx pengujian/percabangan/uji_percabangan.ts` | 24 uji | LULUS | INTEGRATION TEST PASSED |
| 8 | Phase 12 | Perulangan Iteratif (`selama`, `untuk`) | `npx tsx pengujian/perulangan/uji_perulangan.ts` | 25 uji | LULUS | INTEGRATION TEST PASSED |
| 9 | Phase 13 | Fungsi, Prosedur, Scope & Rekursi | `npx tsx pengujian/fungsi/uji_fungsi.ts` | 28 uji | LULUS | INTEGRATION TEST PASSED |
| 10 | Phase 14 | Struktur Data Komposit (`daftar`, `peta`) | `npx tsx pengujian/struktur_data/uji_struktur_data.ts` | 31 uji | LULUS | INTEGRATION TEST PASSED |
| 11 | Phase 15 | Sistem Modul, Ruang Nama & Anti-Traversal | `npx tsx pengujian/modul/uji_modul.ts` | 24 uji | LULUS | INTEGRATION TEST PASSED |
| 12 | Phase 16 | Package Manager (`nusantara.toml` & lockfile) | `npx tsx pengujian/paket/uji_paket.ts` | 31 uji | LULUS | INTEGRATION TEST PASSED |
| 13 | Phase 17 | Standard Library Inti (8 Modul Bawaan) | `npx tsx pengujian/stdlib/uji_stdlib.ts` | 22 uji | LULUS | INTEGRATION TEST PASSED |
| 14 | Phase 18 | Diagnostik Galat, Pointer Visual & Saltik | `npx tsx pengujian/diagnostik/uji_diagnostik.ts` | 20 uji | LULUS | UNIT TEST PASSED |
| 15 | Phase 19 | Toolchain (Formatter AST & Linter Rules) | `npx tsx pengujian/toolchain/uji_toolchain.ts` | 54 uji | LULUS | INTEGRATION TEST PASSED |
| 16 | Phase 20 | Language Server Protocol (LSP JSON-RPC 2.0) | `npx tsx pengujian/lsp/uji_lsp.ts` | 32 uji | LULUS | INTEGRATION TEST PASSED |
| 17 | Phase 21 | Testing Framework (`pastikan`) & Quality Gate | `npx tsx pengujian/testing/uji_testing.ts` | 29 uji | LULUS | UNIT TEST PASSED |
| 18 | Phase 22 | Registri Paket Lokal & Penerbitan `.npk` | `npx tsx pengujian/paket/uji_ekosistem_registri.ts` | 24 uji | LULUS | INTEGRATION TEST PASSED |
| 19 | Phase 23 | Build System Multi-Platform (Win/Mac/Linux) | `npx tsx pengujian/build/uji_build_distribusi.ts` | 9 uji | LULUS | INTEGRATION TEST PASSED |
| 20 | Phase 24 | CI/CD GitHub Actions & Security Gate | `npx tsx pengujian/cicd/uji_cicd_workflow.ts` | 20 uji | LULUS | UNIT TEST PASSED |
| 21 | Phase 25 | Debugger Interaktif & Profiler Memori | `npx tsx pengujian/debugger/uji_debugger_profiler.ts` | 40 uji | LULUS | INTEGRATION TEST PASSED |
| 22 | Phase 26 | IDE Foundation, File Tree & Terminal | `npx tsx pengujian/ide/uji_ide_foundation.ts` | 46 uji | LULUS | INTEGRATION TEST PASSED |
| 23 | Phase 27 | Dependency Graph & Isolated Package Cache | `npx tsx pengujian/paket/uji_ekosistem_dependensi.ts` | 25 uji | LULUS | INTEGRATION TEST PASSED |
| 24 | Phase 28 | Stdlib Ekspansi (Kripto, Kompresi, Fetch) | `npx tsx pengujian/stdlib/uji_stdlib_fase28.ts` | 28 uji | LULUS | INTEGRATION TEST PASSED |
| 25 | Phase 29 | Database API & SQLite Native Driver | `npx tsx pengujian/database/uji_database_fase29.ts` | 21 uji | LULUS | INTEGRATION TEST PASSED |
| 26 | Phase 30 | Web Framework, Parameter Router & Anti-XSS | `npx tsx pengujian/web/uji_web_fase30.ts` | 25 uji | LULUS | INTEGRATION TEST PASSED |
| 27 | Phase 31 | Autentikasi Scrypt, Sesi CSPRNG & RBAC | `npx tsx pengujian/autentikasi/uji_autentikasi_fase31.ts` | 27 uji | LULUS | INTEGRATION TEST PASSED |
| 28 | Phase 32 | ORM, Model Relasional & Migrasi Skema | `npx tsx pengujian/orm/uji_orm_fase32.ts` | 17 uji | LULUS | INTEGRATION TEST PASSED |
| 29 | Phase 33 | Scaffolder Generator Proyek (`nusantara baru`)| `npx tsx pengujian/generator/uji_generator_fase33.ts` | 28 uji | LULUS | INTEGRATION TEST PASSED |
| 30 | Phase 34 | WebSocket Server & Background Worker Queue | `npx tsx pengujian/realtime/uji_realtime_fase34.ts` | 19 uji | LULUS | INTEGRATION TEST PASSED |
| 31 | Phase 35 | Klien HTTP REST Mandiri & Interceptor | `npx tsx pengujian/http/uji_http_fase35.ts` | 19 uji | LULUS | INTEGRATION TEST PASSED |
| 32 | Phase 36 | Desktop GUI & Tata Letak Kanvas Window | `npx tsx pengujian/gui/uji_gui_fase36.ts` | 13 uji | LULUS | SIMULATOR TEST PASSED |
| 33 | Phase 37 | Mobile Framework Core (UI/Nav/Lifecycle) | `npx tsx pengujian/mobile/uji_mobile_fase37.ts` | 29 uji | LULUS | SIMULATOR TEST PASSED |
| 34 | Phase 38 | Mobile Native Device API (25+ Sensor & API) | `npx tsx pengujian/mobile/uji_native_api_fase38.ts` | 16 uji | LULUS | SIMULATOR TEST PASSED |
| 35 | Phase 39 | Mobile Networking, Offline SQLite & Sync | `npx tsx pengujian/mobile/uji_mobile_networking_fase39.ts` | 32 uji | LULUS | INTEGRATION TEST PASSED |
| 36 | Phase 40 | Mobile App Packaging & Keystore Signing | `npx tsx pengujian/mobile/uji_distribusi_fase40.ts` | 80 uji | LULUS | INTEGRATION TEST PASSED |
| 37 | Phase 41 | Mobile Store Automation & Approval Gate | `npx tsx pengujian/mobile/uji_publikasi_fase41.ts` | 90 uji | LULUS | SIMULATOR TEST PASSED |
| 38 | Phase 42 | Mobile OTA Update Engine, Ed25519 & Rollback | `npx tsx pengujian/mobile/uji_pembaruan_fase42.ts` | 21 uji | LULUS | INTEGRATION TEST PASSED |

---

## 4. Cara Menjalankan Pengujian

### 4.1 Menjalankan Seluruh Rangkaian Pengujian
Jalankan perintah standar npm untuk mengeksekusi ke-38 suite secara berurutan:

```bash
npm test
```

### 4.2 Menjalankan Pengujian Fase Spesifik
Setiap fase memiliki target skrip mandiri pada `package.json`:

```bash
# Pengujian Fondasi (Phase 1–5)
node skrip/periksa_fondasi.js

# Pengujian Kompiler Inti (Phase 6–10)
npm run test:lexer
npm run test:parser
npm run test:interpreter
npm run test:tipe
npm run test:operator

# Pengujian Ekosistem Mobile (Phase 37–42)
npm run test:mobile-v37
npm run test:native-api-v38
npm run test:mobile-networking-v39
npm run test:distribusi-v40
npm run test:publikasi-v41
npm run test:pembaruan-v42
```

---

## 5. Batasan Lingkungan & Catatan Teknis Perangkat

1. **Pengujian Mobile (Phase 37 & 38):** Seluruh pengujian native device API dan jembatan pesan dijalankan menggunakan `AdaptorSimulatorMobile`. Pengujian memvalidasi kontrak tipe data, format pesan JSON-RPC, dan penanganan galat tanpa membutuhkan emulator Android atau ponsel fisik yang terhubung via ADB/USB.
2. **Pengujian Distribusi (Phase 40):** Pembuat berkas APK/AAB dan arsip iOS divalidasi integritas struktur file ZIP, penandatanganan kriptografi SHA-256, dan kelayakan berkas XML manifes secara murni di lingkungan Node.js. Pembuatan bytecode native Dalvik (.dex) komersial tetap memerlukan Android SDK (`gradlew assembleRelease`), dan berkas biner Mach-O iOS memerlukan lingkungan perangkat keras macOS dengan `xcodebuild`.
3. **Pengujian Store & Publikasi (Phase 41):** Klien Google Play API dan App Store Connect diuji dalam mode Sandbox / Mock Token untuk mencegah publikasi otomatis ke akun toko publik komersial selama pengujian CI/CD rutin.
4. **Pengujian OTA Update (Phase 42):** Seluruh proses verifikasi tanda tangan digital Ed25519, hashing SHA-256 berkas manifest, atomic swap direktori aset, dan logika pemulihan otomatis Safe Mode Rollback diuji menggunakan modul kriptografi asli Node.js (`crypto`).
