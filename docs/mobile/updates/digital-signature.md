# Tanda Tangan Digital & TrustManager

Modul `SignatureVerifier` dan `TrustManager` menyediakan verifikasi kriptografis asimetris untuk mencegah serangan perantara (Man-in-the-Middle) dan pemalsuan paket pembaruan.

## Algoritma yang Didukung
- **Ed25519** (Rekomendasi Utama — Kurva Eliptik Cepat & Aman)
- **RSA-SHA256** (Standar Kompatibilitas Enterprise)
- **HMAC-SHA256** (Pengujian Lokal / Simulasi)

## Serialisasi Kanonikal (Canonical Digest)
Sebelum penandatanganan dan verifikasi, field `tandaTangan` dikeluarkan dari obyek JSON manifest, dan kunci diurutkan secara leksikografis (alphabetical sort). Hal ini menjamin bahwa representasi string JSON menghasilkan hash SHA-256 yang identik di lingkungan mana pun.

## Pengelolaan Kunci (TrustManager)
- Kunci publik tepercaya disematkan di klien (Pinned Public Key).
- Kunci privat **TIDAK PERNAH** disimpan di klien aplikasi.
- Mendukung mekanisme rotasi kunci dan pencabutan kunci kedaluwarsa (`cabutKunci`).
