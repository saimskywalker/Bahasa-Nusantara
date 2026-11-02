# Panduan Pengujian Beta melalui Apple TestFlight

TestFlight adalah platform resmi Apple untuk mendistribusikan versi beta aplikasi kepada hingga 10.000 penguji eksternal dan 100 penguji internal sebelum dirilis secara publik di App Store.

---

## 1. Syarat Unggah ke TestFlight
Sebelum mengunggah berkas archive (`.xcarchive`) ke TestFlight:
1. **Archive Tersedia**: Berkas `.xcarchive` berhasil dibangkitkan tanpa galat kompilasi.
2. **Kenaikan Build Number**: Nilai `CFBundleVersion` (nomor build) harus lebih tinggi dari build sebelumnya.
3. **Deskripsi Izin Privasi**: Seluruh izin privasi yang digunakan (kamera, lokasi, mikrofon, galeri) wajib menyertakan string alasan yang jelas di `Info.plist`.
4. **Kepatuhan Kriptografi (Export Compliance)**: Menyatakan apakah aplikasi menggunakan enkripsi non-standar.

---

## 2. Alur Pengunggahan Melalui Xcode Organizer
1. Di macOS, buka Xcode -> **Window** -> **Organizer**.
2. Pilih arsip aplikasi yang dihasilkan Nusantara Mobile di tab **Archives**.
3. Klik tombol **Distribute App**.
4. Pilih metode distribusi **Custom** -> **App Store Connect**.
5. Pilih opsi **Upload** dan ikuti panduan verifikasi penandatanganan otomatis.
6. Setelah status *Processing* selesai di portal [App Store Connect](https://appstoreconnect.apple.com), tambahkan grup penguji internal atau eksternal.
