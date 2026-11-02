# Penyimpanan Token Aman: Android Keystore & Apple Keychain

## 1. Urgensi Perlindungan Kredensial di Smartphone

Token sesi dan token otorisasi memberikan hak akses langsung ke data pengguna di server backend. Menyimpan token dalam berkas teks polos, `localStorage`, atau `SharedPreferences` rentan terhadap eksfiltrasi data via *root/jailbreak attack*, *backup extraction*, atau eksploitasi sistem berkas bersama.

Nusantara Mobile mengintegrasikan modul **Penyimpanan Aman (Secure Storage)** dari Phase 38:
- **Android:** Menggunakan **Android Keystore System** dengan cipher `AES-256-GCM` dan kunci privat yang dihasilkan di dalam perangkat keras *Trusted Execution Environment* (TEE) atau *StrongBox Keymaster*.
- **iOS:** Menggunakan **Apple Keychain Services** dengan kelas keamanan `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly` dan enkripsi *Secure Enclave*.
- **Desktop Simulator:** Menggunakan algoritma `AES-256-CBC` dengan derivasi kunci `scrypt` dan salt unik yang terisolasi.

---

## 2. API Penyimpanan Aman

Secara internal, `KlienAutentikasiMobile` dan `PengelolaOperasiOffline` menggunakan kunci aman berikut:
- `nusantara_mobile_auth_access_token`
- `nusantara_mobile_auth_refresh_token`
- `nusantara_mobile_auth_metadata`
- `nusantara_mobile_antrean_offline_v1`

Pengembang juga dapat menyimpan rahasia kustom langsung dari bahasa NUSANTARA:
```nusantara
gunakan "std:mobile" sebagai seluler

# Simpan rahasia
seluler.simpanAman("api_key_perbankan", "sk_live_992834812304")

# Ambil rahasia
kunci : teks = seluler.ambilAman("api_key_perbankan")

# Hapus rahasia
seluler.hapusAman("api_key_perbankan")
```
