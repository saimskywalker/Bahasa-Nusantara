# Penanganan Galat & Standar Hasil Native API

Standar terpadu untuk hasil operasi native dan kode galat pada seluruh layanan perangkat.

## Struktur Hasil Standar
Setiap pemanggilan fungsi native mengembalikan struktur peta:
- `sukses` (logika): `benar` atau `salah`.
- `status` (teks): `'sukses'`, `'gagal'`, `'dibatalkan'`, `'izin_ditolak'`, `'tidak_didukung'`, `'timeout'`, dll.
- `data` (sembarang, opsional): Payload hasil jika operasi berhasil.
- `pesan` (teks): Pesan penjelasan dalam Bahasa Indonesia.
- `kodeGalat` (teks): Kode unik dari enum `KodeGalatNative`.
- `stempelWaktu` (bilangan): Waktu eksekusi dalam milidetik.

## Daftar Kode Galat
- `SUKSES`: Operasi berhasil diselesaikan.
- `IZIN_DITOLAK`: Izin perangkat ditolak oleh pengguna atau sistem.
- `TIDAK_DIDUKUNG`: Perangkat keras atau OS tidak mendukung kapabilitas tersebut.
- `PERANGKAT_TIDAK_TERSEDIA`: Modul perangkat sedang tidak aktif atau rusak.
- `DIBATALKAN_PENGGUNA`: Pengguna menekan tombol batal pada pemilih dialog/kamera.
- `TIMEOUT`: Batas waktu pengambilan data terlampaui.
- `PATH_TIDAK_AMAN`: Percobaan pembacaan di luar direktori sandbox aplikasi terdeteksi.
- `ENKRIPSI_GAGAL`: Kegagalan pada kunci hardware Keystore/Keychain.
- `OPERASI_GAGAL`: Kesalahan internal eksekusi.
