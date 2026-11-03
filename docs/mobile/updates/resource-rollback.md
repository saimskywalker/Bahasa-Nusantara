# Mekanisme Rollback & Pemulihan (Resource Rollback)

Modul `RollbackManager` menjamin aplikasi tidak pernah terhenti (brick) akibat aset tema yang rusak atau korupsi data non-eksekutabel.

## Cara Kerja Rollback
1. **Pembuatan Snapshot Otomatis**: Setiap kali `ActivationManager` bersiap mengaktifkan resource baru, salinan lengkap dari versi aktif disimpan ke folder cadangan (`backup/`).
2. **Pendeteksi Crash Otomatis (Crash Threshold)**: Jika aplikasi mengalami 3 kali crash berturut-turut setelah pembaruan resource, sistem secara otomatis masuk ke **Safe Mode** dan memulihkan snapshot cadangan.
3. **Rollback Manual via CLI / Kode**:
   - CLI: `nusantara mobile update rollback`
   - Nusantara Code: `seluler.rollbackPembaruanResourceMobile()`

## Batasan Penting
Rollback di sisi klien **HANYA BERLAKU UNTUK RESOURCE OTA**. Biner aplikasi native (.apk/.ipa) tidak dapat di-rollback sepihak oleh klien karena aturan integritas sistem operasi Android/iOS.
