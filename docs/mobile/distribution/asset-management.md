# Pengelolaan Aset Ikon & Splash Screen (Asset Management)

Aplikasi mobile membutuhkan serangkaian aset visual yang memenuhi resolusi, aspek rasio, dan spesifikasi format yang berbeda antara Android dan iOS.

---

## 1. Spesifikasi Ikon Aplikasi

### Android Adaptive Icons
Android 8.0 (API level 26) ke atas menggunakan ikon adaptif yang terdiri dari dua lapisan:
- **Lapisan Depan (Foreground)**: 432x432 piksel (108dp @ 4x), transparan di luar area lambang utama (area aman 66dp tengah).
- **Lapisan Belakang (Background)**: 432x432 piksel, warna solid atau tekstur latar.
- **Ikon Legacy Android**:
  - `mdpi`: 48x48 px
  - `hdpi`: 72x72 px
  - `xhdpi`: 96x96 px
  - `xxhdpi`: 144x144 px
  - `xxxhdpi`: 192x192 px
  - `Google Play Store Icon`: 512x512 px PNG tanpa alpha

### Apple iOS App Icons
- **App Store Icon**: 1024x1024 piksel PNG (wajib tanpa alpha channel).
- **iPhone Retina (2x & 3x)**: 120x120 px, 180x180 px.
- **Spotlight & Settings**: 58x58 px, 80x80 px, 87x87 px.

---

## 2. Spesifikasi Splash Screen
- **Android 12+ (API 31+)**:
  Menggunakan `Theme.SplashScreen` bawaan sistem dengan `windowSplashScreenBackground` dan `windowSplashScreenAnimatedIcon`.
- **iOS LaunchScreen**:
  Menggunakan `LaunchScreen.storyboard` yang responsif di seluruh rasio layar iPhone dan iPad.

---

## 3. Validasi Aset Melalui CLI
```bash
nusantara mobile distribusi aset periksa
```
Perintah ini memverifikasi dimensi, aspek rasio (wajib 1:1 untuk ikon), batasan ukuran berkas (ikon maks 2MB, splash maks 5MB), dan melaporkan aset yang belum tersedia di disk.
