# API Kamera (Camera API)

API untuk memeriksa modul kamera dan mengambil foto langsung dari lensa kamera native perangkat.

## Nama API
- `kamera.ketersediaan`: Memeriksa ketersediaan kamera depan dan belakang.
- `kamera.ambil`: Membuka antarmuka kamera untuk mengambil foto.

## Izin Diperlukan
- `kamera` (Sensitif - Memerlukan persetujuan eksplisit pengguna).

## Parameter `kamera.ambil`
- `kamera` (teks, opsional): `"depan"` atau `"belakang"` (bawaan: `"belakang"`).
- `flash` (logika, opsional): `benar` atau `salah`.
- `kualitas` (bilangan, opsional): 1 sampai 100 (bawaan: 85).

## Nilai Kembalian
Peta berisi:
- `uri`: Referensi URI file gambar hasil foto.
- `lebar`: Lebar piksel gambar.
- `tinggi`: Tinggi piksel gambar.
- `format`: Format MIME (misal `image/jpeg`).

## Contoh Kode NUSANTARA
```nusantara
gunakan "std:mobile" sebagai seluler

program AmbilFoto
mulai
  opsi : peta = { "kamera": "belakang", "flash": salah }
  hasil : peta = seluler.panggilNative("kamera.ambil", opsi)

  jika hasil["sukses"] == benar maka
    foto : peta = hasil["data"]
    tampilkan("Foto tersimpan di: " + foto["uri"])
  lainnya
    tampilkan("Gagal mengambil foto: " + hasil["pesan"])
  selesai
selesai
```
