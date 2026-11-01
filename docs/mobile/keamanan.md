# Arsitektur Keamanan Mobile (Security Architecture)

Keamanan aplikasi seluler Nusantara berlandaskan prinsip pertahanan berlapis (*defense-in-depth*), mencakup penyimpanan kredensial terenkripsi, manajemen perizinan pengguna, validasi input formulir, dan integritas jembatan native.

---

## 1. Penyimpanan Aman Terenkripsi (`PenyimpananAmanMobile`)

Kredensial sensitif seperti token otentikasi JWT, kunci sesi, atau data rahasia pengguna tidak boleh disimpan dalam format teks biasa (*plaintext*).

Nusantara Mobile menyediakan modul `PenyimpananAmanMobile` yang mengabstraksikan **Android Keystore** dan **iOS Keychain** menggunakan enkripsi simetris standar industri **AES-256-CBC**:
- Inisialisasi IV (*Initialization Vector*) unik untuk setiap operasi enkripsi.
- Derivasi kunci berbasis perangkat (*Device-derived encryption key*).

```nusantara
# Menyimpan data aman
simpanAman("token_jwt", "eyJhGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")

# Mengambil data aman
token : teks = ambilAman("token_jwt")

# Menghapus data aman saat logout
hapusAman("token_jwt")
```

---

## 2. Isolasi Jembatan Native (*Native Bridge Isolation*)

Setiap panggilan RPC antara runtime Nusantara dan lapisan native Java/Kotlin/Swift melalui protokol pesan JSON terstruktur (`PesanJembatanPermintaan` / `PesanJembatanRespon`):
- Panggilan metode yang tidak terdaftar akan langsung ditolak dengan kode kesalahan `METODE_TIDAK_DITEMUKAN`.
- Mencegah eksekusi kode acak (*arbitrary code execution*) dari payload tidak terverifikasi.

---

## 3. Pencegahan Path Traversal

Akses terhadap berkas aset dibatasi hanya di dalam folder aset aplikasi dengan validasi ekstensi terdaftar ketat.
