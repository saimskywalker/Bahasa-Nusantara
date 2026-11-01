# Proses Build & Distribusi iOS (iOS Packaging)

Panduan membangun paket aplikasi iOS (`.ipa`), penyiapan sertifikat penandatanganan kode Apple Developer, dan pengunggahan ke App Store / TestFlight.

---

## 1. Perintah Build CLI

Jalankan perintah berikut di lingkungan macOS:

```bash
# Membangun konfigurasi proyek dan bundle iOS
nusantara mobile build ios

# Membangun paket distribusi IPA
nusantara mobile build ios --tipe=ipa
```

---

## 2. Artefak Manifes yang Dihasilkan

Framework secara otomatis menyusun:
1. **`ios/Info.plist`**:
   - `CFBundleIdentifier`: Mengambil nilai dari `id` di `nusantara.json`.
   - `CFBundleShortVersionString`: Mengambil versi aplikasi.
   - `CFBundleVersion`: Nomor build bertambah.
   - Entri teks alasan privasi (`NSCameraUsageDescription`, `NSLocationWhenInUseUsageDescription`, dll).
   - Skema URL tautan dalam (`CFBundleURLSchemes`).
2. **`ios/Podfile`**: Menetapkan `platform :ios, '15.0'` dan deklarasi kerangka kerja.

---

## 3. Penandatanganan Kode & Arsip Xcode

Buka workspace di Xcode untuk mengatur profil provisi (*provisioning profile*) dan tim Apple Developer:

```bash
open ios/Aplikasi.xcworkspace
```
Di Xcode:
1. Pilih target aplikasi -> tab **Signing & Capabilities**.
2. Pilih Team Developer Anda.
3. Menu **Product** -> **Archive** untuk menghasilkan berkas arsip siap kirim ke App Store Connect.
