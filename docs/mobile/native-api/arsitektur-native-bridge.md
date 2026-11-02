# Arsitektur Native Bridge Nusantara Mobile

Dokumen ini menguraikan arsitektur jembatan komunikasi antara runtime bahasa NUSANTARA dengan lapisan platform native Android dan iOS.

## Diagram Lapisan Arsitektur

```
+--------------------------------------------------------------+
|            Aplikasi NUSANTARA (*.nusantara)                  |
+--------------------------------------------------------------+
                               |
                               v
+--------------------------------------------------------------+
|        Standard Library std:mobile (seluler.panggilNative)   |
+--------------------------------------------------------------+
                               |
                               v
+--------------------------------------------------------------+
|                     RegistriNativeAPI                        |
|  - Validasi Status API                                       |
|  - Validasi Permission Manager                               |
|  - Validasi Device Capability                                |
+--------------------------------------------------------------+
                               |
       +-----------------------+-----------------------+
       |                       |                       |
       v                       v                       v
+--------------+       +---------------+       +---------------+
|   Android    |       |      iOS      |       |   Simulator   |
|   Adapter    |       |    Adapter    |       |    Adapter    |
+--------------+       +---------------+       +---------------+
       |                       |                       |
       v                       v                       v
 Android SDK 24+        iOS SDK 14.0+            Host OS API
(Intent / CameraX)     (AVFoundation / PH)      (POSIX / Web)
```

## Mekanisme Eksekusi
1. Aplikasi NUSANTARA memanggil API melalui `seluler.panggilNative(namaApi, parameter)`.
2. `RegistriNativeAPI` memeriksa metadata API, izin yang dibutuhkan, dan kapabilitas perangkat.
3. Permintaan dialihkan ke adaptor aktif (`AdaptorAndroidMobile`, `AdaptorIOSMobile`, atau `AdaptorSimulatorMobile`).
4. Hasil dikembalikan sebagai `HasilOperasiNative` yang dinormalisasi ke dalam tipe data `peta` NUSANTARA.
