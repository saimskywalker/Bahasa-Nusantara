# Apple App Store Updates (iOS)

Pada platform iOS, Apple melarang keras pengunduhan biner atau runtime bytecode di luar App Store resmi.

## Mekanisme Pembaruan Biner iOS
NUSANTARA Mobile mematuhi sepenuhnya kebijakan Apple melalui dua pendekatan resmi:
1. **StoreKit API Bridge**: Menampilkan lembar pembaruan resmi dalam aplikasi jika didukung oleh versi iOS.
2. **Deep Linking URL Resmi**: Mengarahkan pengguna langsung ke halaman aplikasi di App Store melalui tautan terverifikasi:
   `https://apps.apple.com/app/id<APPLE_APP_ID>` atau skema URL `itms-apps://itunes.apple.com/app/id<APPLE_APP_ID>`.

## Kepatuhan Terhadap Apple App Review
- **Guideline 2.5.2**: Pembaruan OTA di iOS **HANYA** diperbolehkan untuk aset non-kode (tema, lokalisasi, gambar, font).
- Setiap upaya memuat berkas biner `.dylib`, `.so`, atau biner eksekutabel akan ditolak oleh `UpdateSecurityPolicy`.
