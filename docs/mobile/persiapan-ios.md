# Persiapan Lingkungan iOS

Panduan konfigurasi lingkungan macOS, Xcode, dan iOS Simulator untuk pengujian dan kompilasi aplikasi iOS.

---

## 1. Persyaratan Platform

- **Perangkat Keras**: Komputer Apple Mac (Apple Silicon M1/M2/M3 atau Intel).
- **Sistem Operasi**: macOS Ventura 13.0 atau yang lebih baru.
- **Perangkat Lunak**: Xcode 15.0 atau yang lebih baru dari Mac App Store.

> **Catatan Pengembang Windows & Linux**:
> Pengembangan antarmuka pengguna, navigasi, logika bisnis, dan API perangkat dapat diuji 100% menggunakan Simulator Desktop Preview tanpa memerlukan Mac. Namun untuk menghasilkan binary `.ipa` atau menjalankan iOS Simulator resmi, lingkungan macOS diperlukan.

---

## 2. Instalasi Xcode Command Line Tools

Jalankan perintah berikut di Terminal macOS:

```bash
xcode-select --install
```

Verifikasi jalur aktif:
```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

---

## 3. Konfigurasi CocoaPods (Opsional)

Jika proyek Anda menggunakan dependensi native bridge pihak ketiga:

```bash
sudo gem install cocoapods
# atau via Homebrew:
brew install cocoapods
```

---

## 4. Membuka Simulator iOS

```bash
open -a Simulator
```
Nusantara Mobile CLI akan mendeteksi simulator aktif secara otomatis saat menjalankan `nusantara mobile jalankan ios`.
