# Google Play In-App Updates (Android)

Untuk pembaruan biner aplikasi pada platform Android, NUSANTARA Mobile mengintegrasikan API resmi **Google Play Core AppUpdateManager**.

## Alur Pembaruan yang Didukung

### 1. Flexible In-App Update
- Pengunduhan biner berjalan di latar belakang (background) selagi pengguna tetap menggunakan aplikasi.
- Setelah pengunduhan 100% selesai, aplikasi menampilkan snackbar konfirmasi untuk me-restart aplikasi dan memasang versi terbaru.

### 2. Immediate In-App Update
- Dialog layar penuh yang memblokir akses aplikasi sampai seluruh proses unduh dan instalasi selesai.
- Digunakan untuk pembaruan wajib (mandatory) atau perbaikan celah keamanan kritis (security patch).

## Implementasi CLI
```bash
# Memeriksa status ketersediaan di Google Play
nusantara mobile update store
```
