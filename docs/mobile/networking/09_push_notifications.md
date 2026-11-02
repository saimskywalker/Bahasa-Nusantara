# Fondasi Push Notifications: FCM (Android) & APNs (iOS)

## 1. Perbedaan Notifikasi Lokal vs Push Notification

- **Notifikasi Lokal (Phase 38):** Dijadwalkan dan dipicu langsung oleh jam perangkat tanpa memerlukan server eksternal (misal: alarm atau pengingat obat).
- **Push Notification (Phase 39):** Dipicu oleh server cloud jarak jauh (misal: pesan chat baru, status transaksi e-commerce, atau berita darurat) melalui gateway resmi:
  - **Android:** Firebase Cloud Messaging (FCM).
  - **iOS:** Apple Push Notification service (APNs).

---

## 2. Siklus Hidup Token Perangkat

1. **Pendaftaran Perangkat:** Saat aplikasi pertama kali meminta izin notifikasi dan disetujui pengguna, SDK menghasilkan token unik perangkat (*device registration token*).
2. **Penyimpanan:** Token disimpan di Keystore/Keychain menggunakan kunci `nusantara_mobile_push_device_token`.
3. **Sinkronisasi ke Backend:** Aplikasi mengirimkan token perangkat bersama ID pengguna ke endpoint `/pengguna/perangkat` di server.
4. **Token Refresh:** Jika token diperbarui oleh sistem operasi, `PengelolaNotifikasiPushMobile` memicu callback untuk mengirimkan token baru ke backend.

---

## 3. Deep Linking dari Notifikasi

Setiap payload notifikasi push dapat memuat tautan dalam (*deep link*):
```json
{
  "judul": "Pesanan Dikirim",
  "pesan": "Paket Anda sedang menuju alamat tujuan.",
  "data": {
    "deepLink": "nusantara://pesanan/PRD-998"
  }
}
```
Ketika pengguna menyentuh notifikasi, sistem langsung mengarahkan navigator aplikasi ke halaman detail pesanan yang sesuai.
