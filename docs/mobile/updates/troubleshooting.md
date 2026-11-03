# Panduan Pemecahan Masalah (Troubleshooting)

Berikut adalah panduan diagnosa dan penanganan kendala yang umum terjadi pada sistem pembaruan aplikasi mobile NUSANTARA.

## 1. Galat Verifikasi Tanda Tangan (UNTRUSTED_KEY_ID / SIGNATURE_MISMATCH)
- **Gejala**: Pesan `Kunci 'xyz' tidak dikenal atau sudah kedaluwarsa/dicabut` atau `Tanda tangan digital tidak cocok dengan konten manifest`.
- **Penyebab**:
  - Key ID yang digunakan server tidak terdaftar di `TrustManager`.
  - Berkas manifest mengalami modifikasi di perjalanan (misalnya proxy yang merusak format JSON atau modifikasi field tanpa penandatanganan ulang).
- **Solusi**:
  - Daftarkan kunci publik terbaru di `TrustManager.daftarkanKunci(...)`.
  - Pastikan penandatanganan dilakukan dengan `SignatureVerifier.tandaTangani(...)` setelah seluruh perubahan konten manifest selesai.

## 2. Galat Integritas Hash SHA-256 (INTEGRITY_MISMATCH)
- **Gejala**: `Hash SHA-256 tidak cocok (Harapan: ..., Ditemukan: ...)`.
- **Penyebab**: File aset terpotong (truncated) saat diunduh atau termodifikasi.
- **Solusi**:
  - Periksa koneksi jaringan dan cache server CDN.
  - Unduh ulang berkas atau picu rollback otomatis.

## 3. Galat Jalur Traversal Ditolak (PATH_TRAVERSAL_DETECTED)
- **Gejala**: `Percobaan Path Traversal terdeteksi pada jalur '../...'`.
- **Penyebab**: Berkas aset dalam manifest menyertakan karakter `../` atau jalur absolut.
- **Solusi**: Gunakan hanya jalur relatif bersih terhadap direktori resource (misal: `assets/themes/garuda.json`).

## 4. Biner Executable Ditolak (PROHIBITED_EXTENSION)
- **Gejala**: `Ekstensi '.dex' dilarang keras dalam pembaruan OTA`.
- **Penyebab**: Mencoba mendistribusikan kode eksekutabel lewat jalur OTA.
- **Solusi**: Pembaruan kode eksekutabel harus dirilis melalui Google Play Console (AAB/APK) atau App Store Connect (IPA).
