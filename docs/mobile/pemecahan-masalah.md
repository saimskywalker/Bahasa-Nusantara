# Pemecahan Masalah (Troubleshooting & FAQs)

Kumpulan solusi untuk kendala umum yang mungkin dihadapi selama pengembangan aplikasi Nusantara Mobile.

---

## 1. Variabel Lingkungan Android Tidak Ditemukan

**Gejala**: Perintah `nusantara mobile periksa` menampilkan peringatan bahwa `ANDROID_HOME` belum diatur.

**Solusi**:
Tambahkan variabel lingkungan ke file konfigurasi profil shell Anda (`~/.bashrc` atau `~/.zshrc`):
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```
Lalu muat ulang dengan `source ~/.bashrc`.

---

## 2. Gagal Membangun iOS di Linux atau Windows

**Gejala**: `nusantara mobile build ios` melaporkan peringatan bahwa OS saat ini bukan macOS.

**Solusi**:
Kompilasi native binary iOS (`.ipa`) memerlukan SDK kepemilikan Apple yang hanya tersedia secara legal di sistem operasi macOS. Anda tetap dapat mengembangkan logika antarmuka dan seluruh fitur menggunakan **Desktop Mobile Preview**:
```bash
nusantara mobile jalankan desktop
```

---

## 3. Galat Permintaan Izin Ditolak

**Gejala**: Panggilan sensor kamera atau lokasi menimbulkan pengecualian "Akses tidak diberikan".

**Solusi**:
1. Pastikan izin telah didaftarkan dalam `daftarIzin` pada berkas `nusantara.json`.
2. Selalu panggil `mintaIzin(jenis, alasan)` sebelum mengakses API yang membutuhkan hak akses runtime.

---

## 4. Path Traversal Error pada Aset

**Gejala**: `PengelolaAsetMobile` menolak pemuatan aset gambar dengan pesan keamanan.

**Solusi**:
Jangan gunakan awalan `./../` atau jalur di luar folder `aset/`. Semua berkas aset harus berada di dalam direktori `aset/` dan menggunakan format ekstensi standar yang diizinkan (`.png`, `.jpg`, `.svg`, dll).
