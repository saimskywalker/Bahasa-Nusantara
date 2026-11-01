# Manajemen Event, Siklus Hidup & Status Aplikasi (State Management)

Pengelolaan data dan peristiwa dalam Nusantara Mobile mengadopsi model terpusat dan reaktif.

---

## 1. Siklus Hidup Aplikasi (*Mobile Lifecycle*)

Aplikasi seluler berpindah antar status berikut:

```text
[DIBUAT] -> [MEMULAI] -> [AKTIF] <===> [JEDA] (aplikasi di latar depan vs latar belakang)
                            |
                     [LATAR_BELAKANG]
                            |
                       [BERHENTI]
                            |
                      [DIHANCURKAN]
```

Metode kontrol siklus hidup pada `AplikasiMobile`:
- `aplikasi["jalankan"]()` -> berpindah ke status `AKTIF`.
- `aplikasi["jeda"]()` -> berpindah ke status `JEDA` saat layar terkunci atau ada panggilan masuk.
- `aplikasi["lanjutkan"]()` -> kembali ke status `AKTIF`.
- `aplikasi["berhenti"]()` -> berpindah ke status `LATAR_BELAKANG` / `BERHENTI`.
- `aplikasi["hancurkan"]()` -> membersihkan semua listener dan memori.

---

## 2. Pengelolaan State Reaktif (`PengelolaStateMobile`)

Menyimpan state global aplikasi dan memicu listener saat nilai berubah:

```nusantara
# Mengatur state
aplikasi["aturState"]("jumlahKeranjang", 5)

# Membaca state
total : bilangan = aplikasi["dapatkanState"]("jumlahKeranjang")
```

---

## 3. Penanganan Event Komponen

Setiap komponen mendukung metode `pasang(jenisPeristiwa, fungsiPenangan)`:

```nusantara
fungsi saatTeksBerubah(evt : peta) mulai
  tulis("Nilai baru: " + evt["nilaiTeks"])
selesai

input : peta = seluler.buatInputTeks("Ketik disini...")
input["pasang"]("teks_berubah", saatTeksBerubah)
```
