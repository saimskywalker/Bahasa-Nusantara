# Manajemen Izin Dinamis (Permissions Management)

Keamanan privasi pengguna adalah prioritas tertinggi pada platform seluler modern. Nusantara Mobile menerapkan sistem perizinan waktu eksekusi (*runtime permission model*) yang transparan dan terperinci.

---

## 1. Daftar Izin yang Didukung

| Nama Izin | Kategori | Padanan Android | Padanan iOS |
|---|---|---|---|
| `kamera` | Privasi | `android.permission.CAMERA` | `NSCameraUsageDescription` |
| `lokasi` | Lokasi | `ACCESS_FINE_LOCATION` | `NSLocationWhenInUseUsageDescription` |
| `lokasi_latar` | Lokasi | `ACCESS_BACKGROUND_LOCATION` | `NSLocationAlwaysAndWhenInUse...` |
| `notifikasi` | Pengguna | `POST_NOTIFICATIONS` | `UNUserNotificationCenter` |
| `foto_media` | Media | `READ_MEDIA_IMAGES` | `NSPhotoLibraryUsageDescription` |
| `mikrofon` | Privasi | `RECORD_AUDIO` | `NSMicrophoneUsageDescription` |
| `bluetooth` | Koneksi | `BLUETOOTH_CONNECT` | `NSBluetoothAlwaysUsageDescription` |
| `penyimpanan` | Berkas | `READ/WRITE_EXTERNAL_STORAGE`| Sandboxed Storage |
| `internet` | Jaringan | `INTERNET` | Otomatis diizinkan |
| `sensor` | Perangkat | `BODY_SENSORS` | `NSMotionUsageDescription` |

---

## 2. Memeriksa dan Meminta Izin di Kode

```nusantara
# Memeriksa status izin saat ini
status : teks = periksaIzin("kamera")

jika status == "belum_diminta" maka
  # Meminta izin kepada pengguna disertai penjelasan rasional
  diberikan : logika = mintaIzin("kamera", "Aplikasi memerlukan kamera untuk memindai kode QR.")
  jika diberikan maka
    tulis("Kamera siap digunakan.")
  selesai
akhir
```
Status pengembalian meliputi: `"diberikan"`, `"ditolak"`, `"ditolak_permanen"`, `"belum_diminta"`, `"dibatasi"`, atau `"tidak_didukung"`.
