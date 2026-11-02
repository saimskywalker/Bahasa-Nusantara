# Klien WebSocket Mobile & Penanganan Status Latar Belakang

## 1. Tantangan WebSocket pada Perangkat Bergerak

Berbeda dari aplikasi peramban desktop yang memiliki suplai daya konstan, koneksi WebSocket pada perangkat seluler menghadapi:
- **Radio Dormancy / Sleep Mode:** Sistem operasi Android (Doze Mode) dan iOS (App Suspension) memutus koneksi soket yang tidak aktif untuk menghemat daya baterai.
- **NAT Carrier Drop:** Operator seluler (CGNAT) sering memutus koneksi TCP yang menganggur setelah 30–60 detik tanpa lalu lintas data.
- **Perpindahan Menara Seluler (Tower Handover):** Alamat IP lokal perangkat dapat berubah secara tiba-tiba saat ponsel bergerak.

---

## 2. Fitur Klien WebSocket Nusantara Mobile

1. **Heartbeat Otomatis (Ping/Pong):** Mengirimkan frame ping ringan setiap 25 detik untuk menjaga rute NAT operator tetap terbuka.
2. **Auto-Reconnect dengan Exponential Backoff:** Jika koneksi terputus mendadak, klien menjadwalkan koneksi ulang bertahap (1s, 2s, 4s, hingga 30s) dengan jitter acak agar tidak membebani server (*thundering herd problem*).
3. **Sadar Siklus Hidup Aplikasi (Lifecycle Awareness):**
   - Saat aplikasi beralih ke latar belakang (*background*), heartbeat dihentikan sementara untuk mematuhi kebijakan daya sistem operasi.
   - Saat aplikasi kembali ke latar depan (*foreground*), soket langsung dipulihkan dan di-ping ulang.
