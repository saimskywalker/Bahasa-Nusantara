# Pengelolaan Saluran Rilis (Update Channels)

NUSANTARA Mobile menyediakan 5 saluran rilis independen untuk mendukung pengujian bertahap sebelum pembaruan diluncurkan ke pengguna produksi:

| Saluran | Nama Tampilan | Stabilitas | Sasaran Pengguna |
|---|---|---|---|
| `development` | Pengembangan | Sangat Rendah | Pengembang lokal internal |
| `alpha` | Pra-Uji Coba | Rendah | Tim QA & Penguji Tertutup |
| `beta` | Uji Coba Terbuka | Sedang | Penguji publik antusias |
| `testing` | Pengujian Staging | Tinggi | Simulasi toko aplikasi pra-rilis |
| `stable` | Produksi Resmi | Sangat Stabil | Seluruh pengguna publik umum |

## Perintah CLI Penggantian Saluran
```bash
# Melihat saluran aktif
nusantara mobile update channel

# Mengganti saluran aktif ke Beta
nusantara mobile update channel beta

# Mengembalikan saluran ke Stable
nusantara mobile update channel stable
```
