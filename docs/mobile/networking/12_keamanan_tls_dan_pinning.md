# Standar Keamanan Jaringan, TLS, dan Redaksi Rahasia

## 1. Penegakan Protokol HTTPS & Validasi Sertifikat TLS

Pada aplikasi produksi, keamanan komunikasi data adalah syarat mutlak:
- **HTTPS Wajib:** Penggunaan URL berbasis `http://` secara otomatis ditolak pada mode produksi oleh `LapisanKeamananMobile.validasiUrlAman()`.
- **Validasi TLS Aktif:** Opsi untuk menonaktifkan validasi sertifikat (`rejectUnauthorized: false`) dilarang pada lingkungan produksi.
- **Certificate Pinning (Arsitektur Aman):** Jika menerapkan *certificate pinning*, wajib menyertakan kunci cadangan (*backup pin*) dan strategi rotasi sertifikat dari jarak jauh untuk mencegah aplikasi lumpuh total saat sertifikat SSL/TLS diperbarui oleh otoritas sertifikat (CA).

---

## 2. Sensor Otomatis Data Sensitif (*Secret Redaction*)

Semua pencatatan log diagnostik dan konsol jaringan secara otomatis menyensor data rahasia:
- Header sensitif (`Authorization`, `X-API-Key`, `Cookie`, `X-Secret`) disamarkan menjadi `depan...***...belakang` atau `******`.
- Kunci kamus seperti `password`, `sandi`, `token`, `secret`, `api_key` disensor secara rekursif sebelum dicetak.

---

## 3. Pencegahan Pemalsuan Izin di Sisi Klien (*Client-Side Role Tampering*)

Pengembang klien dilarang keras menyisipkan klaim otorisasi seperti `role: "admin"`, `is_admin: true`, atau `hak_akses: "superadmin"` pada muatan permintaan lokal. `LapisanKeamananMobile.periksaKlaimKlien()` akan mendeteksi dan menolak pengiriman payload tersebut, serta memberikan peringatan bahwa seluruh kontrol otorisasi harus diverifikasi secara mutlak di sisi server backend.
