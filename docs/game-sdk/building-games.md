# Membangun & Mengemas Game (Building & Packaging)

**NUSANTARA Programming Language — Game Development Kit (v0.47.0)**

---

## 1. Membangun Paket Distribusi Game

Untuk mengemas game menjadi bundel mandiri (*distribution bundle*):

```bash
nusantara game build
```

Perintah ini akan:
1. Memvalidasi sintaksis dan sistem tipe berkas entry point game.
2. Memverifikasi integritas seluruh aset di direktori `assets/`.
3. Mengemas berkas kode sumber dan dependensi aset ke dalam format distribusi siap rilis.

---

## 2. Validasi Aset Secara Terpisah

```bash
nusantara game assets --validasi
```
Memeriksa kepatuhan nama ekstensi, batasan ukuran maksimum, dan memastikan tidak ada kerentanan path-traversal di seluruh berkas proyek.
