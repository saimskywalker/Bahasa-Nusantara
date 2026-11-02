# Mesin Sinkronisasi Data & Resolusi Konflik (Sync Engine)

## 1. Mekanisme Sinkronisasi

`MesinSinkronisasiMobile` bertanggung jawab menuntaskan operasi tertunda dari `PengelolaOperasiOffline` ke server backend.

Sinkronisasi dapat dipicu melalui 3 jalur:
1. **Otomatis saat Jaringan Pulih:** `PengawasJaringanMobile` memicu peristiwa `online` yang langsung menyalakan mesin sinkronisasi jika ada operasi tertunda.
2. **Manual oleh Pengguna:** Menarik layar (*Pull to Refresh*) atau menekan tombol sinkronisasi (`seluler.sinkronkanDataMobile()`).
3. **Terjadwal via Background Task:** Android WorkManager atau iOS BackgroundTasks menjalankan sinkronisasi berkala.

---

## 2. Strategi Penyelesaian Konflik (Conflict Resolution)

Ketika dua perangkat memodifikasi rekaman data yang sama secara bersamaan saat offline, terjadi konflik (HTTP 409 Conflict). Nusantara Mobile menyediakan 4 strategi penyelesaian:

### A. Last Write Wins (`tulis_terakhir_menang`) — Bawaan
- Membandingkan stempel waktu (*timestamp*) lokal dan stempel waktu server.
- Menyertakan toleransi *clock drift* (default: 5.000 ms) untuk mengatasi perbedaan jam internal antara smartphone dan server.
- Rekaman yang paling mutakhir diterima; rekaman lama ditimpa.

### B. Server Wins (`server_menang`)
- Perubahan dari server selalu dianggap sebagai sumber kebenaran (*single source of truth*).
- Operasi lokal yang berkonflik dibatalkan dan digantikan oleh status server.

### C. Client Wins (`klien_menang`)
- Perubahan lokal dari pengguna mobile dipaksakan untuk menimpa status server.

### D. Manual Resolution (`manual`)
- Data lokal dan data server dipertahankan dalam objek laporan konflik untuk ditampilkan kepada pengguna aplikasi agar memilih versi yang diinginkan.

---

## 3. Eksekusi Sinkronisasi dalam NUSANTARA

```nusantara
gunakan "std:mobile" sebagai seluler

hasilSync : peta = seluler.sinkronkanDataMobile()

tampilkan("Sukses:", hasilSync["sukses"])
tampilkan("Jumlah Terkirim:", hasilSync["jumlahTerkirim"])
tampilkan("Jumlah Gagal:", hasilSync["jumlahGagal"])
tampilkan("Catatan:", hasilSync["catatan"])
```
