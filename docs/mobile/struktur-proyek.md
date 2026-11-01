# Struktur Proyek Nusantara Mobile

Struktur folder terstandar untuk aplikasi Nusantara Mobile dirancang agar rapi, modular, dan memisahkan kode logika dari artefak spesifik platform.

---

## 1. Tata Letak Direktori

```text
proyek_mobile/
├── nusantara.json            # Berkas manifes & konfigurasi aplikasi mobile
├── aplikasi.nusantara        # Titik masuk utama aplikasi (entrypoint)
├── aset/                     # Direktori aset gambar, suara, font, ikon
│   ├── gambar/
│   └── font/
├── android/                  # Berkas build & konfigurasi platform Android
│   ├── AndroidManifest.xml   # Manifes Android resmi yang di-generate
│   └── build.gradle          # Skrip build Gradle tingkat modul aplikasi
├── ios/                      # Berkas konfigurasi platform iOS
│   ├── Info.plist            # Manifes properti aplikasi iOS
│   └── Podfile               # Konfigurasi dependensi CocoaPods
└── build/                    # Direktori artefak kompilasi (APK, AAB, IPA)
```

---

## 2. Peran Masing-Masing Berkas

1. **`nusantara.json`**: Menyimpan identitas unik aplikasi (*Package ID / Bundle Identifier*), versi aplikasi, nomor build, izin yang diminta, orientasi default, dan tema.
2. **`aplikasi.nusantara`**: Tempat logika aplikasi dideklarasikan, mencakup navigasi halaman, widget UI, serta penanganan peristiwa sentuhan.
3. **`aset/`**: Semua aset statis diperiksa keamanannya oleh `PengelolaAsetMobile` untuk mencegah serangan path traversal.
4. **`android/` dan `ios/`**: Menyimpan template konfigurasi yang dikelola oleh `AndroidBuildManager` dan `IOSBuildManager`.
