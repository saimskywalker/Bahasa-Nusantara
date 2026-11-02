# Checklist & Persiapan Publikasi ke Apple App Store

Mempublikasikan aplikasi ke Apple App Store memerlukan kepatuhan terhadap pedoman peninjauan aplikasi (*App Store Review Guidelines*).

---

## 1. Metadata Wajib App Store Connect
Setiap aplikasi wajib melengkapi informasi berikut di App Store Connect:
1. **Nama Aplikasi (App Name)**: Maksimal 30 karakter, unik di seluruh App Store.
2. **Subtitle**: Maksimal 30 karakter, merangkum fungsi utama aplikasi.
3. **Deskripsi Aplikasi**: Penjelasan lengkap fitur, nilai tambah, dan cara kerja aplikasi.
4. **Keywords**: Kata kunci pencarian yang dipisahkan tanda koma (maksimal 100 karakter total).
5. **Kategori Primer & Sekunder**: Menentukan penempatan aplikasi di tab kategori App Store.
6. **URL Kebijakan Privasi (Privacy Policy URL)**: Wajib aktif dan dapat diakses publik.
7. **URL Dukungan (Support URL)**: Tautan bantuan atau kontak pengembang bagi pengguna.
8. **Rating Usia (Age Rating)**: Kuesioner konten mengenai kekerasan, konten dewasa, atau akses internet terbuka.
9. **Label Nutrisi Privasi (App Privacy Details)**: Deklarasi pengumpulan data pengguna (identitas, analitik, diagnostik).

---

## 2. Persyaratan Aset Visual
- **Ikon Aplikasi Utama**: 1024x1024 piksel, format PNG, resolusi 72 DPI, tanpa transparansi (alpha channel).
- **Tangkapan Layar (Screenshots)**:
  - iPhone Layar 6.7" / 6.5" (misal: 1290 x 2796 atau 1284 x 2778 piksel).
  - iPhone Layar 5.5" (misal: 1242 x 2208 piksel).
  - iPad Pro Layar 12.9" (jika aplikasi mendukung perangkat iPad).

---

## 3. Menjalankan Evaluasi Checklist via CLI
```bash
nusantara mobile distribusi ios validasi
```
Perintah ini mengecek kelengkapan item checklist App Store dan memberikan peringatan dini atas metadata yang belum terkonfigurasi.
