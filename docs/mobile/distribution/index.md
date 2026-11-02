# NUSANTARA Mobile App Distribution & Publishing (Phase 40)

Selamat datang di dokumentasi resmi **Mobile App Distribution & Publishing** untuk bahasa pemrograman NUSANTARA v0.40.0.

Sistem distribusi ini dirancang untuk memfasilitasi pengembang bahasa NUSANTARA dalam mengemas, menandatangani, memvalidasi, dan mempersiapkan publikasi aplikasi mobile untuk platform **Android** dan **Apple iOS**.

---

## 1. Arsitektur Modul Distribusi
Arsitektur distribusi mobile terletak di `src/mobile/distribution/` dengan pembagian modul:

```
mobile/distribution/
├── core/
│   ├── DistributionManager.ts     # Fasad utama orkestrasi distribusi
│   ├── BuildManager.ts            # Orkestrator proses build multi-platform
│   ├── ReleaseManager.ts          # Pipeline rilis dan penataan laporan
│   └── VersionManager.ts          # Pengelola SemVer, versionCode, & build number
│
├── android/
│   ├── AndroidBuildManager.ts     # Pengelola build APK/AAB dan environment
│   ├── APKBuilder.ts              # Generator berkas APK debug & release
│   ├── AABBuilder.ts              # Generator Android App Bundle (.aab)
│   ├── AndroidSigning.ts          # Validasi keystore, alias, & password env
│   └── AndroidManifestManager.ts   # Generator dan validator AndroidManifest.xml
│
├── ios/
│   ├── IOSBuildManager.ts         # Pemeriksa host macOS dan Apple Xcode
│   ├── ArchiveManager.ts          # Persiapan struktur .xcarchive & plist
│   ├── CodeSigningManager.ts      # Apple Code Signing & ExportOptions.plist
│   └── ProvisioningManager.ts     # Validasi provisioning profile (.mobileprovision)
│
├── assets/
│   ├── IconManager.ts             # Spesifikasi ikon Android adaptive & iOS AppIcon
│   ├── SplashManager.ts           # Android 12+ SplashScreen API & LaunchScreen
│   └── AssetValidator.ts          # Validasi dimensi, format, dan batasan ukuran
│
├── config/
│   ├── DistributionConfig.ts      # Manajemen nusantara.mobile.json
│   ├── AndroidConfig.ts           # Validasi spesifik platform Android
│   └── IOSConfig.ts               # Validasi spesifik platform iOS
│
├── validation/
│   ├── BuildValidator.ts          # Validasi integritas biner artefak
│   ├── SigningValidator.ts        # Audit sertifikat & pencegahan secret leak
│   └── ReleaseValidator.ts        # Evaluasi checklist kelayakan toko aplikasi
│
└── reports/
    ├── BuildReport.ts             # Generator laporan JSON (build-report.json)
    └── ReleaseReport.ts           # Generator laporan Markdown (release-report.md)
```

---

## 2. Fitur Utama
1. **Dukungan Format Lengkap**: APK Debug, APK Release, Android App Bundle (.aab), serta struktur Xcode Archive (.xcarchive).
2. **Keamanan Prioritas Utama**:
   - Kata sandi keystore dan key alias tidak pernah disimpan plaintext dalam kode atau konfigurasi.
   - Menggunakan referensi Environment Variables (`NUSANTARA_RELEASE_KEYSTORE_PASS`).
   - Audit bebas bocoran kredensial sebelum pembuatan laporan rilis.
3. **Validasi Kesiapan Rilis (Release Validator)**: Memeriksa kelayakan Google Play Store dan Apple App Store secara komprehensif.
4. **Integrasi CLI & Standard Library**: Perintah `nusantara mobile distribusi` dan modul `std:mobile` terhubung langsung ke mesin distribusi.
5. **Dashboard Interaktif**: Halaman *NUSANTARA Mobile Distribution Center* di GUI Studio.
