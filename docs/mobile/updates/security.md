# Panduan Pengerasan Keamanan (Security Hardening)

Keamanan adalah pilar fundamental dari sistem pembaruan NUSANTARA Mobile. Berikut adalah mekanisme mitigasi terhadap vektor serangan pembaruan perangkat lunak:

## 1. Mitigasi Man-in-the-Middle (MitM)
- Enforce koneksi HTTPS TLS 1.3 dengan verifikasi sertifikat server.
- Tanda tangan digital Ed25519 pada setiap manifest pembaruan.
- Digest SHA-256 diverifikasi secara independen sebelum file dipindahkan ke direktori kerja aplikasi.

## 2. Mitigasi Arbitrary Code Execution (Injeksi Kode Biner)
- Daftar hitam ekstensi terlarang: `.dex`, `.apk`, `.aab`, `.so`, `.dylib`, `.dll`, `.exe`, `.bin`, `.jar`, `.class`, `.sh`, `.bat`.
- Sistem file direktori penyimpanan resource OTA di-mount dengan flag non-executable jika didukung oleh kernel OS mobile.

## 3. Mitigasi Path Traversal & Zip-Slip
- Fungsi `UpdateSecurityPolicy.periksaPathTraversal` menyaring karakter `../` dan `/..`.
- Jalur absolut (dimulai dengan `/` atau `C:\`) langsung ditolak.
- Fungsi `periksaZipSlip` memastikan berkas yang didekompresi tidak keluar dari direktori tujuan.

## 4. Mitigasi Decompression Bomb & DoS
- Maksimum ukuran berkas tunggal: 50 MB.
- Maksimum total bundle: 100 MB.
- Maksimum jumlah berkas per rilis: 500 berkas.
- Batas rasio ekspansi dekompresi maksimum 100:1.
