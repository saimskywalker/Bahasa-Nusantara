# Pola Offline-First & Pengelolaan Antrean Operasi

## 1. Konsep Offline-First

Pengguna ponsel cerdas kerap mengalami koneksi yang tiba-tiba terputus saat berada di lift, terowongan, atau pedesaan. Aplikasi yang baik tidak menampilkan layar galat merah atau memblokir pengguna saat jaringan hilang. Sebaliknya, aplikasi harus:
1. Menerima input pengguna secara instan dan memperbarui UI lokal (*optimistic UI updates*).
2. Memasukkan operasi mutasi (`POST`, `PUT`, `PATCH`, `DELETE`) ke dalam antrean offline (*offline queue*).
3. Mengembalikan status HTTP 202 (*Accepted*) ke aplikasi.
4. Menjalankan sinkronisasi di latar belakang saat jaringan kembali tersedia.

---

## 2. Struktur Antrean Operasi Offline

Setiap butir dalam antrean `PengelolaOperasiOffline` memuat metadata:
```json
{
  "id": "op_1793583000_a8f9",
  "endpoint": "/catatan",
  "metode": "POST",
  "body": { "judul": "Catatan Lapangan", "isi": "Data survey..." },
  "headers": { "Accept": "application/json" },
  "stempelWaktu": 1793583000123,
  "percobaan": 0,
  "status": "tertunda",
  "idempotencyKey": "off_1793583000_9b8c"
}
```

---

## 3. Penggunaan dalam NUSANTARA

```nusantara
gunakan "std:mobile" sebagai seluler

klien : peta = seluler.buatKlienAPI({ "antreanOffline": benar })

# Operasi dikirim meskipun offline
respon : peta = klien.kirim("/laporan", { "lokasi": "Site A", "suhu": 32.5 })
tampilkan("Status:", respon["status"]) # Menghasilkan 202 Accepted jika offline

# Memeriksa antrean offline
statusAntrean : peta = seluler.antreanOfflineMobile()
tampilkan("Total Tertunda:", statusAntrean["tertunda"])
```
