# API Perangkat Seluler (Device APIs)

Nusantara Mobile menyertakan sekumpulan API perangkat bawaan yang bekerja secara konsisten di Android, iOS, dan mode simulator.

---

## 1. Informasi Perangkat (`dapatkanInfoPerangkat`)

Mengembalikan data perangkat keras dan sistem:
- `namaPerangkat`: Nama pengenal perangkat.
- `model`: Model perangkat keras.
- `produsen`: Pabrikan perangkat (Apple, Samsung, Google, dll).
- `platform`: `"android"`, `"ios"`, atau `"desktop_preview"`.
- `versiOS`: Versi sistem operasi aktif.
- `lebarLayar` & `tinggiLayar`: Dimensi layar dalam pixel titik.
- `skalaPiksel`: Kepadatan piksel (*pixel ratio*).

---

## 2. Status Jaringan (`dapatkanStatusJaringan`)

- `terhubung`: `benar` jika perangkat memiliki koneksi aktif.
- `tipe`: `"wifi"`, `"seluler"`, `"ethernet"`, atau `"tidak_ada"`.
- `mahal`: `benar` jika koneksi berupa data seluler berbayar (*metered*).

---

## 3. Status Baterai (`dapatkanStatusBaterai`)

- `level`: Nilai desimal antara `0.0` sampai `1.0`.
- `sedangMengisi`: Status pengisian daya kabel/nirkabel.
- `modeHematDaya`: Status penghemat baterai aktif.

---

## 4. Umpan Balik Haptik & Getaran

- `getar(durasiMs)`: Menggetarkan perangkat selama sekian milidetik.
- `haptik(jenis)`: Pola getaran taktil spesifik (`"ringan"`, `"sedang"`, `"berat"`, `"sukses"`, `"peringatan"`, `"gagal"`).

---

## 5. Papan Klip (*Clipboard*)

- `salinPapanKlip(teks)`: Menyimpan teks ke papan klip sistem.
- `tempelPapanKlip()`: Membaca teks dari papan klip sistem.

---

## 6. Lokasi & Geolokasi (`dapatkanLokasi`)

Mengembalikan koordinat GPS pengguna (`latitude`, `longitude`, `akurasi`, `stempelWaktu`). Memeriksa izin lokasi secara otomatis sebelum meminta sensor.

---

## 7. Notifikasi Lokal & Berbagi

- `jadwalkanNotifikasi(opsi)`: Menjadwalkan pengingat lokal dengan waktu tunda.
- `batalkanNotifikasi(id)`: Membatalkan notifikasi terjadwal.
- `bagikan(opsi)`: Membuka lembar berbagi sistem bawaan (*System Share Sheet*).
