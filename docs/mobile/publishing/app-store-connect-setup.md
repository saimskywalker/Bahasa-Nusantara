# Panduan Konfigurasi App Store Connect API & TestFlight
**Bahasa Pemrograman NUSANTARA** — Versi `v0.41.0` (Fase 41)

## 1. Persyaratan Kredensial Apple Developer

Untuk mengintegrasikan pengunggahan build iOS dan distribusi TestFlight:

1. Masuk ke portal [App Store Connect](https://appstoreconnect.apple.com/).
2. Masuk ke **Pengguna dan Akses** -> tab **Integrasi** -> **App Store Connect API**.
3. Buat Kunci API baru dengan peran **App Manager** atau **Admin**.
4. Catat informasi berikut:
   - **Issuer ID** (UUID dari bagian atas halaman).
   - **Key ID** (10 digit alfanumerik dari kunci yang dibuat).
   - Unduh berkas kunci privat `.p8` (hanya dapat diunduh 1 kali!).

## 2. Variabel Lingkungan yang Didukung

| Variabel Lingkungan | Deskripsi |
|---------------------|-----------|
| `APP_STORE_CONNECT_API_KEY_P8` | Konten mentah kunci privat `.p8` (dimulai `-----BEGIN PRIVATE KEY-----`) |
| `APP_STORE_CONNECT_KEY_ID` | 10 digit Key ID Apple |
| `APP_STORE_CONNECT_ISSUER_ID` | UUID Issuer ID dari App Store Connect |
| `APP_STORE_BUNDLE_ID` | Bundle Identifier resmi (contoh: `id.nusantara.aplikasi`) |

Kredensial di atas dienkapsulasi oleh `AppStoreConnectClient`. Token otentikasi JWT yang dihasilkan ditandatangani menggunakan algoritma **ES256** dan memiliki batas masa berlaku (*TTL*) 20 menit (1200 detik).

## 3. Distribusi Beta TestFlight

Setelah binary `.xcarchive` atau `.ipa` diunggah ke App Store Connect:
1. Status pemrosesan Apple akan berubah dari *Processing* menjadi *Ready for TestFlight*.
2. Pengujian **Internal QA** dapat langsung menguji build tanpa tinjauan review Apple.
3. Pengujian **Eksternal** (publik) memerlukan peninjauan singkat pertama kali per versi.
4. Setiap build TestFlight memiliki masa kedaluwarsa resmi **90 hari**.

## 4. Kepatuhan Ekspor Kriptografi (Export Compliance)

Apple mewajibkan setiap aplikasi mendeklarasikan penggunaan enkripsi:
- Jika aplikasi hanya menggunakan HTTPS standar atau enkripsi bawaan sistem operasi, deklarasikan `ITSAppUsesNonExemptEncryption = false`.
- Nusantara Mobile otomatis menyematkan deklarasi kepatuhan ekspor ini dalam konfigurasi Info.plist agar build tidak tertahan di App Store Connect.
