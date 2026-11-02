# API Penyimpanan Aman Terenkripsi (Secure Storage API)

API untuk menyimpan kredensial, token autentikasi, dan data sensitif menggunakan enkripsi perangkat keras Keystore (Android) dan Keychain Services (iOS).

## Nama API
- `simpan_aman.tulis`: Menyimpan pasangan kunci-nilai dengan enkripsi hardware (AES-256).
- `simpan_aman.baca`: Mengambil dan mendekripsi nilai tersimpan.
- `simpan_aman.hapus`: Menghapus data sensitif dari penyimpanan terenkripsi.

## Mekanisme Keamanan
1. **Android**: Menggunakan Android Keystore system (`MasterKey` AES-256-GCM) dan `EncryptedSharedPreferences`.
2. **iOS**: Menggunakan Apple Keychain Services (`kSecClassGenericPassword` dengan atribut akses `kSecAttrAccessibleAfterFirstUnlock`).
3. **Desktop Simulator**: Enkripsi fallback AES-256-CBC dengan HMAC berbasis kunci mesin terisolasi.

## Contoh Kode NUSANTARA
```nusantara
gunakan "std:mobile" sebagai seluler

program SimpanToken
mulai
  seluler.panggilNative("simpan_aman.tulis", { "kunci": "jwt_token", "nilai": "rahasia_123" })
  hasil : peta = seluler.panggilNative("simpan_aman.baca", { "kunci": "jwt_token" })
  tampilkan("Token Ditemukan: " + hasil["data"]["ditemukan"])
selesai
```
