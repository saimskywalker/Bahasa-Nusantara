# Pengelola Aset Mobile (Asset Manager)

Aplikasi mobile memerlukan pengelolaan aset seperti gambar ikon, ilustrasi grafis, berkas audio suara efek, serta font tipografi kustom secara aman dan efisien.

---

## 1. Direktori Aset Terisolasi

Semua aset disimpan di dalam folder `aset/` pada akar proyek aplikasi Anda.

```text
aset/
├── logo.png
├── ikon_keranjang.svg
├── suara_notif.mp3
└── font_utama.ttf
```

---

## 2. Mitigasi Keamanan (Anti-Path Traversal)

`PengelolaAsetMobile` secara ketat memvalidasi setiap jalur aset:
- **Dilarang Path Traversal**: Jalur yang mengandung karakter `..` atau awalan root absolut `/` akan ditolak dengan galat keamanan.
- **Whitelist Ekstensi Resmi**:
  - Gambar: `.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`, `.gif`
  - Font: `.ttf`, `.otf`, `.woff`
  - Audio: `.mp3`, `.wav`, `.ogg`
  - Video: `.mp4`, `.webm`
  - Data: `.json`, `.txt`

---

## 3. Pemuatan Aset dalam Kode

```nusantara
# Memuat gambar aset aman
logo : peta = seluler.buatGambar("aset/logo.png", 120, 120)
seluler.tambahKomponenMobile(aplikasi, logo)
```
Saat proses build aplikasi dilakukan, manifest aset akan dibuat otomatis untuk dibundel ke dalam APK Android (`assets/`) dan iOS App Bundle.
