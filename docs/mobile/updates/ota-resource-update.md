# Pembaruan Resource & Konten OTA (Over-the-Air)

Pembaruan Resource OTA memungkinkan pengembang memperbarui aset visual dan data tanpa merilis ulang berkas instalasi biner aplikasi ke Google Play atau App Store.

## Tipe Resource yang Diizinkan
- `theme`: Berkas konfigurasi warna, skema gelap/terang, dan gaya UI (.json)
- `localization`: Berkas terjemahan string bahasa (.json)
- `fonts`: Berkas tipografi (.ttf, .otf, .woff2)
- `images`: Berkas grafis (.png, .jpg, .webp, .svg)
- `config`: Konfigurasi perilaku aplikasi (.json)
- `template`: Skema tata letak statis

## Siklus Hidup Penerapan OTA
1. **Pemeriksaan Manifest**: Server mengirimkan daftar berkas, ukuran, dan SHA-256.
2. **Validasi Tanda Tangan**: Manifest diverifikasi menggunakan kunci Ed25519 `TrustManager`.
3. **Pengunduhan Aman**: Berkas diunduh melalui HTTPS ke folder sementara (staging).
4. **Verifikasi Integritas**: Tiap berkas diuji terhadap hash SHA-256 64-karakter.
5. **Pencadangan (Backup)**: Snapshot versi aktif saat ini disimpan untuk rollback.
6. **Aktivasi Atomik (Swap)**: Direktori staging ditukar secara instan dengan direktori aktif.
