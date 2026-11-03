# Contoh Proyek: Nusantara Mobile Update & OTA Demo

Proyek demonstrasi resmi untuk fitur **Mobile App Update System & Over-the-Air Updates (OTA)** pada bahasa pemrograman NUSANTARA (v0.42.0).

## Struktur Berkas

```
examples/mobile/update-demo/
├── nusantara.mobile.json          # Konfigurasi aplikasi mobile & parameter update
├── update-manifest.json           # Contoh manifest pembaruan bertanda tangan
├── README.md                      # Panduan penggunaan proyek contoh
├── src/
│   └── main.nusantara             # Skrip program utama demo
└── resources/
    ├── themes/
    │   └── garuda-dark.json       # Aset tema visual OTA
    ├── locales/
    │   ├── id.json                # Paket lokalisasi Bahasa Indonesia
    │   └── en.json                # Paket lokalisasi Bahasa Inggris
    └── config/
        └── app_config.json        # Berkas konfigurasi dinamis aplikasi
```

## Cara Menjalankan

### 1. Menjalankan Skrip Demo NUSANTARA
```bash
nusantara jalankan examples/mobile/update-demo/src/main.nusantara
```

### 2. Menggunakan Perintah CLI Pembaruan
```bash
# Periksa ketersediaan pembaruan
nusantara mobile update periksa

# Evaluasi SemVer klien vs server
nusantara mobile update versi

# Validasi berkas manifest pembaruan lokal
nusantara mobile update manifest examples/mobile/update-demo/update-manifest.json

# Unduh resource OTA
nusantara mobile update resource unduh

# Periksa status integrasi toko (Google Play / Apple App Store)
nusantara mobile update store

# Tampilkan laporan audit lengkap
nusantara mobile update laporan
```

## Prinsip Kepatuhan & Keamanan
1. **Arsitektur Dua Jalur**: Biner native (.apk, .aab, .ipa) diperbarui secara eksklusif melalui Google Play Store dan Apple App Store.
2. **Resource OTA Aman**: Hanya berkas non-eksekutabel (JSON tema, font, gambar, lokalisasi) yang dapat diunduh melalui OTA.
3. **Integritas & Tanda Tangan**: Setiap berkas diverifikasi menggunakan hash SHA-256 dan ditandatangani dengan kunci publik terpercaya Ed25519.
4. **Rollback Otomatis**: Jika terjadi kegagalan rendering atau crash runtime, snapshot cadangan sebelumnya langsung dipulihkan secara instan.
