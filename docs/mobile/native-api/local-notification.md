# API Notifikasi Lokal (Local Notification API)

API untuk mengirimkan dan menjadwalkan notifikasi lokal langsung pada perangkat pengguna tanpa memerlukan push notification server.

## Nama API
- `notifikasi.kirim`: Mengirim notifikasi seketika.
- `notifikasi.jadwal`: Menjadwalkan notifikasi dengan tunda waktu.
- `notifikasi.batal`: Membatalkan notifikasi terjadwal berdasarkan ID.

## Izin Diperlukan
- `notifikasi`: POST_NOTIFICATIONS pada Android 13+ dan UNUserNotificationCenter authorization pada iOS.

## Parameter `notifikasi.jadwal`
- `id` (teks, wajib): Pengenal unik notifikasi.
- `judul` (teks, wajib): Judul notifikasi.
- `pesan` (teks, wajib): Pesan teks.
- `tundaDetik` (bilangan, wajib): Waktu tunda sebelum ditampilkan.

## Contoh Kode NUSANTARA
```nusantara
gunakan "std:mobile" sebagai seluler

program JadwalNotif
mulai
  opsi : peta = {
    "id": "ingat_1",
    "judul": "Pengingat Nusantara",
    "pesan": "Waktunya belajar bahasa pemrograman NUSANTARA!",
    "tundaDetik": 5
  }
  hasil : peta = seluler.panggilNative("notifikasi.jadwal", opsi)
  tampilkan("Notifikasi dijadwalkan: " + hasil["pesan"])
selesai
```
