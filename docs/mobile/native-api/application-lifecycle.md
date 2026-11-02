# Integrasi Siklus Hidup Aplikasi (Application Lifecycle API)

Dokumentasi ini menjelaskan integrasi siklus hidup (lifecycle) aplikasi mobile dengan pengelolaan sumber daya perangkat native.

## Status Siklus Hidup
1. **DIBUAT**: Aplikasi telah dialokasikan ke memori.
2. **MEMULAI**: Jendela aplikasi sedang bersiap masuk ke layar.
3. **AKTIF**: Aplikasi aktif berada di latar depan (foreground) dan menerima interaksi pengguna.
4. **JEDA**: Aplikasi terhalang sebagian (misalnya dialog sistem atau panggilan masuk).
5. **RESUME**: Aplikasi kembali aktif ke latar depan dari status jeda.
6. **BERHENTI**: Aplikasi masuk ke latar belakang (background).
7. **DIHANCURKAN**: Aplikasi ditutup dan seluruh resource native dibebaskan.

## Pengelolaan Sumber Daya Otomatis
Saat aplikasi berpindah ke status **JEDA** atau **BERHENTI**:
- Sensor gerak (akselerometer/giroskop) otomatis dinonaktifkan untuk menghemat baterai.
- Modul kamera dan mikrofon dilepaskan dari memori.
- Pemantauan lokasi GPS dihentikan jika tidak memiliki izin latar belakang khusus.
