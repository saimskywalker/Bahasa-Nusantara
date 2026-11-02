# Klien REST API Nusantara Mobile (KlienAPIMobile)

## 1. Ikhtisar

`KlienAPIMobile` menyediakan antarmuka terpadu untuk berkomunikasi dengan REST API dan backend modern. Dirancang secara khusus untuk arsitektur mobile, klien ini mengintegrasikan:
- Encoding URL otomatis untuk query parameters.
- Penyisipan header otentikasi Bearer / API Key.
- Penegakan kunci idempotensi (*Idempotency-Key*) untuk mencegah duplikasi pesanan/transaksi.
- Penangkapan otomatis (*interception*) ke antrean operasi offline ketika perangkat kehilangan koneksi internet.
- Kebijakan coba ulang (*retry policy*) dengan exponential backoff dan jitter acak.

---

## 2. Inisialisasi Klien dalam Bahasa NUSANTARA

```nusantara
gunakan "std:mobile" sebagai seluler

konfig : peta = {
    "baseUrl": "https://api.toko.id/v1",
    "batasWaktuMs": 15000,
    "validasiTLS": benar,
    "antreanOffline": benar
}

klien : peta = seluler.buatKlienAPI(konfig)
```

---

## 3. Metode Permintaan HTTP

### A. Mengambil Data (GET)
```nusantara
respon : peta = klien.dapatkan("/produk", { "kategori": "buku", "halaman": 1 })
jika respon["sukses"] maka
    tampilkan("Status:", respon["status"])
    tampilkan("Data:", respon["data"])
selesai
```

### B. Membuat Data Baru (POST)
```nusantara
payload : peta = {
    "judul": "Buku Panduan Nusantara",
    "harga": 150000
}
respon : peta = klien.kirim("/produk", payload)
tampilkan("Pesan:", respon["data"]["pesan"])
```

### C. Memperbarui Data Penuh (PUT)
```nusantara
pembaruan : peta = {
    "judul": "Buku Panduan Nusantara Edisi 2",
    "harga": 175000
}
respon : peta = klien.perbarui("/produk/101", pembaruan)
```

### D. Memperbarui Sebagian Data (PATCH)
```nusantara
respon : peta = klien.tambal("/produk/101", { "harga": 160000 })
```

### E. Menghapus Data (DELETE)
```nusantara
respon : peta = klien.hapusData("/produk/101")
```

---

## 4. Mekanisme Idempotency-Key
Untuk operasi yang mengubah status data di server (`POST`, `PUT`, `PATCH`, `DELETE`), `KlienAPIMobile` secara otomatis menyertakan header `Idempotency-Key: req_<uuid>`. Header ini menjamin bahwa jika koneksi terputus di tengah jalan dan klien mengirim ulang permintaan, backend hanya akan memproses operasi tersebut satu kali dan mengembalikan respon yang sama tanpa menimbulkan duplikasi transaksi.
