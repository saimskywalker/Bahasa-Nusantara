# Keamanan Runtime & Diagnostik Kebuntuan (Fase 46)

## 1. Zero Shared Mutable State

- Tidak ada referensi pointer atau objek yang dapat dimutasi silang (*cross-actor mutation*).
- Status internal hanya dimutasi secara sekuensial dalam thread penangan pesan aktor itu sendiri.
- Tidak membutuhkan kunci primitif tingkat rendah (*mutex / spinlock*) pada logika bisnis pengguna, sehingga secara arsitektural mencegah perlombaan data (*data races*).

## 2. Deteksi Kebuntuan & Aktor Terhenti (Deadlock & Stall Diagnostics)

`ConcurrencyDiagnostics` secara berkala menganalisis:
- Siklus ketergantungan pesan sinkron (pola `ask()` siklis $A \to B \to A$).
- Aktor yang terhenti dalam status `RUNNING` namun tidak memproses pesan melebihi batas waktu toleransi (*stall timeout*).
- Antrean tugas yang terkunci tanpa penyelesaian.

CLI menyediakan perintah terintegrasi:
```bash
nusantara concurrency --diagnostics
```

## 3. Penanganan Dead Letters

Pesan yang gagal dikirimkan (karena aktor tujuan dihentikan, kapasitas penuh dan ditolak, atau nama tidak terdaftar) disimpan dalam `DeadLetterQueue` untuk keperluan audit, logging, dan investigasi kesalahan produksi tanpa membuat aplikasi runtuh (*crash*).
