# Persiapan Build & Distribusi Apple iOS

Dokumen ini menjelaskan proses persiapan dan kompilasi aplikasi untuk ekosistem Apple iOS menggunakan Nusantara Mobile Framework.

---

## 1. Persyaratan Lingkungan
- **Sistem Operasi**: macOS (Sonoma atau Ventura direkomendasikan).
- **Perangkat Lunak**: Apple Xcode 15+ beserta Xcode Command Line Tools (`xcode-select --install`).
- **Apple Developer Account**: Akun pengembang Apple aktif (Individual atau Organization).

> **Catatan Batasan Platform**:  
> Lingkungan non-macOS (Windows & Linux) dapat melakukan validasi konfigurasi, pembuatan `Info.plist`, pemeriksaan aset, dan evaluasi checklist App Store, namun kompilasi native iOS IPA dan penandatanganan biner secara resmi mewajibkan lingkungan macOS dengan Xcode.

---

## 2. Memeriksa Lingkungan iOS via CLI
```bash
nusantara mobile distribusi ios periksa
```

Output akan menampilkan status host OS, ketersediaan `xcodebuild`, Bundle Identifier target, dan target minimum iOS Deployment.

---

## 3. Menyiapkan Xcode Archive (.xcarchive)
```bash
nusantara mobile distribusi ios archive
```

Perintah ini mempersiapkan struktur `.xcarchive` di direktori:
`dist/mobile/ios/archive/<bundle-id>-<versi>.xcarchive`

Di dalamnya terdapat:
- `Info.plist`: Informasi bundle aplikasi, versi, dan identitas signing.
- `ExportOptions.plist`: Konfigurasi metode ekspor (`app-store`, `ad-hoc`, atau `enterprise`).
