# Pengelolaan Keystore & Penandatanganan Android (Android App Signing)

Penandatanganan kriptografis menjamin integritas biner aplikasi dan memastikan pembaruan aplikasi hanya dapat dilakukan oleh pemilik sah kunci privat.

---

## 1. Prinsip Keamanan Wajib
1. **Dilarang Menyimpan Kata Sandi Plaintext**: Jangan menyimpan password keystore atau alias di file kode sumber atau file konfigurasi Git.
2. **Gunakan Environment Variables**:
   - `NUSANTARA_RELEASE_KEYSTORE_PASS`: Kata sandi berkas keystore.
   - `NUSANTARA_RELEASE_KEY_PASS`: Kata sandi untuk alias kunci.
3. **Tambahkan ke `.gitignore`**:
   Pastikan pola `*.keystore` dan `*.jks` terdaftar di `.gitignore` agar berkas kunci privat tidak pernah terunggah ke repositori publik.
4. **Kunci yang Hilang Tidak Dapat Dipulihkan**:
   Jika Anda kehilangan kunci privat rilis, Anda **tidak akan pernah dapat memperbarui aplikasi** yang ada di Google Play Store (kecuali Anda menggunakan Google Play App Signing dan mengajukan reset kunci ke dukungan resmi Google).

---

## 2. Membuat Keystore Rilis Menggunakan Keytool
Jalankan perintah berikut di terminal:

```bash
keytool -genkey -v \
  -keystore release.keystore \
  -alias nusantara_release \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=Aplikasi Nusantara, O=Nusantara, C=ID"
```

---

## 3. Memeriksa Konfigurasi Signing via CLI
```bash
nusantara mobile distribusi android tanda-tangan
```
Perintah ini akan memvalidasi keberadaan berkas keystore, validitas alias, dan memastikan skema penandatanganan v2/v3 aktif.
