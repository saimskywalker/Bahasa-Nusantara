# API Sistem Berkas Sandbox (File System API)

API untuk membaca, menulis, dan mengelola berkas lokal di dalam sandbox penyimpanan aplikasi dengan proteksi anti-path traversal.

## Nama API
- `berkas.baca`: Membaca konten teks dari berkas sandbox aplikasi.
- `berkas.tulis`: Menulis konten teks ke berkas sandbox aplikasi.
- `berkas.hapus`: Menghapus berkas dalam direktori aplikasi.

## Keamanan & Validasi Path
1. **Proteksi Path Traversal**: Jalur berkas yang mengandung urutan `..` atau karakter escape terlarang akan langsung ditolak (`PATH_TIDAK_AMAN`).
2. **Isolasi Sandbox**: Aplikasi hanya dapat mengakses direktori dokumen dan cache internal milik aplikasi sendiri (sesuai aturan Scoped Storage Android dan Sandbox iOS).

## Contoh Kode NUSANTARA
```nusantara
gunakan "std:mobile" sebagai seluler

program TulisCatatan
mulai
  parameter : peta = {
    "jalur": "catatan_harian.txt",
    "konten": "Belajar bahasa Nusantara Mobile Fase 38"
  }
  hasil : peta = seluler.panggilNative("berkas.tulis", parameter)
  tampilkan("Status Tulis: " + hasil["pesan"])
selesai
```
