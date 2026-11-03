# Panduan Konfigurasi Google Play Developer API & Track Management
**Bahasa Pemrograman NUSANTARA** — Versi `v0.41.0` (Fase 41)

## 1. Persyaratan Kredensial Google Play Console

Untuk mengintegrasikan rilis otomatis dengan Google Play Store, pengembang membutuhkan Service Account Google Cloud dengan izin akses Google Play Developer API:

1. Buka **Google Play Console** -> **Pengaturan Pengembang** -> **Akses API**.
2. Buat proyek Google Cloud baru atau pilih proyek yang sudah ada.
3. Buat **Akun Layanan** (*Service Account*) dengan peran *Service Account User*.
4. Berikan izin di Google Play Console:
   - *Kelola rilis aplikasi untuk semua track*.
   - *Edit detail cantuman toko*.
5. Unduh berkas kunci privat JSON (`service-account.json`).

## 2. Variabel Lingkungan yang Didukung

Simpan kredensial di variabel lingkungan atau file `.env` (JANGAN pernah melakukan commit ke repositori Git!):

| Variabel Lingkungan | Deskripsi | Wajib / Opsional |
|---------------------|-----------|------------------|
| `ANDROID_PUBLISHER_KEY_JSON` | Konten mentah JSON Service Account | Pilihan Utama |
| `GOOGLE_APPLICATION_CREDENTIALS` | Jalur absolut ke berkas `service-account.json` | Pilihan Alternatif |
| `GOOGLE_PLAY_PACKAGE_NAME` | Nama paket unik aplikasi (contoh: `id.nusantara.aplikasi`) | Wajib untuk API |

Jika variabel di atas tidak ditemukan, NUSANTARA Mobile Publisher otomatis berjalan dalam mode **Sandbox Aman** (*Simulator Mock*), sehingga tim pengembang tetap dapat menguji alur rilis tanpa takut membocorkan kredensial atau merusak rilis produksi.

## 3. Manajemen Track Google Play

NUSANTARA mendukung 4 track resmi:

1. **Internal Testing**:
   - Ditujukan untuk tim internal developer & QA (hingga 100 penguji).
   - Verifikasi langsung tanpa peninjauan panjang oleh Google.
   - Paling ideal untuk CI/CD otomatis setiap commit/PR.

2. **Closed Testing** (Alpha/Grup Tertutup):
   - Pengujian terfokus untuk grup pengguna terundang.
   - Mendukung peluncuran bertahap (*staged rollout*).

3. **Open Testing** (Beta Terbuka):
   - Siapa saja dapat bergabung di Google Play Store untuk mencoba versi beta.

4. **Production**:
   - Rilis publik yang dapat diunduh oleh semua pengguna.
   - Memerlukan persetujuan eksplisit melalui flag `--setujui`.

## 4. Kebijakan Target SDK Google Play

Sesuai aturan Google Play Console:
- Rilis aplikasi baru **wajib menggunakan Target SDK 34 (Android 14) atau lebih tinggi**.
- Validator NUSANTARA secara otomatis memeriksa nilai `targetSdkVersion` dan akan membatalkan rilis jika di bawah versi 34.
