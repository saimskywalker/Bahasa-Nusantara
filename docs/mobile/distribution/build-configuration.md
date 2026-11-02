# Konfigurasi Build & Profil Lingkungan (Build Configuration)

Konfigurasi distribusi Nusantara Mobile dikelola secara deklaratif melalui berkas `nusantara.mobile.json` di akar direktori proyek.

---

## 1. Struktur `nusantara.mobile.json`
```json
{
  "application": {
    "name": "Aplikasi Toko Nusantara",
    "id": "id.nusantara.toko",
    "version": "1.0.0",
    "versionCode": 1,
    "buildNumber": 1
  },
  "android": {
    "minSdk": 24,
    "targetSdk": 34,
    "buildTypes": ["debug", "release"],
    "output": "dist/mobile/android",
    "permissions": [
      "android.permission.INTERNET",
      "android.permission.ACCESS_NETWORK_STATE"
    ]
  },
  "ios": {
    "deploymentTarget": "15.0",
    "bundleId": "id.nusantara.toko",
    "output": "dist/mobile/ios"
  },
  "assets": {
    "icon": "aset/ikon/app-icon.png",
    "splash": "aset/splash/splash.png"
  }
}
```

---

## 2. Profil Lingkungan Distribusi
Nusantara Mobile menyediakan 4 profil lingkungan yang dapat diaktifkan:
1. `development`: Logging maksimal, debug signing bawaan, URL endpoint lokal.
2. `testing`: Logging terkendali, pengujian integrasi otomatis.
3. `staging`: Konfigurasi mirip produksi dengan penanda nama `(Staging)` dan endpoint backend pra-rilis.
4. `production`: Keamanan ketat, validasi sertifikat TLS penuh, keystore rilis resmi, audit bebas rahasia hardcoded.

Mengalihkan profil lingkungan via CLI:
```bash
nusantara mobile distribusi konfigurasi production
```
