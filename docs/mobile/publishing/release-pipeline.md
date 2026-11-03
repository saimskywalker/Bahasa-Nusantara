# Panduan 11-Stage Release Pipeline Otomatis
**Bahasa Pemrograman NUSANTARA** — Versi `v0.41.0` (Fase 41)

## 1. Tahapan Pipeline Rilis Terpadu

Release Pipeline NUSANTARA Mobile dirancang untuk mengeksekusi 11 tahapan ketat secara berurutan:

```
[1. Validasi Konfigurasi]
         │
[2. Pengujian Otomatis]
         │
[3. Kompilasi Binary (AAB/Archive)]
         │
[4. Validasi Integritas Binary]
         │
[5. Validasi Penandatanganan (Signing)]
         │
[6. Validasi Metadata & Aset Grafis]
         │
[7. Pemeriksaan Kesiapan Rilis]
         │
[8. Gerbang Persetujuan Pengguna (Approval Gate)] ◄── Wajib Persetujuan untuk Production!
         │
[9. Pengunggahan ke Toko Aplikasi]
         │
[10. Validasi Status Pemrosesan]
         │
[11. Pembuatan Laporan Rilis (Markdown & JSON)]
```

## 2. Rincian Setiap Tahapan

1. **Validasi Konfigurasi**: Memastikan file `nusantara.mobile.json` ada, sintaks valid, dan nilai penting terdefinisi.
2. **Pengujian Otomatis**: Menjalankan test suite unit dan integrasi aplikasi untuk memastikan tidak ada regresi.
3. **Kompilasi Binary**: Menghasilkan artefak rilis berupa Android App Bundle (`.aab`) atau Apple Xcode Archive (`.xcarchive`).
4. **Validasi Integritas Binary**: Memverifikasi ukuran file, checksum, dan kelayakan format paket binary.
5. **Validasi Penandatanganan**: Memeriksa sertifikat release keystore (Android) atau profil provisi & sertifikat distribusi (iOS).
6. **Validasi Metadata & Aset**: Memverifikasi batas karakter judul, deskripsi, kelengkapan terjemahan 7 bahasa, dan resolusi pixel aset visual.
7. **Pemeriksaan Kesiapan Rilis**: Menghitung skor kesiapan rilis (0–100%) dan memastikan tidak ada isu pemblokir (*blocker*).
8. **Gerbang Persetujuan (Approval Gate)**: Menghentikan eksekusi jika target adalah produksi tanpa flag persetujuan eksplisit.
9. **Pengunggahan ke Toko Aplikasi**: Mengunggah binary ke Google Play Console (Edit API) atau App Store Connect.
10. **Validasi Status Pemrosesan**: Memeriksa respons toko bahwa file binary berhasil diunggah dan diterima untuk diproses.
11. **Pembuatan Laporan Rilis**: Menyusun ringkasan rilis dalam format JSON dan Markdown ke direktori `dist/mobile/reports/`.

## 3. Eksekusi Melalui Baris Perintah

```bash
# Menjalankan validasi pra-rilis tanpa mengunggah ke toko
nusantara mobile store pipeline jalankan --hanya-validasi

# Rilis otomatis ke track pengujian internal
nusantara mobile store pipeline jalankan --target=internal

# Rilis ke produksi dengan persetujuan eksplisit
nusantara mobile store pipeline jalankan --target=production --setujui
```
