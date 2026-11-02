# API Lokasi & GPS (Location API)

API untuk mendapatkan koordinat lintang, bujur, dan akurasi posisi geografis smartphone.

## Nama API
- `lokasi.ambil`: Mengambil koordinat lokasi terkini saat aplikasi digunakan (foreground).
- `lokasi.pantau`: Memulai pemantauan perubahan lokasi.
- `lokasi.henti`: Menghentikan pemantauan lokasi dan membebaskan sensor GPS.

## Izin Diperlukan
- `lokasi`: Izin akses lokasi presisi/kasar saat aplikasi aktif. Aplikasi tidak meminta izin lokasi latar belakang secara otomatis.

## Parameter `lokasi.ambil`
- `akurasiTinggi` (logika, opsional): Menggunakan satelit GPS jika `benar` (bawaan: `benar`).
- `timeoutMs` (bilangan, opsional): Batas waktu pencarian lokasi dalam milidetik (bawaan: 10000).

## Nilai Kembalian
- `latitude` (bilangan): Garis lintang.
- `longitude` (bilangan): Garis bujur.
- `akurasi` (bilangan): Estimasi akurasi dalam meter.
- `timestamp` (bilangan): Stempel waktu pengukuran.

## Contoh Kode NUSANTARA
```nusantara
gunakan "std:mobile" sebagai seluler

program CekLokasi
mulai
  hasil : peta = seluler.panggilNative("lokasi.ambil")
  jika hasil["sukses"] == benar maka
    pos : peta = hasil["data"]
    tampilkan("Latitude : " + pos["latitude"])
    tampilkan("Longitude: " + pos["longitude"])
  selesai
selesai
```
