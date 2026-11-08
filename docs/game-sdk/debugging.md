# Pemecahan Masalah & Profiling (Debugging & Profiling)

**NUSANTARA Programming Language — Game Development Kit (v0.47.0)**

---

## 1. Tolok Ukur & Profiling via CLI

Gunakan perintah CLI untuk mengukur performa game engine:

```bash
nusantara game benchmark
```

Hasil tolok ukur mencakup:
- **Throughput Simulasi (FPS)**
- **Rata-rata Waktu Frame (`ms`)**
- **Waktu Eksekusi Total**
- **Jumlah Panggilan Gambar (`Draw Calls`)**
- **Jumlah Poligon Segitiga (`Triangles`)**

---

## 2. Inspeksi Konfigurasi Game

```bash
nusantara game inspect
```
Menampilkan konfigurasi aktif, resolusi viewport, mode renderer, dan subsistem yang terpasang.
