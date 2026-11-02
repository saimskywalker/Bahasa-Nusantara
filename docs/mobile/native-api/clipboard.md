# API Papan Klip (Clipboard API)

API untuk berinteraksi dengan papan klip (clipboard) sistem operasi Android dan iOS.

## Nama API
- `papan_klip.salin`: Menyalin teks ke clipboard perangkat.
- `papan_klip.tempel`: Mengambil isi teks terkini dari clipboard perangkat.

## Kebijakan Privasi
- Aplikasi hanya membaca clipboard saat aplikasi aktif di foreground atau saat aksi pengguna dipicu (menghindari background monitoring).
- Data sensitif dapat dibersihkan setelah digunakan.

## Contoh Kode NUSANTARA
```nusantara
gunakan "std:mobile" sebagai seluler

program PapanKlip
mulai
  seluler.panggilNative("papan_klip.salin", { "teks": "Teks tersalin dari Nusantara Mobile" })
  hasil : peta = seluler.panggilNative("papan_klip.tempel")
  tampilkan("Isi Clipboard: " + hasil["data"]["teks"])
selesai
```
