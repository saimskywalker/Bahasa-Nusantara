# Panduan Pengujian Sistem Pembaruan (Testing Guide)

Suite pengujian komprehensif untuk Phase 42 terletak di `pengujian/mobile/uji_pembaruan_fase42.ts`.

## Menjalankan Pengujian

### Pengujian Khusus Phase 42
```bash
npm run test:pembaruan-v42
```
atau langsung menggunakan tsx:
```bash
npx tsx pengujian/mobile/uji_pembaruan_fase42.ts
```

### Menjalankan Seluruh Suite Pengujian NUSANTARA
```bash
npm test
```

## Cakupan 9 Kelompok Pengujian
1. **SemVer & VersionChecker**: Penguraian format, perbandingan versi, batas minimum, dan deteksi tipe perbedaan.
2. **Manifest Schema & Security**: Validasi reverse-DNS, pencegahan ekstensi `.dex`/`.so`, dan pencegahan path traversal `../`.
3. **Digital Signature & TrustManager**: Penandatanganan kanonikal Ed25519, verifikasi kunci publik, dan deteksi pemalsuan (tampering).
4. **HashValidator SHA-256**: Implementasi FIPS 180-4 murni dan verifikasi integritas byte.
5. **Aktivasi & Rollback**: Simulasi aktivasi atomik, pencadangan snapshot, dan pemulihan versi stabil.
6. **Integrasi Toko Aplikasi**: Simulasi Google Play In-App Updates dan tautan resmi Apple App Store.
7. **UpdateManager Facade**: Eksekusi alur lengkap dan pembuatan laporan audit Markdown.
8. **Mobile CLI Dispatcher**: Pengujian kode keluar 0 untuk perintah `versi`, `periksa`, `channel`, `store`, `laporan`, dan `history`.
9. **Standard Library std:mobile**: Interpretasi langsung program `.nusantara` yang memanggil API seluler.
