# Panduan Android App Bundle (.aab) untuk Google Play Store

Android App Bundle (.aab) adalah format publikasi resmi yang diwajibkan oleh Google Play Store untuk seluruh aplikasi baru.

---

## 1. Mengapa Android App Bundle?
- **Dynamic Delivery**: Google Play menghasilkan APK yang dioptimalkan sesuai arsitektur CPU dan densitas layar perangkat pengguna.
- **Ukuran Unduhan Lebih Ringkas**: Mengurangi ukuran unduhan aplikasi rata-rata hingga 15-35%.
- **Google Play App Signing**: Memungkinkan Google mengelola dan mengamankan kunci penandatanganan aplikasi.

---

## 2. Perintah CLI untuk Build AAB
```bash
nusantara mobile distribusi android aab
```

Hasil berkas AAB akan disimpan pada direktori:
`dist/mobile/android/release/<id-aplikasi>-<versi>.aab`

---

## 3. Ketentuan Google Play untuk AAB
1. **Target SDK Minimum**: Wajib menargetkan SDK minimal 33 atau 34 (`targetSdkVersion >= 34`).
2. **Penandatanganan Kunci**: Ditandatangani menggunakan kunci unggahan (*upload key*) yang cocok dengan sertifikat di Google Play Console.
3. **Versi Kode Unik**: Nilai `versionCode` (bilangan bulat positif) harus selalu lebih tinggi daripada versi yang telah diterbitkan sebelumnya di Play Console.
