# Pengelola Unduhan Aman (Secure Download)

Modul `DownloadManager` dan `UpdateSecurityPolicy` menjamin seluruh proses transfer data pembaruan memenuhi standar keamanan tertinggi.

## Fitur Keamanan Pengunduhan
1. **Penegakan HTTPS (TLS 1.3)**: Seluruh URL pembaruan wajib menggunakan skema `https://`. Koneksi plain HTTP langsung ditolak kecuali untuk simulasi `localhost`.
2. **Batas Ukuran Berkas**:
   - Berkas tunggal maksimum: 50 MB
   - Total bundle paket OTA maksimum: 100 MB
   - Jumlah berkas maksimum: 500 berkas
3. **Pertahanan Decompression Bomb**: Rasio dekompresi dibatasi maksimum 100x ukuran arsip terkompresi.
4. **Pertahanan Zip-Slip**: Sanitasi jalur arsip untuk mencegah file keluar dari root direktori target instalasi.
5. **Dukungan Pembatalan (AbortController)**: Pengguna dapat membatalkan unduhan kapan saja tanpa merusak sistem.
