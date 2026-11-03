# Skema Manifest Pembaruan (update-manifest.json)

Manifest pembaruan adalah berkas JSON kanonikal yang mendefinisikan rilis aplikasi, metadata kompatibilitas, daftar resource OTA, dan tanda tangan kriptografis.

## Struktur Berkas Manifest Resmi
```json
{
  "schemaVersion": 1,
  "applicationId": "id.nusantara.aplikasi",
  "platform": "keduanya",
  "channel": "stable",
  "releaseVersion": "0.42.0",
  "minimumSupportedVersion": "0.40.0",
  "updateType": "ota_resource",
  "policy": "disarankan",
  "releaseDate": "2026-11-03T00:00:00.000Z",
  "expirationDate": "2027-11-03T00:00:00.000Z",
  "revision": 1,
  "storeUrl": {
    "googlePlay": "https://play.google.com/store/apps/details?id=id.nusantara.aplikasi",
    "appStore": "https://apps.apple.com/app/id123456789"
  },
  "releaseNotes": {
    "id": "Pembaruan tema visual dan katalog bahasa",
    "en": "Updated visual theme and localization bundle"
  },
  "resources": [
    {
      "id": "tema-utama",
      "tipe": "theme",
      "jalurRelatif": "assets/themes/garuda.json",
      "sha256": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      "ukuranByte": 4096
    }
  ],
  "tandaTangan": {
    "algoritma": "Ed25519",
    "keyId": "nusantara-root-release-2026",
    "nilaiTandaTangan": "a1b2c3d4...",
    "stempelWaktu": "2026-11-03T00:00:00.000Z"
  }
}
```

## Aturan Validasi `ManifestValidator`
1. `schemaVersion`: Wajib bernilai integer positif.
2. `applicationId`: Format reverse-DNS regex `^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$`.
3. `platform`: `android`, `ios`, atau `keduanya`.
4. `channel`: `development`, `alpha`, `beta`, `testing`, atau `stable`.
5. `resources`: Wajib berupa array berkas non-eksekutabel jika bertipe `ota_resource` atau `hybrid`.
