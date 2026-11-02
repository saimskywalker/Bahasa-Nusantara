# API Pemilih Media & Galeri (Media Picker API)

API untuk memilih foto dan video dari pustaka media pengguna secara aman menggunakan Android Photo Picker dan iOS PHPicker.

## Nama API
- `galeri.pilih_foto`: Memilih satu atau beberapa foto.
- `galeri.pilih_video`: Memilih video.

## Izin Diperlukan
- `foto_media`: Izin akses foto dan video. Pada Android 13+ dan iOS 14+, pemilih sistem tidak memerlukan izin seluruh penyimpanan (scoped access).

## Parameter
- `maksPilihan` (bilangan, opsional): Jumlah maksimum berkas media yang dapat dipilih (bawaan: 1).

## Nilai Kembalian
Peta berisi:
- `item` (daftar): Daftar objek foto/video terpilih (`uri`, `nama`, `tipeMime`, `ukuranByte`).
- `jumlah` (bilangan): Total item yang dipilih.

## Contoh Kode NUSANTARA
```nusantara
gunakan "std:mobile" sebagai seluler

program PilihGaleri
mulai
  opsi : peta = { "maksPilihan": 1 }
  hasil : peta = seluler.panggilNative("galeri.pilih_foto", opsi)

  jika hasil["sukses"] == benar maka
    media : peta = hasil["data"]
    tampilkan("Media berhasil dipilih, total: " + media["jumlah"])
  selesai
selesai
```
