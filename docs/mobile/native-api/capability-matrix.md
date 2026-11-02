# Matriks Kemampuan Native API (Capability Matrix)

Tabel perbandingan ketersediaan dan status dukungan API perangkat native antara Android, iOS, dan Desktop Simulator.

| Nama API | Android | iOS | Simulator | Min OS | Izin Diperlukan | Status | Keterbatasan |
|---|---|---|---|---|---|---|---|
| `perangkat.info` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | - | Teruji | Tanpa akses nomor IMEI/telepon |
| `kamera.ketersediaan` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | - | Teruji | - |
| `kamera.ambil` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | `kamera` | Teruji | Butuh aksi pengguna (tidak di latar belakang) |
| `galeri.pilih_foto` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | `foto_media` | Teruji | Menggunakan Photo Picker sistem |
| `galeri.pilih_video` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | `foto_media` | Teruji | Menggunakan Photo Picker sistem |
| `lokasi.ambil` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | `lokasi` | Teruji | Lokasi saat aplikasi aktif (foreground) |
| `lokasi.pantau` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | `lokasi` | Teruji | Dihentikan saat aplikasi jeda/berhenti |
| `notifikasi.kirim` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | `notifikasi` | Teruji | Notifikasi lokal (bukan push cloud) |
| `notifikasi.jadwal` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | `notifikasi` | Teruji | Alarm Manager / UNNotificationRequest |
| `sensor.akselerometer` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | `sensor` | Teruji | Frekuensi dibatasi untuk efisiensi baterai |
| `sensor.giroskop` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | `sensor` | Teruji | Memerlukan sensor fisik gyrometer |
| `sensor.magnetometer` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | `sensor` | Teruji | Tergantung kompas magnetik perangkat |
| `sensor.kedekatan` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | `sensor` | Teruji | Proximity hardware ponsel |
| `sensor.cahaya` | Didukung | Tidak Didukung | Didukung | Android 24 | `sensor` | Dasar | iOS tidak mengekspos public lux sensor |
| `bluetooth.status` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | `bluetooth` | Teruji | - |
| `bluetooth.pindai` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | `bluetooth` | Teruji | Dibatasi durasi (tidak terus-menerus) |
| `baterai.info` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | - | Teruji | Sesuai pembatasan privasi iOS battery |
| `jaringan.status` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | `internet` | Teruji | Tanpa akses SSID / Password WiFi |
| `audio.putar` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | - | Teruji | Pemutaran audio interaktif |
| `audio.rekam` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | `mikrofon` | Teruji | Perekaman interaktif terindikasi |
| `berkas.baca` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | `penyimpanan` | Teruji | Terisolasi sandbox aplikasi |
| `berkas.tulis` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | `penyimpanan` | Teruji | Proteksi anti-path traversal |
| `papan_klip.salin` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | - | Teruji | - |
| `papan_klip.tempel` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | - | Teruji | - |
| `bagikan.konten` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | - | Teruji | Sistem Share Sheet |
| `simpan_aman.tulis` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | - | Teruji | Keystore AES-256 / Keychain |
| `simpan_aman.baca` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | - | Teruji | - |
| `haptik.getar` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | - | Teruji | - |
| `haptik.pola` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | - | Teruji | - |
| `lifecycle.status` | Didukung | Didukung | Didukung | Android 24 / iOS 14.0 | - | Teruji | - |
