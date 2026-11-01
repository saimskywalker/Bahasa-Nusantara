# Sistem Navigasi & Tautan Dalam (Navigation & Deep Linking)

Nusantara Mobile menyediakan arsitektur navigasi komprehensif yang dirancang untuk alur layar aplikasi seluler.

---

## 1. Navigator Tumpukan (`NavigatorTumpukanMobile`)

Mendukung model tumpukan riwayat halaman (*LIFO stack*):

- **`dorong(namaRute, parameter)`**: Membuka halaman baru ke atas tumpukan dengan animasi transisi.
- **`kembali()`**: Menutup halaman saat ini dan kembali ke halaman sebelumnya.
- **`ganti(namaRute, parameter)`**: Mengganti halaman aktif saat ini tanpa menambah kedalaman tumpukan.
- **`reset(namaRute, parameter)`**: Mengosongkan riwayat tumpukan dan menjadikan rute baru sebagai akar.
- **`bisaKembali()`**: Memeriksa apakah terdapat halaman sebelumnya di riwayat.

```nusantara
nav : peta = seluler.buatNavigatorTumpukan("beranda")
```

---

## 2. Navigasi Tab Bawah (`NavigatorTabMobile` & `NavigasiBawahMobile`)

Menyediakan tab bar di bagian bawah layar yang lazim ditemui pada aplikasi seluler modern:

```nusantara
daftarTab : daftar = [
  {"kunci": "beranda", "label": "Beranda", "ikon": "home"},
  {"kunci": "pesan", "label": "Pesan", "ikon": "chat", "lencana": 3},
  {"kunci": "akun", "label": "Akun", "ikon": "person"}
]

tabNav : peta = seluler.buatNavigatorTab(daftarTab)
```

---

## 3. Tautan Dalam (*Deep Linking*)

Dikelola melalui `PengelolaDeepLinkMobile`. Memungkinkan aplikasi dibuka dari URL luar (misalnya `nusantara://tokoku/produk/45?promo=merdeka`):

- Mengurai skema, host, rute, dan parameter kueri.
- Menjalankan penangan rute terdaftar secara otomatis.
