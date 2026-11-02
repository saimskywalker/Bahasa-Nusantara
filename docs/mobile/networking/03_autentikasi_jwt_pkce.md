# Autentikasi Mobile, Token JWT & OAuth 2.0 PKCE

## 1. Pendahuluan Keamanan Autentikasi Mobile

Aplikasi mobile publik yang berjalan pada perangkat Android dan iOS diklasifikasikan sebagai *Public Clients* oleh standar OAuth 2.0 (RFC 8252). Artinya:
1. **Dilarang Menyimpan Client Secret:** File APK atau IPA dapat didekompilasi dengan mudah. Menyimpan *client secret* di dalam kode sumber aplikasi mobile adalah celah keamanan kritis.
2. **Wajib Menggunakan PKCE:** *Proof Key for Code Exchange* (RFC 7636) wajib diterapkan untuk mencegah intersepsi *authorization code* oleh aplikasi pihak ketiga jahat pada perangkat yang sama.
3. **Penyimpanan Token Terisolasi:** Token JWT (*access token* dan *refresh token*) tidak boleh disimpan dalam SharedPreferences atau UserDefaults biasa tanpa enkripsi perangkat keras.

---

## 2. Siklus Hidup Autentikasi dalam NUSANTARA

```nusantara
gunakan "std:mobile" sebagai seluler

auth : peta = seluler.buatKlienAutentikasi()

# 1. Masuk menggunakan email dan sandi
hasil : peta = auth.masuk("andi@nusantara.id", "KunciRahasia#123")
jika hasil["sukses"] maka
    tampilkan("Selamat datang,", hasil["pengguna"]["nama"])
    tampilkan("Token Akses Tersimpan:", auth.dapatkanToken())
selesai

# 2. Memeriksa status login
apakahAktif : logika = auth.apakahTerautentikasi()

# 3. Keluar dan menghapus token secara aman
auth.keluar()
```

---

## 3. Alur OAuth 2.0 PKCE pada Nusantara Mobile

Untuk integrasi dengan IdP (*Identity Provider*) pihak ketiga (Google, GitHub, Keycloak, Supabase):

1. **Pembuatan Verifier & Challenge:**
   - Aplikasi menghasilkan `code_verifier` acak berukuran 32 byte dengan entropi tinggi (`base64url`).
   - Aplikasi menghitung hash SHA-256 dari verifier untuk menghasilkan `code_challenge`.
2. **Permintaan Otorisasi:**
   - Aplikasi membuka Custom Tabs (Android) atau ASWebAuthenticationSession (iOS) menuju endpoint otorisasi dengan menyertakan `code_challenge` dan `code_challenge_method=S256`.
3. **Penukaran Kode:**
   - Setelah pengguna menyetujui, IdP mengirimkan `code` melalui *deep link* / *custom URL scheme*.
   - Aplikasi menukarkan `code` bersama `code_verifier` asli langsung ke endpoint token tanpa memerlukan *client secret*.
4. **Penyimpanan:**
   - Token disimpan secara terenkripsi ke dalam Android Keystore atau iOS Keychain.
