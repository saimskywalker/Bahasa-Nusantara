# Aplikasi Percontohan Publikasi Toko Mobile (Phase 41)
**NUSANTARA Mobile App Store Integration & Automated Release**

Proyek contoh ini mendemonstrasikan integrasi toko aplikasi resmi (Google Play Store dan Apple App Store / TestFlight) menggunakan bahasa pemrograman NUSANTARA dan Standard Library `std:mobile`.

## Struktur Direktori

```
app-publishing-demo/
├── main.nusantara           # Skrip utama NUSANTARA mendemonstrasikan API std:mobile
├── nusantara.mobile.json    # Konfigurasi mobile & toko aplikasi
├── store-metadata/          # Cantuman toko multibahasa
│   ├── id/listing.json      # Metadata Bahasa Indonesia
│   └── en/listing.json      # Metadata Bahasa Inggris
└── README.md                # Dokumentasi proyek contoh
```

## Cara Menjalankan

### 1. Menjalankan Skrip .nusantara
```bash
nusantara jalankan examples/mobile/app-publishing-demo/main.nusantara
```

### 2. Memeriksa Kesiapan Rilis Melalui CLI
```bash
nusantara mobile store periksa
```

### 3. Memvalidasi Cantuman Metadata & Aset
```bash
nusantara mobile store android metadata
nusantara mobile store ios metadata
nusantara mobile store aset
```

### 4. Menjalankan Release Pipeline
```bash
# Validasi menyeluruh 11-stage tanpa unggah ke toko
nusantara mobile store pipeline jalankan --hanya-validasi

# Rilis ke track internal testing
nusantara mobile store pipeline jalankan --target=internal
```
