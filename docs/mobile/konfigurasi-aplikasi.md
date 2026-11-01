# Konfigurasi Aplikasi Mobile (`nusantara.json`)

Setiap aplikasi Nusantara Mobile dikonfigurasi melalui berkas `nusantara.json`. Berkas ini divalidasi oleh `PengelolaKonfigurasiMobile` untuk memastikan tidak ada kesalahan format, ID paket yang keliru, atau konflik izin.

---

## 1. Skema Lengkap `nusantara.json`

```json
{
  "nama": "Toko Nusantara",
  "id": "id.nusantara.tokoku",
  "versi": "1.0.0",
  "nomorBuild": 1,
  "deskripsi": "Aplikasi belanja daring terpercaya dengan Nusantara Mobile",
  "pengembang": "PT Nusantara Digital Indonesia",
  "orientasi": "potret",
  "temaAwal": "terang",
  "platformTarget": {
    "android": true,
    "ios": true
  },
  "versiMinPlatform": {
    "androidMinSdk": 24,
    "androidTargetSdk": 34,
    "iosDeploymentTarget": "15.0"
  },
  "daftarIzin": [
    "internet",
    "kamera",
    "lokasi",
    "notifikasi"
  ],
  "daftarAset": [
    "aset/logo.png",
    "aset/banner.webp"
  ]
}
```

---

## 2. Rincian Properti

| Properti | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `nama` | string | Ya | Nama tampilan aplikasi pada layar beranda perangkat |
| `id` | string | Ya | Identifier unik terbalik (misal: `id.nusantara.aplikasi`) |
| `versi` | string | Ya | Versi semantik (*Semantic Versioning*), misal `1.0.0` |
| `nomorBuild` | integer | Ya | Angka bulat bertambah untuk versi toko aplikasi (*versionCode*) |
| `orientasi` | string | Tidak | Pilihan: `"potret"`, `"lanskap"`, `"otomatis"` |
| `daftarIzin` | string[] | Tidak | Daftar izin yang dibutuhkan aplikasi |
| `platformTarget`| object | Ya | Target platform yang diaktifkan (`android`, `ios`) |
| `versiMinPlatform` | object | Tidak | Target minimum versi Android SDK dan iOS Deployment |
