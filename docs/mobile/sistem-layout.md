# Sistem Tata Letak & Desain Responsif (Layout Engine)

Tata letak pada aplikasi seluler memiliki tantangan unik: rasio layar bervariasi, orientasi potret dan lanskap, serta adanya takik (*notch*), pulau dinamis (*dynamic island*), dan bilah navigasi gestur beranda.

---

## 1. Penanganan Area Aman (`AreaAmanMobile`)

`AreaAmanMobile` memastikan konten aplikasi tidak terpotong oleh lekukan fisik atau bilah status perangkat.

```nusantara
areaAman : peta = seluler.buatAreaAman()
seluler.tambahKomponenMobile(aplikasi, areaAman)
```
Properti inset default mencakup:
- `atas`: 47px (status bar & notch kamera depan)
- `bawah`: 34px (home indicator swipe bar)
- `kiri`: 0px
- `kanan`: 0px

---

## 2. Tata Letak Fleksibel (`TataLetakVertikal` & `TataLetakHorizontal`)

Mendukung perataan utama (`"mulai"`, `"tengah"`, `"akhir"`, `"sebar"`) dan jarak antar elemen (*gap*):

```nusantara
baris : peta = seluler.buatTataLetakHorizontal([], 12)
kolom : peta = seluler.buatTataLetakVertikal([], 16)
```

---

## 3. Tata Letak Bertumpuk (`TataLetakTumpukMobile`)

Digunakan untuk menempatkan komponen bertumpuk dalam sumbu Z (misalnya meletakkan tombol aksi mengambang / *Floating Action Button* di atas daftar).

---

## 4. Tampilan Gulir (`TampilanGulirMobile`)

Memungkinkan scrolling vertikal atau horizontal secara mulus dengan pantulan inersia (*bouncing physics*).

```nusantara
gulir : peta = seluler.buatTampilanGulir([], "vertikal")
```

---

## 5. Breakpoint Responsif

Dikelola secara otomatis oleh `PengelolaResponsifMobile`:
- **`ponsel_kecil`**: Lebar layar < 360px
- **`ponsel_standar`**: Lebar layar 360px – 599px (misal iPhone 12/13/14, Pixel 7)
- **`ponsel_besar`**: Lebar layar 600px – 839px (perangkat lipat terbuka)
- **`tablet`**: Lebar layar >= 840px (iPad, Android Tablet)
