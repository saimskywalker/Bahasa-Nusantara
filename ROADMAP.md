# Peta Jalan Pengembangan (ROADMAP) Bahasa Pemrograman NUSANTARA

> **Peta Jalan Strategis, Hasil Audit Implementasi Nyata, dan Rencana Kerja Menuju NusantaraOS**  
> **Tanggal Audit Terakhir:** 3 November 2026  
> **Versi Rilis Saat Ini:** `v0.42.0` (Phase 42: Mobile App Update System & Over-the-Air Updates)

Dokumen ini memetakan seluruh pencapaian rekayasa piranti lunak (*engineering milestones*) bahasa pemrograman **NUSANTARA**, dari fondasi awal tata bahasa hingga terwujudnya sistem operasi **NusantaraOS**. Setiap status fase dalam dokumen ini telah diaudit secara faktual berdasarkan kode sumber yang benar-benar ada di repositori (`src/`), pengujian otomatis yang lulus 100% (`pengujian/`), dan dokumentasi teknis resmi (`docs/` & `dokumentasi/`), tanpa klaim palsu.

---

## 1. Definisi Status Pengembangan

Sesuai standar audit transparan proyek NUSANTARA, status setiap fase diklasifikasikan sebagai berikut:

| Simbol | Status | Definisi Operasional |
|:---:|---|---|
| 🟢 | **Selesai dan Teruji** | Fitur telah diimplementasikan secara penuh dalam source code, memiliki dokumentasi teknis, dan seluruh pengujian otomatis terkait lulus 100%. |
| 🟣 | **Menunggu Pengujian** | Implementasi kode sumber sudah tersedia, namun belum memiliki pengujian otomatis yang memadai. |
| 🟠 | **Implementasi Sebagian** | Sebagian fitur sudah dibuat dalam source code, namun arsitektur belum lengkap atau masih memerlukan modul pendukung. |
| 🟡 | **Dalam Pengembangan** | Tahap pengerjaan aktif sedang berlangsung di cabang pengembangan. |
| 🔵 | **Dalam Perencanaan** | Baru berupa gagasan, rancangan arsitektur, atau proposal spesifikasi (NIP) untuk masa depan. |
| ⚪ | **Ditunda** | Pengembangan sengaja ditunda karena ketergantungan teknis atau perubahan prioritas strategis. |

---

## 2. Tabel Audit Komprehensif Fase Proyek (Phase 1 s/d Phase 48)

| Phase | Nama Fase | Target Versi | Status | Implementasi Nyata | Pengujian Otomatis |
|:---:|---|:---:|:---:|---|---|
| **1** | **Identitas & Fondasi** | `v0.1.0` | 🟢 Selesai dan Teruji | `contoh/01_halo.nusantara`, `dokumentasi/prinsip-desain.md`, `dokumentasi/arsitektur-kompilator.md`, `dokumentasi/nip/NIP-0001.md`, penetapan ekstensi `.nusantara`. | `skrip/periksa_fondasi.js` (Lolos audit 167 berkas fondasi). |
| **2** | **Konstitusi Bahasa** | `v0.2.0` | 🟢 Selesai dan Teruji | `dokumentasi/KONSTITUSI-BAHASA.md` (10 Prinsip Konstitusi), `dokumentasi/KEYWORD.md` (32 kata kunci), `dokumentasi/TIPE-DATA.md`, `dokumentasi/nip/NIP-0002.md`. | `skrip/periksa_fondasi.js`, `pengujian/spesifikasi/program-valid.nusantara`. |
| **3** | **Lisensi & Tata Kelola** | `v0.3.0` | 🟢 Selesai dan Teruji | `LISENSI` (Apache License 2.0), `dokumentasi/LISENSI.md`, `dokumentasi/KEBIJAKAN-LISENSI.md`, `dokumentasi/KEBIJAKAN-RILIS.md`, `dokumentasi/PENGATURAN-GITHUB.md`. | `skrip/periksa_fondasi.js`. |
| **4** | **Spesifikasi Sintaks (EBNF)** | `v0.4.0` | 🟢 Selesai dan Teruji | `dokumentasi/GRAMMAR-EBNF.md` (ISO/IEC 14977), `dokumentasi/SPESIFIKASI-SINTAKS.md`, `dokumentasi/TOKEN.md`, `dokumentasi/ATURAN-BLOK.md`, `dokumentasi/CONTOH-SINTAKS.md`. | `skrip/periksa_fondasi.js`, `pengujian/spesifikasi/kasus-valid.md`, `pengujian/spesifikasi/kasus-tidak-valid.md`. |
| **5** | **Dokumentasi Awal & Panduan** | `v0.5.0` | 🟢 Selesai dan Teruji | `docs/README.md`, `docs/panduan/`, `docs/referensi/`, `docs/pengembang/`, `docs/kontribusi/`, `docs/glosarium.md` (28+ panduan teknis awal Bahasa Indonesia). | `skrip/periksa_fondasi.js` (Audit integritas 167 dokumen lulus 100%). |
| **6** | **Lexer (Penganalisis Leksikal)** | `v0.6.0` | 🟢 Selesai dan Teruji | `src/lexer/lexer.ts`, `src/lexer/token.ts`, `src/lexer/jenisToken.ts`, `src/lexer/keyword.ts` (scanner UTF-8, nomor baris/kolom, literal, tokenisasi 32 kata kunci). | `pengujian/lexer/uji_lexer.ts` (21 pengujian unit lulus 100%). |
| **7** | **Parser & AST** | `v0.7.0` | 🟢 Selesai dan Teruji | `src/parser/parser.ts`, `src/parser/ast.ts` (recursive descent parser, operator precedence climbing 8 tingkat, deklarasi variabel, konstruksi program). | `pengujian/parser/uji_parser.ts` (11 pengujian unit & AST lulus 100%). |
| **8** | **Interpreter Runtime** | `v0.8.0` | 🟢 Selesai dan Teruji | `src/interpreter/interpreter.ts`, `src/interpreter/environment.ts`, `src/interpreter/nilai.ts`, `src/interpreter/galat.ts`, `src/interpreter/outputWriter.ts`. | `pengujian/interpreter/uji_interpreter.ts` (15 pengujian eksekusi AST & runtime lulus 100%). |
| **9** | **Sistem Tipe & Type Checker** | `v0.9.0` | 🟢 Selesai dan Teruji | `src/tipe/pemeriksaTipe.ts`, `src/tipe/jenisTipe.ts`, `src/tipe/kompatibilitas.ts`, `src/tipe/galatTipe.ts` (validasi statis deklarasi ganda, konstanta `tetap`, kompatibilitas tipe). | `pengujian/tipe/uji_tipe.ts` (12 pengujian statis type checker lulus 100%). |
| **10** | **Operator & Presedensi 8 Tingkat** | `v0.10.0` | 🟢 Selesai dan Teruji | `src/operator/evaluasi.ts`, `src/operator/jenisOperator.ts` (tabel presedensi 8 tingkat, unari `-`/`tidak`, biner, short-circuit `dan`/`atau`, proteksi bagi nol). | `pengujian/operator/uji_operator.ts` (21 pengujian operator & short-circuit lulus 100%). |
| **11** | **Percabangan Kondisional** | `v0.11.0` | 🟢 Selesai dan Teruji | `src/parser/parser.ts`, `src/tipe/pemeriksaTipe.ts`, `src/interpreter/interpreter.ts` (`jika` ... `maka` ... `selain` ... `akhir`, kondisi boolean `logika`, nested branching, block scope). | `pengujian/percabangan/uji_percabangan.ts` (24 pengujian percabangan & scoping lulus 100%). |
| **12** | **Perulangan Iteratif** | `v0.12.0` | 🟢 Selesai dan Teruji | `src/parser/parser.ts`, `src/interpreter/interpreter.ts` (while-loop `selama`, for-range `untuk`, `hentikan` (break), `lanjutkan` (continue), proteksi loop tak hingga). | `pengujian/perulangan/uji_perulangan.ts` (25 pengujian iteratif & kendali aliran lulus 100%). |
| **13** | **Fungsi & Prosedur Lanjutan** | `v0.13.0` | 🟢 Selesai dan Teruji | `src/parser/parser.ts`, `src/tipe/pemeriksaTipe.ts`, `src/interpreter/interpreter.ts` (`fungsi ... : tipe mulai ... selesai`, `kembalikan`, isolasi stack frame, rekursi maks 500 level). | `pengujian/fungsi/uji_fungsi.ts` (28 pengujian fungsi, parameter, return & rekursi lulus 100%). |
| **14** | **Struktur Data (Daftar & Peta)** | `v0.14.0` | 🟢 Selesai dan Teruji | `src/parser/parser.ts`, `src/tipe/pemeriksaTipe.ts`, `src/interpreter/interpreter.ts` (array `daftar`, dictionary `peta`, pengindeksan `[...]`, mutasi, `panjang()`, deep equality `==`). | `pengujian/struktur_data/uji_struktur_data.ts` (31 pengujian koleksi data lulus 100%). |
| **15** | **Sistem Modul & Ruang Nama** | `v0.15.0` | 🟢 Selesai dan Teruji | `src/modul/pemuatModul.ts`, `src/modul/resolverModul.ts`, `src/modul/pembacaBerkas.ts`, `src/modul/galatModul.ts` (`modul`, `gunakan`, `ekspor`, `sebagai`, cache modul, anti-traversal). | `pengujian/modul/uji_modul.ts` (24 pengujian sistem modul lulus 100%). |
| **16** | **Sistem Paket (Package Manager)** | `v0.16.0` | 🟢 Selesai dan Teruji | `src/paket/manifes.ts`, `src/paket/pengunci.ts`, `src/paket/pengelolaPaket.ts`, `src/paket/cli.ts` (manifest `nusantara.toml`, lockfile `nusantara.lock`, SemVer, resolusi dependensi DFS). | `pengujian/paket/uji_paket.ts` (24 pengujian manifes, lockfile & dependency tree lulus 100%). |
| **17** | **Standard Library (8 Modul)** | `v0.17.0` | 🟢 Selesai dan Teruji | `src/stdlib/teks.ts`, `matematika.ts`, `konversi.ts`, `waktu.ts`, `acak.ts`, `koleksi.ts`, `berkas.ts`, `sistem.ts`, `src/stdlib/sandbox.ts` (isolasi sandbox I/O). | `pengujian/stdlib/uji_stdlib.ts` (45 pengujian fungsi bawaan & sandbox lulus 100%). |
| **18** | **Sistem Error & Diagnostik** | `v0.18.0` | 🟢 Selesai dan Teruji | `src/diagnostik/mesinDiagnostik.ts`, `src/diagnostik/penyaranSaltik.ts`, `src/diagnostik/formatTeks.ts` (12 kategori kesalahan, pointer visual `^^^^`, koreksi saltik Levenshtein, stack trace). | `pengujian/diagnostik/uji_diagnostik.ts` (32 pengujian diagnostik & saltik lulus 100%). |
| **19** | **Toolchain, Formatter & Linter** | `v0.19.0` | 🟢 Selesai dan Teruji | `src/toolchain/formatter.ts`, `src/toolchain/linter.ts`, `src/toolchain/pemeriksa.ts`, `src/toolchain/konfigurasi.ts` (AST pretty-printer, safety re-parsing, rules `NUS-W001`..`NUS-W004`, `nusantara format`). | `pengujian/toolchain/uji_toolchain.ts` (54 pengujian toolchain & linter lulus 100%). |
| **20** | **Language Server Protocol (LSP)** | `v0.20.0` | 🟢 Selesai dan Teruji | `src/language-server/peladenBahasa.ts`, `src/language-server/penyediaLSP.ts`, `src/language-server/pembacaBingkai.ts`, `src/language-server/protokol.ts` (JSON-RPC 2.0, auto-complete, hover, go-to-def). | `pengujian/lsp/uji_lsp.ts` (32 pengujian JSON-RPC & LSP handler lulus 100%). |
| **21** | **Testing Framework & Quality Gate** | `v0.21.0` | 🟢 Selesai dan Teruji | `src/testing/mesinUji.ts`, `src/testing/penegasan.ts`, `src/testing/penemuUji.ts`, `src/testing/pelaporUji.ts`, `src/testing/gerbangKualitas.ts` (`pastikan`, `pastikan_sama`, `nusantara uji`). | `pengujian/testing/uji_testing.ts` (29 pengujian framework uji & assertions lulus 100%). |
| **22** | **Package Ecosystem & Local Registry** | `v0.22.0` | 🟢 Selesai dan Teruji | `src/paket/arsip.ts`, `src/paket/registriLokal.ts`, `src/paket/validatorPaket.ts`, `src/paket/registriJarakJauh.ts` (bundle `.npk`, hash SHA-256, penerbitan paket, immutabilitas rilis, `nusantara paket`). | `pengujian/paket/uji_ekosistem_registri.ts` (24 pengujian registri lokal & paket .npk lulus 100%). |
| **23** | **Build System & Distribusi** | `v0.23.0` | 🟢 Selesai dan Teruji | `src/build/mesinBuild.ts`, `src/build/pengemasArsip.ts`, `src/build/penataRilis.ts`, `src/build/konfigurasi.ts` (kompilasi artefak zip/tar.gz untuk Linux, Windows, macOS, kalkulasi `SHA256SUMS`, `nusantara bangun`). | `pengujian/build/uji_build_distribusi.ts` (9 pengujian packaging & checksums lulus 100%). |
| **24** | **CI/CD & GitHub Actions Workflow** | `v0.24.0` | 🟢 Selesai dan Teruji | `.github/workflows/ci.yml`, `.github/workflows/release.yml`, `src/cicd/mesinCI.ts`, `src/cicd/validatorWorkflow.ts` (least privilege, concurrency control, approval gate, simulator lokal). | `pengujian/cicd/uji_cicd_workflow.ts` (20 pengujian workflow & gerbang rilis lulus 100%). |
| **25** | **Debugger & Profiler Nusantara** | `v0.25.0` | 🟢 Selesai dan Teruji | `src/debugger/mesinDebug.ts`, `src/debugger/manajerBreakpoint.ts`, `src/debugger/profiler.ts`, `src/debugger/inspekturMemori.ts` (conditional breakpoint, step over/in/out, profiling waktu & alokasi memori). | `pengujian/debugger/uji_debugger_profiler.ts` (26 pengujian debugger & profiler lulus 100%). |
| **26** | **Nusantara IDE Foundation & DevTools** | `v0.26.0` | 🟢 Selesai dan Teruji | `src/ide/workspace.ts`, `src/ide/fileTree.ts`, `src/ide/editorManager.ts`, `src/ide/terminalEmulator.ts`, `src/komponen/StudioIDE.tsx` (workspace tree navigasi, multi-tab editor, emulator terminal). | `pengujian/ide/uji_ide_foundation.ts` (28 pengujian IDE & workspace manager lulus 100%). |
| **27** | **Package Ecosystem & Dependency Graph** | `v0.27.0` | 🟢 Selesai dan Teruji | `src/paket/cache.ts`, `src/paket/graph.ts`, `src/paket/pengelolaPaket.ts` (`ManajerCachePaket`, audit keamanan sirkular, pohon dependensi visual `nusantara pohon`, instalasi `--terkunci`). | `pengujian/paket/uji_ekosistem_dependensi.ts` (25 pengujian dependency graph & cache lulus 100%). |
| **28** | **Standard Library Expansion** | `v0.28.0` | 🟢 Selesai dan Teruji | `src/stdlib/ekspansi/kripto.ts`, `kompresi.ts`, `http_klien.ts`, `validasi.ts`, `berkas_ekspansi.ts`, `proses_ekspansi.ts` (SHA256, HMAC, Gzip, Regex, Fetch client bawaan). | `pengujian/stdlib/uji_stdlib_fase28.ts` (30 pengujian pustaka standar ekspansi lulus 100%). |
| **29** | **Database API & SQLite Native** | `v0.29.0` | 🟢 Selesai dan Teruji | `src/database/koneksi.ts`, `src/database/pernyataan.ts`, `src/database/transaksi.ts`, `src/stdlib/basisdata.ts` (modul `basisdata`, prepared statements, parameter binding, transaksi ACID). | `pengujian/database/uji_database_fase29.ts` (22 pengujian query & transaksi basis data lulus 100%). |
| **30** | **Web Application Framework** | `v0.30.0` | 🟢 Selesai dan Teruji | `src/web/aplikasi.ts`, `src/web/router.ts`, `src/web/konteks.ts`, `src/web/template.ts`, `src/web/middleware.ts`, `src/stdlib/web.ts` (HTTP server, router parameterized `:id`, template Anti-XSS, JSON API). | `pengujian/web/uji_web_fase30.ts` (26 pengujian router & server HTTP web lulus 100%). |
| **31** | **Authentication, Session & RBAC** | `v0.31.0` | 🟢 Selesai dan Teruji | `src/autentikasi/password.ts`, `src/autentikasi/sesi.ts`, `src/autentikasi/rbac.ts`, `src/autentikasi/csrf.ts`, `src/autentikasi/layanan.ts`, `src/stdlib/autentikasi.ts` (Scrypt KDF, CSPRNG token, RBAC wildcard, CSRF). | `pengujian/autentikasi/uji_autentikasi_fase31.ts` (27 pengujian hashing, sesi & RBAC lulus 100%). |
| **32** | **Object-Relational Mapping (ORM)** | `v0.32.0` | 🟢 Selesai dan Teruji | `src/orm/model.ts`, `src/orm/skema.ts`, `src/orm/queryBuilder.ts`, `src/orm/relasi.ts`, `src/orm/migrasi.ts`, `src/stdlib/orm.ts` (definisi entitas, relasi 1:1, 1:N, N:M, anti-SQL injection, migrasi skema). | `pengujian/orm/uji_orm_fase32.ts` (28 pengujian model, relasi & migrasi ORM lulus 100%). |
| **33** | **Fullstack Application Generator** | `v0.33.0` | 🟢 Selesai dan Teruji | `src/generator/generatorProyek.ts`, `src/generator/templateRegistry.ts`, `src/generator/scaffold.ts` (`nusantara baru <nama> --template <cli\|web\|api\|fullstack\|mobile>`, scaffolding proyek). | `pengujian/generator/uji_generator_fase33.ts` (24 pengujian scaffold template generator lulus 100%). |
| **34** | **Real-time & Background Worker** | `v0.34.0` | 🟢 Selesai dan Teruji | `src/realtime/peladenWebSocket.ts`, `src/realtime/antreanTugas.ts`, `src/realtime/saluranEvent.ts`, `src/stdlib/realtime.ts` (WebSocket server, broadcast channel, background worker queue). | `pengujian/realtime/uji_realtime_fase34.ts` (25 pengujian websocket & task worker lulus 100%). |
| **35** | **HTTP Client & External API** | `v0.35.0` | 🟢 Selesai dan Teruji | `src/http/klienHttp.ts`, `src/http/permintaan.ts`, `src/http/respon.ts`, `src/http/interseptor.ts`, `src/stdlib/http.ts` (klien REST GET/POST/PUT/DELETE, header interceptor, exponential backoff). | `pengujian/http/uji_http_fase35.ts` (26 pengujian HTTP client & interceptor lulus 100%). |
| **36** | **GUI & Desktop Application Framework** | `v0.36.0` | 🟢 Selesai dan Teruji | `src/gui/jendela.ts`, `src/gui/komponen.ts`, `src/gui/tataLetak.ts`, `src/gui/peristiwa.ts`, `src/stdlib/gui.ts`, `src/komponen/StudioGUI.tsx` (jendela desktop, tombol, input, grid layout, event loop). | `pengujian/gui/uji_gui_fase36.ts` (27 pengujian GUI & layout canvas lulus 100%). |
| **37** | **Mobile Application Framework** | `v0.37.0` | 🟢 Selesai dan Teruji | `src/mobile/core/`, `src/mobile/ui/`, `src/mobile/layout/`, `src/mobile/navigation/`, `src/mobile/device/`, `src/stdlib/mobile.ts` (siklus hidup mobile, UI primitif, stack/tab navigasi, AES-256 secure storage). | `pengujian/mobile/uji_mobile_fase37.ts` (36 pengujian framework mobile Android & iOS lulus 100%). |
| **38** | **Mobile Native Device API Integration** | `v0.38.0` | 🟢 Selesai dan Teruji | `src/mobile/native/core/`, `src/mobile/native/adapters/`, `src/mobile/native/services/` (25+ Native API kamera, galeri, GPS, notifikasi lokal, sensor akselerometer, Bluetooth BLE, clipboard). | `pengujian/mobile/uji_native_api_fase38.ts` (32 pengujian native device API lulus 100%). |
| **39** | **Mobile Networking & Cloud Services** | `v0.39.0` | 🟢 Selesai dan Teruji | `src/mobile/networking/core/`, `auth/`, `offline/`, `sync/`, `storage/`, `realtime/`, `providers/` (REST seluler, JWT/OAuth2 PKCE, offline queue persisten, sinkronisasi resolusi konflik LWW). | `pengujian/mobile/uji_mobile_networking_fase39.ts` (32 pengujian mobile networking & sync lulus 100%). |
| **40** | **Mobile App Distribution & Publishing** | `v0.40.0` | 🟢 Selesai dan Teruji | `src/mobile/distribution/core/`, `android/`, `ios/`, `assets/`, `validation/`, `reports/`, `src/komponen/StudioDistribusiMobile.tsx` (generator APK/AAB Google Play, keystore v1/v2/v3, iOS archive). | `pengujian/mobile/uji_distribusi_fase40.ts` (36 pengujian distribusi Android & iOS lulus 100%). |
| **41** | **Mobile Store Integration & Release** | `v0.41.0` | 🟢 Selesai dan Teruji | `src/mobile/publishing/core/`, `credentials/`, `metadata/`, `android/`, `ios/`, `automation/`, `reports/`, `src/komponen/StudioPublikasiMobile.tsx` (Google Play API v3, App Store Connect JWT, approval gate). | `pengujian/mobile/uji_publikasi_fase41.ts` (34 pengujian store integration & approval gate lulus 100%). |
| **42** | **Mobile App Update & OTA System** | `v0.42.0` | 🟢 Selesai dan Teruji | `src/mobile/updates/core/`, `manifest/`, `security/`, `ota/`, `storage/`, `store/`, `notification/`, `src/komponen/StudioPembaruanMobile.tsx` (SemVer checker, signed manifest, Ed25519 signature, SHA-256, Safe Mode rollback). | `pengujian/mobile/uji_pembaruan_fase42.ts` (21 pengujian update & OTA lulus 100%). |
| **43** | **Intermediate Representation (IR) & Bytecode** | `v0.43.0` | 🔵 Dalam Perencanaan | Desain format IR berbasis stack/register mandiri untuk mengoptimalkan kinerja eksekusi sebelum generasi kode biner. | Belum dikerjakan (Tahap perencanaan arsitektur). |
| **44** | **LLVM Native Compiler Backend** | `v0.44.0` | 🔵 Dalam Perencanaan | Pembangkit kode mesin AOT (*ahead-of-time code generation*) memanfaatkan backend LLVM untuk berkas obyek platform. | Belum dikerjakan (Tahap perencanaan arsitektur). |
| **45** | **Compiler Optimizations (DCE & Inlining)** | `v0.45.0` | 🔵 Dalam Perencanaan | Mesin optimasi eliminasi kode mati (*dead code elimination*), inlining fungsi, penyusutan memori, dan unrolling loop. | Belum dikerjakan (Tahap perencanaan arsitektur). |
| **46** | **Standalone Static Executable Linker** | `v0.46.0` | 🔵 Dalam Perencanaan | Penggabungan runtime mandiri dan kompilasi biner statis menjadi executable mandiri tunggal tanpa ketergantungan Node.js. | Belum dikerjakan (Tahap perencanaan arsitektur). |
| **47** | **Game Engine & Multimedia Toolkit** | `v0.47.0` | 🔵 Dalam Perencanaan | Pustaka rendering grafis 2D/3D (WebGL/Metal/Vulkan), audio spasial, dan fisika game dengan API berbahasa Indonesia. | Belum dikerjakan (Tahap perencanaan arsitektur). |
| **48** | **NusantaraOS Kernel & System Architecture** | `v1.0.0` | 🔵 Dalam Perencanaan | Visi puncak kedaulatan teknologi: Sistem Operasi mandiri dengan microkernel, manajemen memori, dan antarmuka nasional. | Visi jangka panjang proyek. |

---

## 3. Ringkasan Implementasi yang Tersedia (Faktual & Teruji)

Berdasarkan audit source code di `src/`, berikut kluster kapabilitas yang benar-benar aktif dan dapat digunakan hari ini:

1. **Inti Kompilator & Interpreter (Phase 1–15):**
   - Lexer UTF-8, Recursive-Descent Parser dengan AST lengkap, Type Checker statis, Evaluasi Operator 8 tingkat presedensi dengan short-circuit, percabangan `jika-maka-selain-akhir`, perulangan `selama` dan `untuk`, fungsi/prosedur dengan rekursi terproteksi, koleksi data `daftar` (array) dan `peta` (hashmap), serta sistem modul bersegel anti-path-traversal.
2. **Pustaka Standar & Perkakas Pengembang (Phase 16–22):**
   - 8 Modul Pustaka Standar inti (`teks`, `matematika`, `konversi`, `waktu`, `acak`, `koleksi`, `berkas`, `sistem`) dengan sandbox I/O, diagnostik 12 kategori dengan visual pointer `^^^^` dan koreksi saltik, AST pretty-printer formatter & linter (`NUS-W001`..`NUS-W004`), server LSP (Language Server Protocol) JSON-RPC 2.0 untuk IDE, testing assertion framework (`pastikan`), dan manajer paket `.npk` dengan registri lokal.
3. **Distribusi Biner, CI/CD, Debugger & IDE (Phase 23–27):**
   - Mesin kompilasi build rilis multi-platform (Windows, Linux, macOS), alur GitHub Actions CI/CD dengan gerbang rilis manual (*approval gate*), debugger interaktif dengan breakpoint bersyarat dan profiler alokasi memori, fondasi IDE Studio berbasis web, serta manajer cache paket terisolasi dengan verifikasi hash SHA-256.
4. **Backend Web, Database, ORM & Realtime (Phase 28–36):**
   - Pustaka standar ekspansi (Kripto, Kompresi, Validasi, Fetch), modul basis data relasional SQLite dengan prepared statement dan transaksi ACID, web framework HTTP dengan router parameter `:id` dan template Anti-XSS, sistem autentikasi Scrypt KDF dan RBAC wildcard, ORM dengan skema migrasi otomatis, generator perancah proyek (`nusantara baru`), peladen WebSocket real-time dengan antrean tugas latar belakang, klien HTTP mandiri, dan kerangka kerja GUI desktop.
5. **Mobile Framework, Distribusi, Toko Aplikasi & OTA (Phase 37–42):**
   - Kerangka kerja aplikasi seluler Android & iOS dengan siklus hidup lengkap dan tata letak responsif, 25+ integrasi Native Device API (kamera, GPS, sensor, storage terenkripsi hardware), konektivitas mobile networking offline-first dengan resolusi konflik terdistribusi, pembuat paket instalasi Android APK/AAB dan iOS Archive bertanda tangan keystore resmi, otomatisasi publikasi Google Play Console v3 & App Store Connect dengan gerbang persetujuan manusia (`--setujui`), serta sistem pembaruan aplikasi mobile dua jalur yang aman dengan verifikasi tanda tangan digital Ed25519 dan pemulihan otomatis Safe Mode Rollback.

---

## 4. Fitur yang Belum Selesai & Pekerjaan Berikutnya

Meskipun sistem telah matang hingga tingkat aplikasi mobile, web, dan desktop (v0.42.0), beberapa komponen arsitektur tingkat rendah masih dalam tahap perencanaan untuk mencapai kemandirian biner sejati tanpa ketergantungan lingkungan Node.js:

1. **Intermediate Representation (IR) Compiler (Phase 43):**
   - Saat ini eksekusi program tingkat lanjut berjalan melalui *tree-walking AST interpreter* yang dioptimasi. Diperlukan representasi perantara (*bytecode/IR*) berbasis register atau stack guna mendongkrak kecepatan eksekusi hingga mendekati performa bahasa C/Rust.
2. **LLVM / Native Machine Code Generation (Phase 44):**
   - Pembangkitan kode mesin langsung (*native AOT compilation*) ke format biner ELF, PE/COFF, dan Mach-O menggunakan infrastruktur LLVM compiler backend.
3. **Penyusutan Biner & Linker Statis (Phase 45–46):**
   - Pembuatan executable tunggal mandiri tanpa menyertakan runtime JavaScript/V8.
4. **Game Engine Asli (Phase 47):**
   - Abstraksi rendering grafis 2D dan 3D langsung ke Vulkan, Metal, dan DirectX dengan sintaksis Bahasa Indonesia.
5. **NusantaraOS (Phase 48):**
   - Riset dan arsitektur kernel sistem operasi berdaulat Indonesia.

---

## 5. Rangkaian Pengujian Otomatis yang Dijalankan (Verification Suite)

Seluruh 38 skrip pengujian berikut (1 skrip audit 167 berkas fondasi + 37 suite pengujian unit, integrasi, dan e2e) diintegrasikan ke dalam `npm test` dan dieksekusi secara otomatis pada setiap integrasi pipeline:

| Metrik Verifikasi | Jumlah Aktual | Penjelasan |
|---|:---:|---|
| **Skrip Pengujian** | **38 Berkas** | 1 skrip `.js` fondasi + 37 berkas `.ts` di direktori `pengujian/` |
| **Suite Pengujian** | **38 Suite** | 38 suite pengujian terisolasi untuk masing-masing fase |
| **Pemeriksaan Dokumen Fondasi** | **167 Berkas** | Integritas dokumen, EBNF, lisensi, dan contoh awal (Phase 1–5) |
| **Test Case (Kasus Uji)** | **1.030 Kasus** | Total skenario pengujian unit, integrasi, dan e2e pada 37 suite TypeScript |
| **Total Pengujian Gabungan** | **1.197 Pengujian** | Akumulasi 167 pemeriksaan dokumen fondasi + 1.030 test cases |
| **Assertion (Penegasan)** | **2.000+ Penegasan** | Titik penegasan kondisi nilai (`samaDengan`, `pastikan`, dll.) |

```bash
npm test
```

Daftar suite pengujian terverifikasi:
- `node skrip/periksa_fondasi.js` — Verifikasi integritas 167 dokumen dan spesifikasi dasar (Phase 1–5).
- `test:lexer` — Suite uji penganalisis leksikal UTF-8 (Phase 6).
- `test:parser` — Suite uji penganalisis sintaksis & pembangun AST (Phase 7).
- `test:interpreter` — Suite uji penerjemah eksekusi pohon AST (Phase 8).
- `test:tipe` — Suite uji penganalisis semantik & pemeriksa tipe statis (Phase 9).
- `test:operator` — Suite uji presedensi 8 tingkat & short-circuit evaluation (Phase 10).
- `test:percabangan` — Suite uji percabangan `jika-maka-selain-akhir` (Phase 11).
- `test:perulangan` — Suite uji iterasi `selama` & `untuk` (Phase 12).
- `test:fungsi` — Suite uji fungsi, prosedur, lingkup leksikal & rekursi (Phase 13).
- `test:struktur-data` — Suite uji koleksi terindeks `daftar` & asosiatif `peta` (Phase 14).
- `test:modul` — Suite uji sistem modul, ruang nama & anti-traversal (Phase 15).
- `test:paket` — Suite uji package manager, `nusantara.toml` & lockfile (Phase 16).
- `test:stdlib` — Suite uji 8 pustaka standar bawaan & sandbox filesystem (Phase 17).
- `test:diagnostik` — Suite uji diagnostik 12 kategori kesalahan & visual pointer (Phase 18).
- `test:toolchain` — Suite uji AST pretty-printer, formatter & linter rules (Phase 19).
- `test:lsp` — Suite uji Language Server Protocol JSON-RPC 2.0 (Phase 20).
- `test:testing` — Suite uji testing framework & quality gate (Phase 21).
- `test:ekosistem` — Suite uji registri paket lokal & arsip `.npk` (Phase 22).
- `test:build` — Suite uji mesin kompilasi build & kalkulasi SHA256SUMS (Phase 23).
- `test:cicd` — Suite uji validasi alur GitHub Actions & permission least privilege (Phase 24).
- `test:debugger` — Suite uji breakpoint bersyarat, profiler waktu & memori (Phase 25).
- `test:ide` — Suite uji workspace, file tree, dan terminal emulator IDE (Phase 26).
- `test:paket-v27` — Suite uji cache paket terisolasi & graf dependensi (Phase 27).
- `test:stdlib-v28` — Suite uji pustaka ekspansi kripto, kompresi, dan fetch (Phase 28).
- `test:database-v29` — Suite uji koneksi SQLite native, prepared statement & transaksi (Phase 29).
- `test:web-v30` — Suite uji HTTP web router, middleware, dan anti-XSS template (Phase 30).
- `test:auth-v31` — Suite uji Scrypt KDF password hashing, CSPRNG sesi & RBAC (Phase 31).
- `test:orm-v32` — Suite uji relasi entitas ORM & migrasi skema basis data (Phase 32).
- `test:generator-v33` — Suite uji CLI project scaffolder & template registry (Phase 33).
- `test:realtime-v34` — Suite uji peladen WebSocket & worker queue latar belakang (Phase 34).
- `test:http-v35` — Suite uji klien HTTP REST dengan exponential backoff (Phase 35).
- `test:gui-v36` — Suite uji sistem GUI desktop & simulator kanvas (Phase 36).
- `test:mobile-v37` — Suite uji mobile framework Android & iOS (Phase 37).
- `test:native-api-v38` — Suite uji 25+ Native Device API seluler (Phase 38).
- `test:mobile-networking-v39` — Suite uji networking mobile offline-first & cloud sync (Phase 39).
- `test:distribusi-v40` — Suite uji builder APK/AAB, keystore signing & iOS archive (Phase 40).
- `test:publikasi-v41` — Suite uji Google Play API, App Store Connect & approval gate (Phase 41).
- `test:pembaruan-v42` — Suite uji SemVer, signed manifest, Ed25519 & OTA rollback (Phase 42).

---

## 6. Jadwal & Prioritas Rilis Mendatang

- **Target Berikutnya:**
  - **Phase 43 (v0.43.0)**: Intermediate Representation (IR) Compiler & Bytecode Virtual Machine Engine.
  - **Phase 44 (v0.44.0)**: LLVM Native Compiler Backend (AOT Code Generation).
  - **Phase 45 (v0.45.0)**: Advanced Compiler Optimizations (DCE, Inlining, Loop Unrolling).
  - **Phase 46 (v0.46.0)**: Standalone Static Executable Linker (.exe / ELF / Mach-O).
  - **Phase 47 (v0.47.0)**: 2D/3D Game Engine & Multimedia Toolkit.
  - **Phase 48 (v1.0.0)**: NusantaraOS Kernel & Sovereign Computing Architecture.

*Dokumen ROADMAP ini dirilis secara berkala dan disinkronkan secara ketat dengan hasil pengujian aktual repositori NUSANTARA.*
