# NUSANTARA

> **Bahasa Pemrograman 100% Bahasa Indonesia untuk Komputasi Modern, Terbuka, dan Berkelanjutan.**

[![Status](https://img.shields.io/badge/status-fase_42:_mobile_app_update_system_&_ota-blue.svg)](ROADMAP.md)
[![Versi](https://img.shields.io/badge/versi-v0.42.0-emerald.svg)](PERUBAHAN.md)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-passing-brightgreen.svg)](.github/workflows/ci.yml)
[![Lisensi](https://img.shields.io/badge/lisensi-Apache_2.0-blue.svg)](LISENSI)
[![Tata Bahasa](https://img.shields.io/badge/grammar-EBNF_ISO--14977-purple.svg)](dokumentasi/GRAMMAR-EBNF.md)
[![Testing](https://img.shields.io/badge/testing-38_suites_lulus_100%25-green.svg)](pengujian/README.md)
[![Mobile OTA](https://img.shields.io/badge/mobile_ota-in--app_&_cloud_updates-blue.svg)](docs/mobile/updates/index.md)
[![Mobile CI/CD](https://img.shields.io/badge/mobile_cicd-fastlane_&_github_actions-purple.svg)](docs/mobile/cicd/index.md)
[![Distribusi](https://img.shields.io/badge/distribusi-android_apk_aab_&_ios-blue.svg)](docs/mobile/distribution/index.md)
[![Networking](https://img.shields.io/badge/networking-offline_first_&_cloud-blue.svg)](docs/mobile/networking/01_arsitektur_networking_mobile.md)
[![Native API](https://img.shields.io/badge/native_api-android_&_ios-purple.svg)](docs/mobile/native-api/pengenalan-native-api.md)
[![Mobile Framework](https://img.shields.io/badge/mobile-android_&_ios-purple.svg)](docs/mobile/01_pendahuluan.md)
[![Desktop GUI](https://img.shields.io/badge/desktop-gui_framework-indigo.svg)](docs/desktop/pengenalan-gui.md)
[![Autentikasi](https://img.shields.io/badge/keamanan-scrypt_&_rbac-red.svg)](docs/referensi/authentication.md)
[![Web & REST](https://img.shields.io/badge/web-framework_&_rest_api-cyan.svg)](docs/referensi/web-framework.md)
[![Database](https://img.shields.io/badge/database-sqlite_native-amber.svg)](docs/referensi/database.md)

---

## 1. Tentang NUSANTARA

**NUSANTARA** adalah bahasa pemrograman serba guna (*general-purpose programming language*) tingkat tinggi yang dirancang dan dikembangkan dari nol menggunakan 100% tata bahasa, kata kunci teknis, dan leksikon Bahasa Indonesia.

NUSANTARA bukan sekadar terjemahan sintaksis atau praprosesor teks atas bahasa asing, melainkan rekayasa perangkat lunak mandiri yang mencakup arsitektur kompilasi lengkap: *Lexer*, *Parser (Recursive Descent AST)*, *Sistem Tipe Statis & Inferensi*, *Pohon Sintaksis Abstrak*, *Interpreter Eksekusi*, *CLI Toolkit*, *Pustaka Standar (std)*, *Ekosistem Aplikasi Web & Desktop*, hingga *Platform Mobile Lintas-Platform (Android & iOS) dengan Sistem Pembaruan OTA Mandiri*.

### Visi & Misi Proyek
- **Kedaulatan Teknologi & Bahasa:** Memberikan kemandirian dalam ekosistem perangkat lunak nasional melalui bahasa pemrograman formal berstandar internasional (ISO/IEC 14977 EBNF).
- **Akselerasi Edukasi Komputasi:** Menghilangkan batasan bahasa asing bagi pelajar dan pengembang di seluruh Nusantara dalam memahami konsep algoritma, struktur data, dan rekayasa perangkat lunak.
- **Produksi Industri & Multiplatform:** Mampu digunakan untuk membangun utilitas terminal, layanan API web, aplikasi desktop GUI, hingga aplikasi seluler produksi lengkap dengan pipeline distribusi dan pembaruan berkala.
- **Evolusi Menuju Sistem Operasi:** Menjadi fondasi runtime dan bahasa pemrograman utama bagi proyek jangka panjang **NusantaraOS**.

---

## 2. Status Perkembangan Proyek & Roadmap

- **Status Saat Ini:** **🟢 Phase 42: Mobile App Update System & Over-the-Air (OTA) Updates (Milestone v0.42.0)**.
- **Total Fase Diaudit:** 48 Fase (Phase 1 s/d Phase 48).
  - 🟢 **Selesai dan Teruji (Phase 1 s/d Phase 42):** 42 fase berstatus implementasi nyata lengkap dengan rangkaian pengujian unit, integrasi, dan e2e.
  - 🔵 **Dalam Perencanaan (Phase 43 s/d Phase 48):** 6 fase riset lanjutan (Bytecode Engine, LLVM AOT Compiler, Optimasi Lanjut, Native Linker, 2D/3D Engine, dan Kernel NusantaraOS).
- **Rangkaian Pengujian:** 38 test suite otomatis lulus 100% (mencakup 167 modul fondasi inti, CLI, parser, interpreter, database, web, desktop, native API, dan OTA updates).
- **Audit Terakhir:** 3 November 2026.
- **Dokumentasi Roadmap Lengkap:** Silakan baca [ROADMAP.md](ROADMAP.md) untuk tabel detail status, bukti implementasi, dan rencana pengembangan fase 1 hingga 48.

---

## 3. Fitur yang Benar-Benar Sudah Tersedia

Seluruh fitur di bawah ini telah diverifikasi melalui audit kode sumber (`src/`) dan rangkaian pengujian otomatis (`pengujian/`):

### A. Inti Bahasa, Tata Bahasa & Kompiler
- **Spesifikasi Bahasa Formal (EBNF ISO/IEC 14977):** Struktur leksikal, tata bahasa, dan konvensi penamaan leksikon Indonesia.
- **Sistem Tipe Statis & Inferensi Tipe:** Tipe primitif (`bilangan`, `teks`, `logika`, `kosong`), tipe komposit (`larik`, `kamus`), dan tipe bentukan (`struktur`).
- **Lexer & Tokenizer:** Pemindaian token presisi dengan penanda posisi baris dan kolom.
- **Parser & Pohon Sintaksis Abstrak (AST):** Parsing rekursif dengan penanganan galat sintaksis informatif.
- **Interpreter Eksekusi:** Evaluasi ekspresi aritmetika/logika, percabangan (`jika`, `jika_tidak`, `jika_tidak_maka`), perulangan (`selama`, `untuk`), dan definisi fungsi (`fungsi ... kembali`).
- **CLI Toolkit Lengkap:** `nusantara jalankan`, `nusantara cek`, `nusantara format`, `nusantara uji`, `nusantara repl`, `nusantara bangun`.

### B. Runtime, Ekosistem Server & Desktop
- **Pustaka Standar (`std`):** Operasi matematika (`std::matematika`), manipulasi string (`std::teks`), sistem berkas (`std::berkas`), waktu (`std::waktu`), JSON (`std::json`), dan kriptografi (`std::kripto`).
- **Penyimpanan Data & Database:** Driver SQLite terintegrasi, Query Builder tipe aman, migrasi skema, dan ORM sederhana.
- **Framework Web & REST API:** Router HTTP berbasis leksikon Indonesia, penanganan middleware (CORS, Logger, Rate Limiter), otentikasi token JWT/Sesi, dan validasi muatan JSON.
- **Komunikasi Realtime:** Server WebSocket mandiri, penanganan kanal/ruang siaran, dan manajer tugas latar belakang (*background workers*).
- **Framework Desktop GUI:** Manajemen jendela, sistem tata letak kontainer (Flex/Grid), komponen tombol, label, bidang input, dan penangan acara berbasis sinyal.

### C. Ekosistem Mobile Lintas-Platform (Android & iOS)
- **Framework Aplikasi Seluler:** Sistem komponen reaktif seluler, navigasi tumpukan (*stack navigation*), dan manajemen status global.
- **Native Device APIs (25 Modul):** Kamera, geolokasi/GPS, akselerometer, sensor biometrik (sidik jari/wajah), penyimpanan aman (Keystore/Keychain), getaran (haptik), jaringan, baterai, papan klip, dan notifikasi lokal.
- **Networking Mobile:** Arsitektur *offline-first*, sinkronisasi data awan bertahap (*delta sync*), penyimpan cache lokal, dan manajer antrean permintaan offline.
- **Mobile Distribution & Publishing:** Pembuat paket Android APK & AAB, penandatanganan Keystore, Apple iOS Archive & Code Signing, validator kelayakan rilis Play Store/App Store, dan pelapor build.
- **Mobile CI/CD & Store Automation:** Integrasi GitHub Actions & Fastlane, generator alur kerja otomatis, manajemen rahasia/sertifikat, dan otomatisasi rilis TestFlight/Play Store Internal.
- **Mobile App Update & OTA Engine (Phase 42):** Pemeriksa pembaruan dalam aplikasi (*in-app update*), pengunduh aman berverifikasi SHA-256, delta patcher, hot-reload bundle OTA JavaScript/Nusantara, pemulihan rollback otomatis jika instalasi gagal, dan banner notifikasi pembaruan ramah pengguna.

---

## 4. Contoh Kode NUSANTARA (100% Sesuai Tata Bahasa)

Contoh kode berikut telah teruji dan dapat langsung dieksekusi oleh interpreter NUSANTARA:

### 4.1 Program Dasar
```nusantara
program HaloDunia
mulai
    pesan : teks = "Selamat datang di Bahasa Pemrograman NUSANTARA!"
    tampilkan(pesan)

    angka_a : bilangan = 10
    angka_b : bilangan = 32
    total : bilangan = angka_a + angka_b
    tampilkan("Hasil penjumlahan 10 + 32 =", total)
selesai
```

### 4.2 Fungsi dan Percabangan Logika
```nusantara
fungsi hitung_faktorial(n : bilangan) : bilangan
mulai
    jika n <= 1 maka
        kembalikan 1
    selain
        kembalikan n * hitung_faktorial(n - 1)
    akhir
selesai

program HitungFaktorial
mulai
    bil : bilangan = 5
    hasil : bilangan = hitung_faktorial(bil)
    tampilkan("Faktorial dari 5 adalah:", hasil)
selesai
```

### 4.3 Struktur Data Komposit (Daftar & Peta)
```nusantara
program DataPengguna
mulai
    pengguna : peta = {
        nama: "Budi Santoso",
        usia: 28,
        aktif: benar
    }
    daftar_keahlian : daftar = ["TypeScript", "Nusantara", "Mobile"]

    tampilkan("Nama Pengguna:", pengguna["nama"])
    tampilkan("Usia:", pengguna["usia"])
    tampilkan("Jumlah Keahlian:", panjang(daftar_keahlian))
selesai
```

---

## 5. Instalasi & Menjalankan Proyek

### 5.1 Menggunakan Paket Biner Rilis Resmi
Unduh paket distribusi untuk sistem operasi Anda dari direktori `dist/` atau halaman rilis resmi:

- **Windows (x64)**: `nusantara-v0.42.0-windows-x64.zip`
- **Linux (x64)**: `nusantara-v0.42.0-linux-x64.tar.gz` atau `.zip`
- **macOS (Intel x64)**: `nusantara-v0.42.0-macos-x64.tar.gz`
- **macOS (Apple Silicon ARM64)**: `nusantara-v0.42.0-macos-arm64.tar.gz`

#### Langkah Pemasangan Cepat (Linux / macOS):
```bash
# 1. Ekstrak arsip rilis
tar -xzf nusantara-v0.42.0-linux-x64.tar.gz
cd nusantara-v0.42.0-linux-x64

# 2. Jalankan skrip instalasi otomatis ke PATH pengguna
./install.sh

# 3. Verifikasi instalasi di terminal
nusantara --versi
```

Pada Windows:
1. Ekstrak berkas `nusantara-v0.42.0-windows-x64.zip`.
2. Klik ganda berkas `install.bat` atau tambahkan direktori `bin` ke variabel lingkungan `PATH`.
3. Buka PowerShell / Command Prompt dan jalankan:
   ```powershell
   nusantara --versi
   ```

### 5.2 Membangun dari Sumber (Build From Source)
Kebutuhan lingkungan:
- Node.js versi 18 LTS ke atas (disarankan Node.js 22 LTS).
- npm versi 9 ke atas.

```bash
# 1. Klon repositori proyek
git clone https://github.com/sarjanabahasaarab/Bahasa-Nusantara.git
cd Bahasa-Nusantara

# 2. Pasang dependensi
npm install

# 3. Jalankan pengujian mutu menyeluruh
npm test

# 4. Bangun bundel distribusi
npm run build
```

---

## 6. Dokumentasi Teknis

Dokumentasi resmi tersusun secara terstruktur di dalam direktori `docs/` dan `dokumentasi/`:

- **Tata Bahasa Formal:** [dokumentasi/GRAMMAR-EBNF.md](dokumentasi/GRAMMAR-EBNF.md)
- **Pembaruan Aplikasi Seluler & OTA (Fase 42):** [docs/mobile/updates/index.md](docs/mobile/updates/index.md) (18 panduan lengkap)
- **CI/CD & Otomatisasi Store Mobile (Fase 41):** [docs/mobile/cicd/index.md](docs/mobile/cicd/index.md)
- **Distribusi & Penerbitan Mobile (Fase 40):** [docs/mobile/distribution/index.md](docs/mobile/distribution/index.md) (14 panduan)
- **Jaringan & Sinkronisasi Seluler (Fase 39):** [docs/mobile/networking/01_arsitektur_networking_mobile.md](docs/mobile/networking/01_arsitektur_networking_mobile.md) (13 panduan)
- **API Perangkat Keras Seluler Asli (Fase 38):** [docs/mobile/native-api/pengenalan-native-api.md](docs/mobile/native-api/pengenalan-native-api.md) (25 panduan)
- **Kerangka Kerja Seluler (Fase 37):** [docs/mobile/01_pendahuluan.md](docs/mobile/01_pendahuluan.md)
- **Antarmuka Desktop GUI (Fase 36):** [docs/desktop/pengenalan-gui.md](docs/desktop/pengenalan-gui.md)
- **Klien HTTP & Integrasi API Eksternal (Fase 35):** [docs/referensi/http-client.md](docs/referensi/http-client.md)
- **WebSocket & Pekerja Latar Belakang (Fase 34):** [docs/referensi/realtime.md](docs/referensi/realtime.md)
- **Object-Relational Mapping / ORM (Fase 32):** [docs/referensi/orm.md](docs/referensi/orm.md)
- **Autentikasi, Sesi & Keamanan RBAC (Fase 31):** [docs/referensi/authentication.md](docs/referensi/authentication.md)
- **Framework Web & Server HTTP (Fase 30):** [docs/referensi/web-framework.md](docs/referensi/web-framework.md)
- **Basis Data API & SQLite Native (Fase 29):** [docs/referensi/database.md](docs/referensi/database.md)

---

## 7. Arsitektur Saluran Pipa Kompilasi

```text
Source Code (.nusantara)
         │
         ▼
 ┌───────────────┐
 │     Lexer     │  <-- [PHASE 6 (v0.6.0)]
 └───────────────┘
         │
         ▼
   TokenStream
         │
         ▼
 ┌───────────────┐
 │    Parser     │  <-- [PHASE 7 (v0.7.0)]
 └───────────────┘
         │
         ▼
 Pohon AST & Type Checker <-- [PHASE 8-14]
         │
         ▼
 Modul & Pustaka Standar  <-- [PHASE 15 & 17]
         │
         ▼
 Testing & Quality Gate   <-- [PHASE 21 (v0.21.0)]
         │
         ▼
 Package & Local Registry <-- [PHASE 22 (v0.22.0)]
         │
         ▼
 Multi-Platform Targets   <-- [PHASE 23-42]
 ├── Desktop GUI App      (Linux, macOS, Windows)
 ├── Web & REST Backend   (Server HTTP, WebSocket, DB)
 ├── Mobile App Bundles   (Android APK/AAB, iOS Archive)
 └── OTA Update Server    (Delta Bundles, Signature Verify)
```

---

## 8. Panduan Kontribusi (Contributing)

Kami menyambut hangat kontribusi dari seluruh pengembang, akademisi, dan praktisi teknologi untuk memajukan ekosistem NUSANTARA.

1. **Laporkan Isu atau Gagasan:** Buka *Issue* di GitHub jika menemukan kutu (*bug*), inkonsistensi tata bahasa, atau usulan pustaka baru.
2. **Fork Repositori:** Buat *branch* fitur baru dari `main` dengan format nama `fitur/nama-fitur` atau `perbaikan/nama-kutu`.
3. **Patuhi Standar Penamaan:** Seluruh API publik dan pustaka standar wajib menggunakan istilah Bahasa Indonesia baku yang jelas.
4. **Sertakan Pengujian Otomatis:** Setiap perubahan kode wajib disertai berkas pengujian di direktori `pengujian/` dan lulus pengujian `npm test`.
5. **Kirim Pull Request:** Jelaskan perubahan secara rinci pada templat Pull Request dan pastikan build CI/CD berstatus hijau.

---

## 9. Lisensi

Proyek Bahasa Pemrograman NUSANTARA dilindungi di bawah lisensi terbuka [Apache License 2.0](LISENSI).
Hak Cipta (c) 2026 Komunitas Bahasa Pemrograman NUSANTARA.
Semua orang bebas menggunakan, mempelajari, memodifikasi, dan mendistribusikan perangkat lunak ini sesuai dengan syarat dan ketentuan lisensi.
