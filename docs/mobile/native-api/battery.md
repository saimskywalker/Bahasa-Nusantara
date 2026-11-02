# API Status Baterai (Battery API)

API untuk memantau status daya, persentase pengisian, dan kondisi hemat daya perangkat smartphone.

## Nama API
- `baterai.info`: Mendapatkan status baterai saat ini.

## Izin Diperlukan
Tidak ada izin khusus.

## Nilai Kembalian
- `level` (bilangan): Nilai rasio 0.0 sampai 1.0.
- `persentase` (bilangan): Nilai 0 sampai 100%.
- `sedangMengisi` (logika): `benar` jika perangkat tersambung charger.
- `sumberDaya` (teks): `"ac"`, `"usb"`, `"nirkabel"`, atau `"tidak_ada"`.
- `modeHematDaya` (logika): Status mode hemat baterai.

## Contoh Kode NUSANTARA
```nusantara
gunakan "std:mobile" sebagai seluler

program InfoBaterai
mulai
  hasil : peta = seluler.panggilNative("baterai.info")
  jika hasil["sukses"] == benar maka
    bat : peta = hasil["data"]
    tampilkan("Persentase: " + bat["persentase"] + "%")
    tampilkan("Sedang Diisi: " + bat["sedangMengisi"])
  selesai
selesai
```
