# Analitik Pembaruan Berorientasi Privasi (Privacy-First Analytics)

Modul `UpdateAnalytics` mengumpulkan metrik performa distribusi pembaruan tanpa melanggar privasi pengguna (Zero-PII Collection).

## Prinsip Privasi
1. **Tidak Ada PII**: Tidak mengumpulkan nama pengguna, email, nomor telepon, alamat IP, IDFA/GAID, IMEI, atau MAC address.
2. **Data Teragregasi**: Metrik dikelompokkan berdasarkan nomor versi aplikasi, platform OS, dan saluran distribusi.
3. **Opt-Out Mudah**: Pengguna dapat mematikan pelaporan status kapan saja melalui konfigurasi aplikasi (`telemetri: salah`).

## Metrik yang Dipantau
- Tingkat Keberhasilan Unduhan Resource OTA (%)
- Tingkat Keberhasilan Aktivasi Atomik (%)
- Jumlah Peristiwa Rollback Otomatis
- Distribusi Adopsi Versi Klien
- Rata-rata Durasi Pengunduhan
