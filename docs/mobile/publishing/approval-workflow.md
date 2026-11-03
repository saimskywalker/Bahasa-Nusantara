# Panduan Gerbang Persetujuan Publikasi (Approval Gate)
**Bahasa Pemrograman NUSANTARA** — Versi `v0.41.0` (Fase 41)

## 1. Filosofi Keamanan Publikasi

Rilis ke lingkungan pengujian (`internal`, `closed`, `testflight`) dapat berjalan cepat dan terotomatisasi. Namun rilis ke lingkungan **Production** (Google Play Store publik dan Apple App Store publik) memiliki dampak langsung terhadap reputasi, data pengguna, dan bisnis pengembang.

Oleh karena itu, NUSANTARA mengimplementasikan pola **Production Approval Gate**:
- Semua proses non-produksi dapat dilewati (*auto-approved*) jika seluruh validasi teknis lulus 100%.
- Proses ke track produksi **wajib meminta izin eksplisit dari penanggung jawab rilis (Release Engineer / Product Owner)**.

## 2. Mekanisme Persetujuan

### A. Melalui Baris Perintah (CLI)
Jika perintah diajukan tanpa konfirmasi:
```bash
nusantara mobile store android release --track=production
```
Sistem akan menghentikan proses dengan pesan:
```
======================================================
  PERINGATAN: PERSETUJUAN EKSPLISIT DIPERLUKAN
======================================================
Publikasi ke track PRODUCTION berdampak langsung ke pengguna publik.
Jalankan kembali dengan menambahkan flag '--setujui' untuk mengonfirmasi.
======================================================
```

Untuk mengonfirmasi dan melanjutkan:
```bash
nusantara mobile store android release --track=production --setujui
```

### B. Melalui Antarmuka Grafis (Studio Publikasi Mobile)
Pada dashboard GUI (Tab **Publikasi Toko** -> Sub-tab **Pipeline Rilis**):
- Terdapat tombol toggle khusus "Beri Persetujuan Manual untuk Rilis Produksi".
- Jika toggle belum diaktifkan, tombol aksi rilis produksi dinonaktifkan secara aman dengan penanda visual.

## 3. Log Audit dan Jejak Persetujuan

Setiap tindakan persetujuan dan penolakan dicatat secara permanen dalam riwayat audit:
- Waktu persetujuan (*timestamp* UTC).
- Identitas pemohon dan pemberi persetujuan.
- Versi aplikasi dan target platform.
- Catatan alasan rilis.
