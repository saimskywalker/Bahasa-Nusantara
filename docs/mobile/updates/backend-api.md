# Spesifikasi Backend Update API

NUSANTARA Mobile menyediakan kontrak API ringan yang dapat dihosting di infrastruktur cloud apa pun (Cloudflare Workers, AWS Lambda, Google Cloud Run, atau server Express/Go).

## Endpoint Resmi

### 1. Periksa Pembaruan (`GET /api/v1/updates/check`)
**Parameter Query:**
- `appId`: Identitas reverse-DNS aplikasi (misal: `id.nusantara.aplikasi`)
- `version`: Versi terpasang saat ini (misal: `0.41.0`)
- `platform`: `android` atau `ios`
- `channel`: `stable`, `beta`, `alpha`, `testing`, `development`

**Format Respons (200 OK):**
```json
{
  "adaPembaruan": true,
  "status": "PEMBARUAN_TERSEDIA",
  "versiTerpasang": "0.41.0",
  "versiTerbaru": "0.42.0",
  "versiMinimum": "0.40.0",
  "perluPembaruanWajib": false,
  "jenisPembaruan": "ota_resource",
  "saluran": "stable",
  "kebijakan": "disarankan",
  "catatanRilis": {
    "id": "Pembaruan tema visual Garuda Dark"
  },
  "totalUkuranResourceByte": 4096,
  "manifestUrl": "https://cdn.nusantara-lang.org/updates/manifest.json"
}
```

### 2. Unduh Manifest (`GET /api/v1/updates/manifest`)
Mengembalikan obyek `update-manifest.json` lengkap dengan tanda tangan digital kanonikal.
