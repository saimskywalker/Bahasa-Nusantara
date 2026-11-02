# Panduan Perintah CLI Nusantara Mobile Networking & Cloud

## 1. Daftar Subperintah CLI Baru (Phase 39)

Nusantara Mobile CLI menyediakan sekumpulan subperintah untuk menguji konektivitas, memvalidasi konfigurasi cloud, dan memeriksa antrean sinkronisasi:

### A. Pemeriksaan Jaringan
```bash
nusantara mobile jaringan periksa
```
Menampilkan:
- Status koneksi (Online / Offline).
- Tipe antarmuka fisik (Wi-Fi, Seluler, Ethernet).
- Kondisi jaringan (Online, Terbatas).
- Keterjangkauan backend server.
- Kategori biaya (Metered / Unmetered).

### B. Informasi Layanan Cloud & Backend
```bash
nusantara mobile cloud info
```
Menampilkan:
- Lingkungan aktif (`PENGEMBANGAN`, `STAGING`, `PRODUKSI`).
- API Base URL.
- Penyedia cloud aktif.
- Storage Endpoint & Database REST URL.
- Status validasi sertifikat TLS.

### C. Manajemen Konfigurasi Cloud
```bash
# Beralih ke lingkungan pengembangan (localhost & mock)
nusantara mobile cloud konfigurasi pengembangan

# Beralih ke lingkungan produksi dengan URL aman
nusantara mobile cloud konfigurasi produksi https://api.nusantara.id
```

### D. Audit & Validasi Keamanan Cloud
```bash
nusantara mobile cloud validasi
```
Memverifikasi kepatuhan terhadap standar keamanan HTTPS, validasi sertifikat TLS, dan enkripsi penyimpanan token.

### E. Inspeksi Antrean Sinkronisasi & Operasi Offline
```bash
# Memeriksa jumlah operasi tertunda dalam antrean
nusantara mobile sync periksa

# Memicu proses sinkronisasi langsung ke server
nusantara mobile sync sinkronkan
```
