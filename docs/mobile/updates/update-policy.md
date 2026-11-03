# Kebijakan Pembaruan (Update Policy)

Modul `UpdatePolicyManager` menentukan perilaku aplikasi ketika mendeteksi versi baru di server.

## Klasifikasi Kebijakan

1. **`opsional` (Optional)**:
   - Pengguna bebas memilih apakah ingin memperbarui atau tetap menggunakan versi saat ini.
   - Tombol "Abaikan" atau "Nanti Saja" tersedia.

2. **`disarankan` (Recommended)**:
   - Notifikasi dialog ditampilkan secara elegan dengan penekanan pada fitur baru atau peningkatan performa.
   - Pengguna masih dapat menunda hingga jadwal pengingat berikutnya.

3. **`wajib` (Mandatory / Force Update)**:
   - Terjadi ketika versi klien berada di bawah `minimumSupportedVersion`.
   - Menampilkan modal memblokir (blocking screen) yang mengharuskan pembaruan sebelum aplikasi dapat digunakan.

4. **`keamanan` (Security Patch)**:
   - Pembaruan darurat untuk menambal kerentanan keamanan kritis.
   - Menonaktifkan fitur penundaan.

5. **`resource_saja` (Resource Only)**:
   - Pembaruan murni data/tema OTA di latar belakang tanpa mengganggu alur navigasi pengguna.
