# Penjadwalan & Keadilan Pemrosesan (Fase 46)

## 1. Penjadwal Kooperatif (Fair Cooperative Dispatcher)

`ConcurrencyScheduler` memetakan jutaan aktor ke dalam sejumlah pekerja (*worker slots*) yang terbatas. Penjadwalan bersifat kooperatif dan adil (*fair*).

## 2. Anggaran Throughput (Throughput Budget)

Untuk mencegah aktor dengan antrean pesan raksasa memonopoli pekerja (*starvation* bagi aktor lain):
- Setiap aktor diberikan kuota pemrosesan pesan (default: `throughputBudget = 10` pesan per giliran).
- Setelah memproses 10 pesan, aktor secara kooperatif melepaskan pekerja dan ditempatkan kembali pada antrean belakang (*ready queue*) jika masih memiliki pesan tersisa.
- Aktor lain yang sedang menunggu mendapatkan giliran eksekusi secara berkeadilan.

## 3. Work-Stealing & Ready Queue

Antrean aktor siap dieksekusi dikelola secara tersentralisasi atau terdistribusi per-pekerja dengan dukungan pencurian tugas (*work-stealing*) saat salah satu pekerja menganggur (*idle*).
