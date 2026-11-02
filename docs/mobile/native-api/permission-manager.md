# Integrasi Pengelola Izin (Permission Manager)

Pusat pengelolaan izin akses perangkat keras dan privasi smartphone pada Nusantara Mobile.

## Prinsip Privasi
1. **Prinsip Hak Akses Minimum (Principle of Least Privilege)**: Hanya meminta izin yang benar-benar dibutuhkan saat fitur dipicu pengguna.
2. **Tidak Ada Akses Diam-diam**: Tidak ada sensor, kamera, mikrofon, atau lokasi yang diakses di latar belakang tanpa persetujuan eksplisit.
3. **Penyampaian Alasan (Rationale)**: Memberitahukan pengguna alasan kebutuhan izin sebelum dialog izin sistem ditampilkan.

## Alur Permintaan Izin
```
Pengguna Tekan Tombol Aksi
           │
           ▼
Registri Periksa Status Izin
           │
     ┌─────┴──────────┐
  Diberikan         Belum Diminta / Ditolak
     │                │
     ▼                ▼
Jalankan API    Minta Izin Sistem via OS
                      │
                ┌─────┴─────┐
             Diberikan    Ditolak
                │           │
                ▼           ▼
           Jalankan API   Kembalikan Galat IZIN_DITOLAK
```
