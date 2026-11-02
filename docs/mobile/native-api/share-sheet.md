# API Lembar Berbagi (Share Sheet API)

API untuk memicu dialog berbagi (Share Sheet) resmi bawaan sistem operasi Android dan iOS.

## Nama API
- `bagikan.konten`: Membuka dialog berbagi sistem operasi dengan payload teks, tautan, atau berkas.

## Parameter
- `judul` (teks, opsional): Judul konten.
- `teks` (teks, opsional): Pesan teks yang ingin dibagikan.
- `url` (teks, opsional): Tautan URL.

## Contoh Kode NUSANTARA
```nusantara
gunakan "std:mobile" sebagai seluler

program BagikanTautan
mulai
  opsi : peta = {
    "judul": "Bahasa Pemrograman NUSANTARA",
    "teks": "Ayo buat aplikasi mobile dengan bahasa Indonesia!",
    "url": "https://nusantara.dev"
  }
  seluler.panggilNative("bagikan.konten", opsi)
selesai
```
