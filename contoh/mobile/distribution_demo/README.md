# Proyek Percontohan Distribusi Aplikasi Mobile NUSANTARA

Repositori ini memuat contoh proyek aplikasi mobile berbasis **Bahasa Pemrograman NUSANTARA** yang mendemonstrasikan sistem distribusi, konfigurasi Android (APK & AAB), persiapan Apple iOS (Archive), dan pengelolaan versi.

## Struktur Direktori
```
distribution-demo/
├── nusantara.mobile.json    # Konfigurasi manifest distribusi proyek
├── README.md               # Dokumentasi panduan proyek
├── src/
│   └── main.nusantara      # Kode sumber logika aplikasi
└── assets/
    ├── icon/               # Aset ikon aplikasi (mdpi, hdpi, playstore, appstore)
    └── splash/             # Aset gambar splash screen
```

## Menjalankan Pengujian Melalui CLI NUSANTARA
```bash
# 1. Menampilkan informasi konfigurasi distribusi
nusantara mobile distribusi konfigurasi

# 2. Memeriksa kesiapan toolchain sistem
nusantara mobile distribusi periksa

# 3. Membangun APK Android (Debug)
nusantara mobile distribusi android debug

# 4. Membangun Android App Bundle (Release AAB)
nusantara mobile distribusi android aab

# 5. Mempersiapkan struktur Apple iOS Archive
nusantara mobile distribusi ios archive

# 6. Menjalankan evaluasi checklist kelayakan publikasi
nusantara mobile distribusi rilis checklist
```
