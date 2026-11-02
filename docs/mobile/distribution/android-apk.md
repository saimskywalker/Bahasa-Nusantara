# Panduan Kompilasi & Pembuatan Android APK

Dokumen ini menjelaskan proses pembuatan paket instalasi Android Application Package (.apk) menggunakan Nusantara Mobile Framework.

---

## 1. Tipe Build APK
Nusantara Mobile mendukung dua tipe build APK:
1. **Debug APK**:
   - Ditujukan untuk pengujian lokal di emulator atau perangkat fisik pengembang.
   - Menggunakan keystore debug otomatis.
   - Logging aktif dan izin debugging terbuka.
2. **Release APK**:
   - Ditujukan untuk pengujian internal, sideloading mandiri, atau distribusi non-Play Store.
   - Wajib ditandatangani dengan keystore rilis resmi (v2/v3 signature scheme).
   - Simbol debug dan log sensitif disensor.

---

## 2. Perintah CLI untuk Build APK
```bash
# Membangun APK Debug
nusantara mobile distribusi android debug

# Membangun APK Release
nusantara mobile distribusi android release
```

Hasil kompilasi akan tersimpan di:
- `dist/mobile/android/debug/<id-aplikasi>-<versi>-debug.apk`
- `dist/mobile/android/release/<id-aplikasi>-<versi>-release.apk`

---

## 3. Struktur Berkas APK
Berkas APK yang dibangkitkan memuat struktur arsip standar Android:
- `AndroidManifest.xml`: Manifes aplikasi terverifikasi dengan package name, versi, dan izin.
- `classes.dex`: Biner bytecode eksekusi aplikasi mobile.
- `resources.arsc`: Indeks resource biner terkompilasi.
- `res/`: Aset visual, tata letak, dan ikon adaptif.
- `META-INF/`: Blok penandatanganan kriptografis (v1 JAR Signature & v2/v3 Full APK Signature).
