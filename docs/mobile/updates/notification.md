# Sistem Notifikasi & Pengingat Pembaruan

Modul `UpdateNotificationManager` dan `UpdateReminder` mengelola komunikasi informasi pembaruan kepada pengguna secara tidak mengganggu (non-intrusive).

## Interval Pengingat Berdasarkan Kebijakan
- **Kebijakan Opsional**: Diingatkan maksimal 1 kali setiap 7 hari (168 jam).
- **Kebijakan Disarankan**: Diingatkan maksimal 1 kali setiap 24 jam.
- **Kebijakan Wajib / Keamanan**: Diingatkan setiap pembukaan sesi aplikasi sampai pembaruan dipasang.

## Tombol Aksi Dialog Notifikasi
1. **Perbarui Sekarang**: Memulai proses unduhan OTA atau membuka toko aplikasi.
2. **Ingatkan Nanti**: Menunda notifikasi sesuai interval kebijakan.
3. **Abaikan Versi Ini**: Hanya diizinkan untuk pembaruan bertipe opsional.
