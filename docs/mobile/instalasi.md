# Instalasi & Persiapan Lingkungan Mobile

Dokumen ini menjelaskan langkah-langkah instalasi dan verifikasi toolchain pengembangan Nusantara Mobile pada sistem operasi pengembang.

---

## 1. Persyaratan Sistem

- **Sistem Operasi**: Windows 10/11, macOS (Ventura / Sonoma / Sequoia), atau distribusi Linux modern (Ubuntu 20.04+, Debian, Fedora, Arch).
- **Runtime NUSANTARA**: Versi `>= 0.37.0`.
- **Node.js**: Versi 18 LTS atau lebih baru.

---

## 2. Pemeriksaan Lingkungan Otomatis

Nusantara Mobile menyediakan perintah diagnostik cerdas untuk memverifikasi kesiapan toolchain pengembangan:

```bash
nusantara mobile periksa
```

Perintah ini akan memeriksa:
- Variabel lingkungan `ANDROID_HOME` / `ANDROID_SDK_ROOT`
- Java Development Kit (JDK 17+)
- Ketersediaan perintah `adb`
- Sistem operasi host macOS untuk target iOS
- Ketersediaan utilitas `xcodebuild` dan Xcode CLI Tools
- Kesiapan Simulator Desktop Preview

---

## 3. Menyiapkan Proyek Mobile Baru

Gunakan subperintah `nusantara mobile baru` atau generator template:

```bash
# Melalui CLI Mobile khusus
nusantara mobile baru aplikasi_ku

# Atau melalui Template Generator Proyek
nusantara new aplikasi_ku --template mobile
```
Perintah ini akan membuat struktur direktori lengkap termasuk konfigurasi `nusantara.json`, folder `android/`, folder `ios/`, dan `aset/`.
