# API Konektivitas Jaringan (Network Connectivity API)

API untuk memeriksa status jaringan ponsel (WiFi, Seluler, Ethernet) dan ketersediaan akses internet.

## Nama API
- `jaringan.status`: Memeriksa konektivitas jaringan saat ini.

## Izin Diperlukan
- `internet`: Izin akses jaringan (bawaan diberikan). Kata sandi WiFi tidak disimpan atau diakses demi privasi.

## Nilai Kembalian
- `terhubung` (logika): `benar` jika adaptor jaringan aktif.
- `tipeJaringan` (teks): `"wifi"`, `"seluler"`, `"ethernet"`, atau `"tidak_ada"`.
- `apakahMahal` (logika): `benar` jika jaringan merupakan kuota seluler berbayar (metered).

## Contoh Kode NUSANTARA
```nusantara
gunakan "std:mobile" sebagai seluler

program InfoJaringan
mulai
  hasil : peta = seluler.panggilNative("jaringan.status")
  jika hasil["sukses"] == benar maka
    net : peta = hasil["data"]
    tampilkan("Terhubung: " + net["terhubung"])
    tampilkan("Tipe Jaringan: " + net["tipeJaringan"])
  selesai
selesai
```
