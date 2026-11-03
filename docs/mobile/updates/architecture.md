# Arsitektur Sistem Pembaruan Nusantara Mobile (Strict Boundary Architecture)

## 1. Prinsip Batas Ketat (Strict Boundary)

NUSANTARA Mobile membagi sistem pembaruan menjadi dua domain yang terisolasi secara mutlak:

```
                          [Pemeriksaan Versi Aplikasi]
                                       |
                 ---------------------------------------------
                 |                                           |
    [Pembaruan Biner Asli (Native)]             [Pembaruan Resource OTA]
                 |                                           |
      - Kode Mesin / Bytecode                     - Berkas Tema (.json)
      - Jembatan Kotlin / Swift                   - Paket Lokalisasi (i18n)
      - Native Library (.so / .dylib)             - Font & Gambar Statis
                 |                                           |
   [Google Play & App Store Saja]               [CDN Terenkripsi HTTPS]
   - Android: Play In-App Updates               - Validasi SHA-256 Per File
   - iOS: StoreKit Deep Link                    - Tanda Tangan Digital Ed25519
   - Sideload Bypass DILARANG                   - Atomic Staging Swap & Rollback
```

## 2. Kepatuhan Toko Aplikasi (Store Policy Compliance)

- **Apple App Store Review Guidelines (Aturan 2.5.2):** Aplikasi tidak boleh mengunduh, menginstal, atau mengeksekusi kode yang memperkenalkan fitur atau fungsi baru di luar kode biner yang disetujui. NUSANTARA Mobile secara ketat melarang bypass biner executable. Fitur OTA hanya mengubah data pasif seperti tema visual, konfigurasi teks, dan aset grafis.
- **Google Play Device & Network Abuse Policy:** Pembaruan yang mengubah kode biner aplikasi di luar mekanisme Google Play Core dilarang keras. Modul NUSANTARA Mobile menerapkan jembatan resmi `GooglePlayInAppUpdate` untuk seluruh pembaruan executable.
