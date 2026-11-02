# Panduan Pemecahan Masalah (Troubleshooting)

Dokumen ini memuat solusi atas kendala umum saat mengembangkan dan menguji integrasi native API Nusantara Mobile.

## 1. Galat: `IZIN_DITOLAK`
- **Penyebab**: Pengguna atau sistem menolak izin perangkat (misal: kamera atau lokasi).
- **Solusi**: Jangan memanggil ulang permintaan izin secara agresif. Tampilkan pesan edukatif dan arahkan pengguna ke menu Pengaturan Aplikasi sistem (`Settings -> Apps -> Permissions`).

## 2. Galat: `PATH_TIDAK_AMAN`
- **Penyebab**: Percobaan pembacaan atau penulisan berkas dengan path yang mengandung `..` (path traversal).
- **Solusi**: Gunakan nama berkas relatif tanpa traversal. Seluruh berkas aplikasi dibatasi pada direktori sandbox dokumen internal.

## 3. Galat: `TIDAK_DIDUKUNG`
- **Penyebab**: Fitur perangkat keras tidak tersedia pada platform aktif (contoh: sensor cahaya ambient pada iOS publik).
- **Solusi**: Periksa ketersediaan fitur terlebih dahulu menggunakan `seluler.dapatkanKemampuanPerangkat()` atau `periksaNativeAPI()`.

## 4. Emulator Android atau Simulator iOS Tidak Ditemukan
- **Penyebab**: Perintah `nusantara mobile jalankan` dijalankan di lingkungan Linux/Windows tanpa Android SDK atau Xcode.
- **Solusi**: Nusantara Mobile CLI secara otomatis beralih ke Desktop Mobile Simulator yang dapat menguji 100% fungsionalitas aplikasi dan API perangkat tanpa memerlukan SDK berat.
