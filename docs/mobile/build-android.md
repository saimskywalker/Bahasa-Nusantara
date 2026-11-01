# Proses Build & Distribusi Android (Android Packaging)

Panduan mengompilasi dan mengemas aplikasi Nusantara Mobile menjadi paket instalasi Android (`.apk`) atau paket distribusi Google Play Store (`.aab`).

---

## 1. Perintah Build CLI

Untuk memulai proses build Android:

```bash
# Build paket APK mode debug
nusantara mobile build android --tipe=apk

# Build paket Android App Bundle (AAB) untuk Google Play Store
nusantara mobile build android --tipe=aab
```

---

## 2. Struktur Build yang Dihasilkan

Framework akan secara otomatis:
1. Memvalidasi `nusantara.json` (ID paket, nomor versi, dan daftar izin).
2. Menghasilkan berkas `android/AndroidManifest.xml` dengan deklarasi *activity*, filter intent tautan dalam, dan izin keamanan.
3. Menghasilkan skrip `android/build.gradle` lengkap dengan konfigurasi `compileSdk 34`, `minSdk 24`, dan `targetSdk 34`.
4. Mengonfigurasi aturan optimasi dan pengecilan kode ProGuard/R8 (`proguard-rules.pro`).

---

## 3. Penandatanganan Rilis (*Release Signing*)

Untuk rilis produksi, konfigurasikan keystore penandatanganan pada file `build.gradle`:

```groovy
signingConfigs {
    release {
        storeFile file("kunci-rilis.keystore")
        storePassword System.getenv("KEYSTORE_PASSWORD")
        keyAlias "nusantara-key"
        keyPassword System.getenv("KEY_PASSWORD")
    }
}
```
Binary rilis akan dibuat di dalam direktori `build/android/outputs/`.
