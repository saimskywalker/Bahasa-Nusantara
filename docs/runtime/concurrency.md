# Arsitektur Konkurensi & Pengelolaan Sumber Daya (Fase 46)

## 1. Arsitektur Bounded Mailbox & Backpressure

Untuk menghindari kebocoran memori akibat laju produksi pesan yang melebihi laju konsumsi, setiap Mailbox Nusantara memiliki kapasitas berbatas (*bounded capacity*, default: 1.000 pesan).

### Kebijakan Luapan Mailbox (Overflow Policies):
1. `REJECT` (Bawaan):
   Menolak pesan baru dan melempar galat `MailboxOverflowError (KOR4003)`.
2. `WAIT`:
   Menahan produser pesan hingga kapasitas tersedia di mailbox penerima.
3. `DROP_OLDEST`:
   Membuang pesan terlama dalam antrean untuk memberi ruang bagi pesan terkini.
4. `DROP_NEWEST`:
   Mengabaikan pesan baru yang masuk saat antrean penuh.

## 2. Resource Manager Terpusat

`ResourceManager` mengendalikan batasan operasional seluruh sistem:
- `maxActors`: Batas atas instansiasi aktor bersamaan (default: 10.000).
- `maxWorkers`: Jumlah slot pemrosesan bersamaan (default: 8 atau jumlah inti CPU).
- `maxMailboxCapacity`: Batas absolut kapasitas antrean pesan.
- `maxTasks`: Batas tugas asinkron yang dapat berjalan serentak.

Jika alokasi melebihi batas, `ResourceExhaustedError (KOR4004)` dilempar sebelum terjadi kehabisan memori (*out of memory*).

## 3. Worker Pool Multi-Threading

`WorkerPool` mengelola sekumpulan unit pekerja (slot konkuren) yang secara kooperatif menarik aktor-aktor siap-proses dari penjadwal antrean.
