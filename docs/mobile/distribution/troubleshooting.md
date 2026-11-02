# Panduan Mengatasi Kendala (Troubleshooting)

Dokumen ini memuat solusi untuk kendala yang kerap dijumpai selama proses build, signing, dan verifikasi distribusi aplikasi mobile.

---

## 1. Kendala Android
### Masalah: `targetSdkVersion di bawah batas Google Play`
- **Penyebab**: `targetSdk` diatur di bawah 33 atau 34.
- **Solusi**: Perbarui `targetSdk` menjadi minimal 34 di `nusantara.mobile.json`.

### Masalah: `Berkas keystore tidak ditemukan`
- **Penyebab**: Jalur berkas `.keystore` pada konfigurasi salah atau berkas belum dibuat.
- **Solusi**: Buat keystore baru menggunakan utilitas `keytool` sesuai panduan di `docs/mobile/distribution/android-signing.md` dan pastikan jalurnya dicantumkan dengan benar.

### Masalah: `Variabel lingkungan sandi keystore belum diatur`
- **Penyebab**: `NUSANTARA_RELEASE_KEYSTORE_PASS` atau `NUSANTARA_RELEASE_KEY_PASS` belum diekspor di sesi shell.
- **Solusi**: Jalankan `export NUSANTARA_RELEASE_KEYSTORE_PASS="rahasiaAnda"` di terminal sebelum menjalankan build rilis.

---

## 2. Kendala Apple iOS
### Masalah: `Host sistem saat ini bukan macOS`
- **Penyebab**: Proses archive atau ekspor IPA dijalankan di sistem Windows atau Linux.
- **Solusi**: Kompilasi native iOS dan penandatanganan Apple Code Signing wajib dijalankan di komputer berbasis macOS yang telah terpasang Xcode dan sertifikat pengembang Apple.

### Masalah: `Missing Info.plist key NSCameraUsageDescription`
- **Penyebab**: Aplikasi menggunakan modul kamera tetapi belum menyertakan alasan izin.
- **Solusi**: Tambahkan entri deskripsi izin pada konfigurasi `ios.deskripsiIzin` di `nusantara.mobile.json`.
