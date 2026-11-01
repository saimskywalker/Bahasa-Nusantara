# Komponen Antarmuka Mobile (UI Primitives)

Nusantara Mobile menyediakan pustaka komponen antarmuka yang dirancang untuk layar sentuh dengan responsivitas tinggi.

---

## 1. Komponen Teks & Tipografi

```nusantara
# buatTeks(teks, ukuranFont?, beratFont?, warnaTeks?)
judul : peta = seluler.buatTeks("Halo Dunia", 24, "tebal", "#1a237e")
subjudul : peta = seluler.buatTeks("Keterangan aplikasi", 14, "tipis", "#757575")
```

---

## 2. Komponen Tombol (Button)

Mendukung berbagai varian: `"primer"`, `"sekunder"`, `"garis"`, `"teks"`, dan `"bahaya"`.

```nusantara
fungsi saatSimpan(evt : peta) mulai
  tulis("Data berhasil disimpan!")
selesai

tombolPrimer : peta = seluler.buatTombol("Simpan Data", saatSimpan, "primer")
tombolBahaya : peta = seluler.buatTombol("Hapus Akun", saatHapus, "bahaya")
```

---

## 3. Komponen Masukan (Input Forms)

- **`buatInputTeks(placeholder, nilaiAwal?, padaBerubah?)`**: Input teks standar.
- **`buatInputSandi(placeholder, nilaiAwal?)`**: Input kata sandi dengan sensor sembunyi otomatis.
- **`buatSakelar(statusAwal, padaBerubah?)`**: Switch toggle on/off.
- **`buatKotakCentang(label, dicentang?, padaBerubah?)`**: Checkbox interaktif.
- **`buatTombolRadio(label, nilai, terpilih?, padaPilih?)`**: Radio button pilihan tunggal.
- **`buatDropdown(opsi, nilaiAwal?, padaPilih?)`**: Pilihan menu jatuh kebawah (*select dropdown*).

---

## 4. Komponen Umpan Balik & Hamparan (Feedback & Overlay)

- **`tampilkanSnackbar(pesan, durasiMs?, tipe?)`**: Menampilkan pemberitahuan singkat di bagian bawah layar (`"info"`, `"sukses"`, `"peringatan"`, `"bahaya"`).
- **`tampilkanAlert(judul, pesan, konfirmasi?, batal?)`**: Menampilkan pop-up dialog peringatan modal.
- **`buatIndikatorMemuat(aktif, ukuran)`**: Animasi pemuatan (*spinner loading indicator*).
- **`buatIndikatorProgres(nilai, maks)`**: Bilah progres penyelesaian proses.
