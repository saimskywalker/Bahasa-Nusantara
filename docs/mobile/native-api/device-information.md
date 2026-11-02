# API Informasi Perangkat (Device Information API)

API untuk mendapatkan spesifikasi teknis perangkat keras dan sistem operasi smartphone.

## Nama API
`perangkat.info`

## Izin Diperlukan
Tidak ada izin khusus (hanya informasi publik non-sensitif). Demi privasi, identifier sensitif seperti IMEI dan nomor telepon tidak diakses.

## Parameter
Tidak memerlukan parameter.

## Contoh Kode NUSANTARA
```nusantara
gunakan "std:mobile" sebagai seluler

program InfoPerangkat
mulai
  hasil : peta = seluler.panggilNative("perangkat.info")
  jika hasil["sukses"] == benar maka
    info : peta = hasil["data"]
    tampilkan("Model Perangkat: " + info["model"])
    tampilkan("Versi OS       : " + info["versiOS"])
    tampilkan("Resolusi Layar : " + info["lebarLayar"] + "x" + info["tinggiLayar"])
  selesai
selesai
```
