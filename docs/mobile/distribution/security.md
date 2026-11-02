# Praktik Keamanan & Proteksi Kredensial Distribusi

Distribusi aplikasi mobile melibatkan kunci kriptografi bernilai tinggi yang wajib dilindungi dari kebocoran ke publik atau repositori open-source.

---

## 1. Aturan Emas Keamanan Kunci
1. **Jangan Commit Keystore ke Git**:
   Pastikan pola berikut terdaftar di `.gitignore`:
   ```gitignore
   *.keystore
   *.jks
   *.p12
   *.mobileprovision
   dist/mobile/
   ```
2. **Jangan Simpan Kata Sandi dalam Source Code**:
   Gunakan environment variable atau *Secrets Manager* pada runner CI/CD (GitHub Secrets, GitLab CI Variables).
3. **Backup Kunci Privat Secara Aman**:
   - Simpan salinan berkas keystore rilis di penyimpanan terenkripsi offline (*cold storage*).
   - Catat alias dan kata sandi di pengelola kata sandi terenkripsi (*password manager*).
4. **Prinsip Hak Akses Minimal**:
   Hanya minta izin sistem (*permissions*) yang benar-benar digunakan oleh fitur aplikasi. Google Play dan Apple akan menolak aplikasi yang meminta izin berlebihan tanpa justifikasi rasional.
5. **Enkripsi Komunikasi Backend (TLS)**:
   Selalu tegakkan HTTPS pada seluruh permintaan jaringan di lingkungan produksi.
