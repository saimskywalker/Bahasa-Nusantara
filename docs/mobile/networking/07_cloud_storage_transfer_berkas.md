# Cloud Storage Adapter & Transfer Berkas Mobile

## 1. Abstraksi Cloud Storage Provider-Neutral

Nusantara Mobile mengadopsi antarmuka `PenyediaStorageNetral` yang memisahkan kode aplikasi dari penyedia infrastruktur cloud tertentu. Aplikasi dapat beralih antara:
- **Local Sandbox / Mock Storage:** Untuk pengujian unit dan pengembangan offline.
- **Amazon S3 & S3 Compatible:** MinIO, Cloudflare R2, Wasabi, AWS S3.
- **Google Firebase Storage:** Menggunakan Firebase Storage REST API dengan token identitas pengguna.
- **Supabase Storage:** Menggunakan REST Storage API Supabase.

---

## 2. Fitur Keamanan Transfer Berkas

1. **Perlindungan Path Traversal:** Nama berkas yang diunggah atau diunduh dibersihkan secara otomatis (`../` dibuang dan karakter pembatas jalur dinormalisasi).
2. **Validasi Batas Ukuran:** Membatasi transfer mobile maksimal 50 MB per berkas untuk melindungi kuota data pengguna.
3. **Validasi MIME Type:** Memeriksa tipe media agar sesuai dengan ekstensi berkas.
4. **Pelacakan Progres:** Callback progres `(persen, byteTerkirim, totalByte)` untuk memperbarui antarmuka pengguna secara real-time.

---

## 3. Contoh Penggunaan dalam NUSANTARA

```nusantara
gunakan "std:mobile" sebagai seluler

# Unggah berkas
hasilUnggah : peta = seluler.unggahBerkasCloud("foto_profil.jpg", kontenBiner, { "folder": "avatar" })
tampilkan("URL Berkas:", hasilUnggah["berkas"]["url"])

# Unduh berkas
hasilUnduh : peta = seluler.unduhBerkasCloud(hasilUnggah["berkas"]["id"])
tampilkan("Tipe MIME:", hasilUnduh["mimeType"])
```
