# Matriks Kesiapan Rilis (Release Checklist)

Sebelum mempublikasikan aplikasi ke Google Play Store atau Apple App Store, jalankan pemeriksaan Release Validator untuk memastikan aplikasi memenuhi seluruh regulasi toko aplikasi.

---

## 1. Menjalankan Evaluasi Checklist
```bash
nusantara mobile distribusi rilis checklist
```

---

## 2. Rincian Item Pemeriksaan

### Kategori Android
- **Application ID / Package Name**: Terdiri dari minimal dua segmen alfanumerik yang valid dan tidak menggunakan awalan terlarang (`android.*`, `java.*`).
- **Android versionCode**: Bilangan bulat positif monoton naik.
- **Target SDK**: Sesuai kebijakan Google Play Store (`targetSdkVersion >= 34`).
- **Keystore Signing**: Berkas keystore rilis tersedia, alias sah, dan skema signature v2/v3 aktif.
- **Audit Izin Manifes**: Izin yang dideklarasikan tidak melebihi kebutuhan fungsional aplikasi.

### Kategori Apple iOS
- **Bundle Identifier**: Format reverse-DNS yang sah (`id.nusantara.aplikasi`).
- **iOS Build Number**: `CFBundleVersion` bernilai bilangan bulat positif.
- **Host macOS & Xcode**: Ketersediaan lingkungan Apple Xcode untuk ekspor archive.
- **Apple Code Signing**: Identitas sertifikat `Apple Distribution` dan provisioning profile sah.
- **Deskripsi Privasi**: Setiap izin yang sensitif (kamera, lokasi, mikrofon) memiliki teks deskripsi alasan di `Info.plist`.

### Kategori Keamanan & Metadata
- **Audit Kredensial Hardcoded**: Memastikan tidak ada kata sandi keystore atau token privat yang tertanam di kode atau konfigurasi.
- **URL Kebijakan Privasi**: Wajib tersedia dan dapat diakses publik.
- **SemVer Format**: Mengikuti konvensi `MAYOR.MINOR.PATCH`.
