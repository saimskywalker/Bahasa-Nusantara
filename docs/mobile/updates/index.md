# Dokumentasi Resmi: Nusantara Mobile Update System & OTA (Phase 42)

Modul **Nusantara Mobile Update System & Over-the-Air Updates (OTA)** (versi target `v0.42.0`) menyediakan infrastruktur pembaruan aplikasi mobile yang aman, modular, dan mematuhi kebijakan Google Play Store serta Apple App Store.

## Daftar Isi Dokumentasi

1. [Arsitektur Dua Jalur (Architecture)](architecture.md) — Pemisahan biner native vs resource OTA non-eksekutabel
2. [Pemeriksa Versi Semantik (Version Checker)](version-checker.md) — Logika SemVer, evaluasi versi minimum, dan kompatibilitas
3. [Skema Manifest Pembaruan (Update Manifest)](update-manifest.md) — Struktur berkas JSON manifest dan validasi reverse-DNS
4. [Saluran Rilis (Update Channels)](update-channels.md) — Pengelolaan saluran Stable, Beta, Alpha, Testing, Development
5. [Pembaruan Resource OTA (OTA Resource Update)](ota-resource-update.md) — Siklus hidup unduhan dan aktivasi tema, font, lokalisasi
6. [Pengelola Unduhan Aman (Secure Download)](secure-download.md) — HTTPS wajib, batas ukuran bundle, anti-decompression bomb
7. [Tanda Tangan Digital (Digital Signature)](digital-signature.md) — Kriptografi Ed25519 dan TrustManager publik key
8. [Google Play In-App Updates](android-in-app-updates.md) — Integrasi alur Flexible dan Immediate di Android
9. [Apple App Store Updates](ios-app-store-updates.md) — Pengalihan resmi ke App Store via StoreKit di iOS
10. [Sistem Notifikasi & Pengingat (Notification)](notification.md) — Strategi pengingat frekuensi dan dialog pembaruan
11. [Kebijakan Pembaruan (Update Policy)](update-policy.md) — Evaluasi kebijakan opsional, disarankan, wajib, darurat
12. [Mekanisme Rollback & Pemulihan (Resource Rollback)](resource-rollback.md) — Pencadangan otomatis dan pemulihan snapshot
13. [Spesifikasi Backend API (Backend API)](backend-api.md) — Endpoint /check, /manifest, dan format respons server
14. [Analitik Berorientasi Privasi (Analytics Privacy)](analytics-privacy.md) — Metrik agregat tanpa pelacakan PII pengguna
15. [Panduan Keamanan (Security Hardening)](security.md) — Pertahanan Path Traversal, Zip-Slip, dan ekstensi terlarang
16. [Strategi Pengujian (Testing Strategy)](testing.md) — Pengujian unit, integrasi CLI, dan eksekusi skrip .nusantara
17. [Panduan Pemecahan Masalah (Troubleshooting)](troubleshooting.md) — Diagnosa kode kesalahan dan solusi kegagalan update
