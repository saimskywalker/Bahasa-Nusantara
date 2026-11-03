# Panduan Mobile App Store Integration & Automated Release
**Bahasa Pemrograman NUSANTARA** — Versi `v0.41.0` (Fase 41)

## 1. Ikhtisar Arsitektur

Modul **Nusantara Mobile Publishing** (`src/mobile/publishing/`) menyediakan infrastruktur komprehensif untuk persiapan, validasi, orkestrasi rilis otomatis, dan integrasi dengan toko aplikasi resmi:
- **Google Play Console** (Google Play Developer API v3)
- **Apple App Store Connect** (App Store Connect API v1)
- **TestFlight** (Distribusi Beta Publik & Internal)

```
                         +-----------------------------------+
                         |       Nusantara Mobile App        |
                         |        (AAB / .xcarchive)         |
                         +-----------------+-----------------+
                                           |
                                           v
                         +-----------------------------------+
                         |   Validasi Integritas & Signing   |
                         +-----------------+-----------------+
                                           |
                                           v
                         +-----------------------------------+
                         |    Metadata & Asset Validation    |
                         |   (Lokalisasi 7 Bahasa, Rasio)    |
                         +-----------------+-----------------+
                                           |
                                           v
                         +-----------------------------------+
                         |     Gerbang Persetujuan Rilis     |
                         |      (Production Approval Gate)   |
                         +-----------------+-----------------+
                                           |
                    +----------------------+----------------------+
                    |                                             |
                    v                                             v
     +-----------------------------+               +-----------------------------+
     |   Google Play Developer API |               |   App Store Connect API     |
     | - Tracks (Internal, Closed) |               | - TestFlight Beta Groups    |
     | - Staged Rollout (10%-100%) |               | - Export Compliance         |
     | - AAB Upload & Listings     |               | - Review Submission         |
     +-----------------------------+               +-----------------------------+
                    |                                             |
                    +----------------------+----------------------+
                                           |
                                           v
                         +-----------------------------------+
                         |      Riwayat & Audit Trail        |
                         |       (Markdown & JSON)           |
                         +-----------------------------------+
```

## 2. Fitur Utama

1. **Google Play Developer API**:
   - Mendukung 4 track rilis: `internal`, `closed` (alpha), `open` (beta), dan `production`.
   - Unggah Android App Bundle (`.aab`) terverifikasi.
   - Kebijakan Target SDK minimum 34 (Android 14+) sesuai mandat Google Play.
   - Peluncuran bertahap (*staged rollout*) dengan rasio terkontrol (10%, 25%, 50%, 100%).
   - Sinkronisasi metadata toko multi-bahasa.

2. **Apple App Store Connect & TestFlight**:
   - Otentikasi aman JWT ES256 menggunakan App Store Connect API Key (`.p8`).
   - Persiapan dan pengunggahan `.xcarchive` / `.ipa`.
   - Distribusi TestFlight beta untuk penguji internal dan eksternal.
   - Pelacakan masa berlaku build (90 hari).
   - Deklarasi ekspor kepatuhan kriptografi (*Export Compliance*).

3. **Metadata & Lokalisasi**:
   - Dukungan resmi 7 bahasa: Indonesia (`id`), Inggris (`en`), Melayu (`ms`), Arab (`ar`), Jepang (`ja`), Mandarin (`zh`), Spanyol (`es`).
   - Validasi batas karakter (Nama aplikasi maks 30 kar, deskripsi singkat maks 80 kar, deskripsi lengkap maks 4000 kar).
   - Validasi dimensi aset grafis (Ikon 512x512, Feature Graphic 1024x500, Screenshot berbagai ukuran layar ponsel dan tablet).
   - Pembangkit catatan rilis otomatis (*Release Notes Generator*) dari Git commits dan CHANGELOG dengan batas 500 karakter.

4. **Gerbang Persetujuan Rilis (Approval Gate)**:
   - Rilis ke track non-produksi (`internal`, `closed`, `testflight`) dapat berjalan secara otomatis setelah validasi lulus.
   - Rilis ke track **PRODUCTION** mewajibkan persetujuan eksplisit manusia (`--setujui`) untuk mencegah insiden publikasi tidak disengaja.

5. **Rencana Pemulihan & Rollback**:
   - Pendekatan jujur terhadap batasan toko aplikasi: Google Play dan Apple App Store **tidak mengizinkan downgrade langsung** ke nomor versi/version code sebelumnya.
   - Solusi rollback resmi: **Forward-Fix / Hotfix Release** yang menaikkan `versionCode` dan `buildNumber` baru dengan basis kode stabil sebelumnya.

## 3. Perintah CLI

```bash
# Periksa kesiapan toko
nusantara mobile store periksa

# Uji koneksi API toko (Sandbox / Live API)
nusantara mobile store koneksi android
nusantara mobile store koneksi ios

# Kelola dan validasi metadata
nusantara mobile store android metadata
nusantara mobile store ios metadata

# Validasi kepatuhan toko
nusantara mobile store android validasi
nusantara mobile store ios validasi

# Periksa status TestFlight beta
nusantara mobile store ios testflight

# Validasi aset grafis
nusantara mobile store aset

# Buat catatan rilis otomatis
nusantara mobile store release-notes

# Jalankan 11-Stage Release Pipeline
nusantara mobile store pipeline jalankan --hanya-validasi
nusantara mobile store pipeline jalankan --target=internal
nusantara mobile store pipeline jalankan --target=production --setujui

# Riwayat audit dan laporan publikasi
nusantara mobile store history
nusantara mobile store laporan
```

## 4. Penggunaan di Kode NUSANTARA (`std:mobile`)

```nusantara
gunakan "std:mobile" sebagai seluler

program RilisTokoAplikasi
mulai
    // 1. Evaluasi kesiapan rilis toko
    kesiapan : peta = seluler.periksaKesiapanTokoMobile()
    tampilkan("Kesiapan Toko   :", kesiapan["valid"])
    tampilkan("Skor Kesiapan   :", kesiapan["skorKesiapan"])

    // 2. Buat draft catatan rilis otomatis
    catatan : peta = seluler.buatCatatanRilisMobile("1.0.0", 1)
    tampilkan("Catatan Versi   :", catatan["versi"])

    // 3. Buat laporan publikasi terpadu
    laporan : peta = seluler.buatLaporanPublikasiMobile()
    tampilkan("Laporan Publikasi:", laporan["idLaporan"])
selesai
```
