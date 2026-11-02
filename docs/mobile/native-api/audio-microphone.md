# API Audio & Mikrofon (Audio API)

API untuk memutar berkas suara dan merekam audio dari mikrofon smartphone secara terkontrol dan transparan.

## Nama API
- `audio.putar`: Memutar berkas audio lokal atau tautan URL.
- `audio.rekam`: Merekam suara dari mikrofon perangkat.
- `audio.henti`: Menghentikan perekaman atau pemutaran audio.

## Izin Diperlukan
- `mikrofon` (Sensitif): Diperlukan saat merekam suara. Aplikasi dilarang merekam secara diam-diam di latar belakang.

## Contoh Kode NUSANTARA
```nusantara
gunakan "std:mobile" sebagai seluler

program RekamSuara
mulai
  opsi : peta = { "durasiMaksDetik": 5 }
  hasil : peta = seluler.panggilNative("audio.rekam", opsi)

  jika hasil["sukses"] == benar maka
    tampilkan("Perekaman selesai. Berkas: " + hasil["data"]["jalurBerkas"])
  selesai
selesai
```
