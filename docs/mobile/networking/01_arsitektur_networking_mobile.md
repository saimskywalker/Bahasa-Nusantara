# Arsitektur Nusantara Mobile Networking & Cloud Services (Phase 39)

## 1. Pendahuluan & Filosofi Desain

Pada **Phase 39 (Target Versi: v0.39.0)**, bahasa pemrograman **NUSANTARA** memperkenalkan lapisan **Nusantara Mobile Networking & Cloud Services**. Lapisan ini dirancang secara khusus untuk arsitektur perangkat bergerak (*mobile computing*), yang memiliki karakteristik unik:
- **Konektivitas Volatil:** Perangkat berpindah antara Wi-Fi berkecepatan tinggi, jaringan seluler 4G/5G, hingga zona tanpa sinyal (*dead zone*).
- **Efisiensi Baterai & Daya Komputasi:** Menghindari *polling* berlebihan dan soket yang menggantung yang dapat menguras baterai ponsel.
- **Keamanan Tanpa Kompromi:** Menghilangkan risiko penyimpanan rahasia dalam teks polos dan melarang penyertaan *admin credentials* di sisi klien.
- **Pendekatan Offline-First:** Aplikasi tetap responsif dan fungsional saat tidak ada jaringan, dengan operasi mutasi disimpan dalam antrean aman (*offline queue*) dan disinkronkan secara otomatis saat koneksi pulih.

---

## 2. Diagram Lapisan Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                 Aplikasi Pengembang NUSANTARA               │
│                 (Kode Sumber *.nusantara)                   │
├─────────────────────────────────────────────────────────────┤
│                 Modul Standar `std:mobile`                  │
│  - buatKlienAPI()             - buatKlienAutentikasi()       │
│  - sinkronkanDataMobile()     - antreanOfflineMobile()       │
│  - periksaJaringanMobile()    - unggahBerkasCloud()          │
├─────────────────────────────────────────────────────────────┤
│         Nusantara Mobile Networking Core Engine             │
│  ┌───────────────────────┐   ┌───────────────────────────┐  │
│  │   KlienAPIMobile      │   │  KlienAutentikasiMobile   │  │
│  │ (REST, Idempotency)   │   │  (JWT, Refresh, PKCE)     │  │
│  └───────────────────────┘   └───────────────────────────┘  │
│  ┌───────────────────────┐   ┌───────────────────────────┐  │
│  │ ManajerPermintaan     │   │  MesinSinkronisasi        │  │
│  │ (Prioritas, Throttling│   │  (Conflict Resolver LWW)  │  │
│  └───────────────────────┘   └───────────────────────────┘  │
│  ┌───────────────────────┐   ┌───────────────────────────┐  │
│  │ PengawasJaringan      │   │  PengelolaOperasiOffline  │  │
│  │ (Wi-Fi, Seluler, Ping)│   │  (Persistent FIFO Queue)  │  │
│  └───────────────────────┘   └───────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│         Lapisan Keamanan & Integrasi Native Perangkat       │
│  - Penyimpanan Aman AES-256 (Android Keystore / iOS Keychain)│
│  - Validasi Sertifikat TLS Wajib (Strict Certificate Check) │
│  - Redaksi Otomatis Data Sensitif (Masking Token & Sandi)   │
│  - Anti-Path Traversal pada Transfer Berkas                 │
├─────────────────────────────────────────────────────────────┤
│                Backend & Cloud Infrastructure               │
│   (REST Backend Nusantara, Supabase, Firebase, S3 Storage)  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Komponen Utama

| Komponen | Kelas / Modul | Peran Utama |
|---|---|---|
| **API Client** | `KlienAPIMobile` | Klien REST API dengan dukungan metode lengkap, pencegahan mutasi duplikat via Idempotency-Key, dan interceptor offline. |
| **Auth Client** | `KlienAutentikasiMobile` | Pengelolaan siklus hidup token JWT, auto-refresh token kedaluwarsa, dan dukungan OAuth 2.0 PKCE. |
| **Request Manager** | `ManajerPermintaanMobile` | Antrean prioritas (`tinggi`, `normal`, `rendah`), pembatasan konkurensi (maks 4 koneksi bersamaan), dan retry exponential backoff + jitter. |
| **Network Monitor** | `PengawasJaringanMobile` | Memantau status koneksi fisik (Wi-Fi, Seluler) dan membedakannya dari keterjangkauan (*reachability*) backend server. |
| **Offline Queue** | `PengelolaOperasiOffline` | Antrean lokal persisten untuk menyimpan permintaan mutasi (POST, PUT, PATCH, DELETE) saat perangkat offline. |
| **Sync Engine** | `MesinSinkronisasiMobile` | Mesin sinkronisasi data lokal ke server dengan berbagai strategi penyelesaian konflik (*Last Write Wins*, Server Wins, Client Wins). |
| **Cloud Storage** | `PengelolaTransferBerkasMobile` | Abstraksi transfer berkas (unggah/unduh) multi-penyedia yang terlindung dari kerentanan *path traversal*. |
| **WebSocket** | `KlienWebSocketMobile` | Koneksi real-time dengan mekanisme *heartbeat ping/pong* hemat daya dan penanganan otomatis saat aplikasi di latar belakang. |
| **Security Layer** | `LapisanKeamananMobile` | Memastikan validasi TLS wajib pada produksi, sensor data rahasia dari log, dan verifikasi klaim izin server-side. |
