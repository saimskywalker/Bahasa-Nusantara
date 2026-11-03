# Checklist Kepatuhan Toko & Audit Rilis
**Bahasa Pemrograman NUSANTARA** — Versi `v0.41.0` (Fase 41)

## 1. Daftar Periksa Google Play Console

| Kriteria | Batas / Persyaratan | Status Verifikasi |
|----------|---------------------|-------------------|
| **Format Binary** | Android App Bundle (`.aab`) | Wajib untuk aplikasi baru |
| **Target SDK** | Minimum SDK 34 (Android 14) | Wajib (Validasi Otomatis) |
| **Version Code** | Bilangan bulat positif, lebih besar dari rilis sebelumnya | Wajib |
| **Signing Key** | Google Play App Signing atau Upload Keystore RSA 2048+ | Terverifikasi |
| **Judul Aplikasi** | Maksimal 30 karakter | Terverifikasi |
| **Deskripsi Singkat** | Maksimal 80 karakter | Terverifikasi |
| **Deskripsi Lengkap** | Maksimal 4000 karakter | Terverifikasi |
| **Ikon Aplikasi** | 512 x 512 pixel PNG (32-bit color, no alpha) | Terverifikasi |
| **Grafik Fitur** | 1024 x 500 pixel JPG / PNG | Terverifikasi |
| **Screenshot Layar** | Rasio 16:9 atau 9:16 (min. 2 gambar, maks. 8) | Terverifikasi |
| **Kebijakan Privasi** | URL valid HTTPS | Wajib untuk semua aplikasi |

## 2. Daftar Periksa Apple App Store Connect

| Kriteria | Batas / Persyaratan | Status Verifikasi |
|----------|---------------------|-------------------|
| **Format Binary** | Xcode Archive (`.xcarchive`) / Signed `.ipa` | Wajib |
| **Bundle Identifier** | Format Reverse-DNS (contoh: `id.nusantara.aplikasi`) | Wajib |
| **Deployment Target** | iOS 15.0 atau lebih tinggi | Disarankan |
| **Export Compliance** | `ITSAppUsesNonExemptEncryption` disetel ke `false` | Terverifikasi |
| **Nama Aplikasi** | Maksimal 30 karakter | Terverifikasi |
| **Subtitle** | Maksimal 30 karakter | Terverifikasi |
| **Kata Kunci (Keywords)** | Maksimal 100 karakter dipisah koma | Terverifikasi |
| **Deskripsi** | Maksimal 4000 karakter | Terverifikasi |
| **Screenshot iPhone** | Layar 6.7" (1290 x 2796 pixel) & 6.5" (1242 x 2688 pixel) | Terverifikasi |
| **Screenshot iPad** | Layar 12.9" (2048 x 2732 pixel) jika mendukung iPad | Terverifikasi |
| **Rating Usia** | Formulir kuesioner usia (4+, 9+, 12+, 17+) | Terverifikasi |

## 3. Batasan Nyata Toko Aplikasi: Aturan Rollback

Penting untuk dipahami oleh semua pengembang:
> **Google Play Store maupun Apple App Store TIDAK PERNAH mengizinkan penarikan atau penurunan versi (downgrade) langsung ke version code yang lebih rendah.**

### Prosedur Rollback Resmi (Forward-Fix Hotfix):
1. Identifikasi versi stabil terakhir (contoh: `1.0.0` dengan `versionCode: 100`).
2. Buat build darurat baru dari kode stabil tersebut.
3. Tingkatkan nomor rilis ke angka baru yang lebih tinggi (contoh: `1.0.2` dengan `versionCode: 102`).
4. Jalankan release pipeline ke track darurat atau produksi dengan persetujuan tim.
