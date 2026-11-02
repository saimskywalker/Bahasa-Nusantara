# Pengelolaan Versi Aplikasi (Version Management)

Nusantara Mobile menerapkan standar versioning ketat yang memadukan Semantic Versioning (SemVer) dengan ketentuan teknis platform Android dan Apple iOS.

---

## 1. Tiga Dimensi Versi
1. **Versi Semantik (SemVer)**:
   - Format: `MAYOR.MINOR.PATCH` (contoh: `1.0.0`, `1.2.3`).
   - `MAYOR`: Perubahan arsitektur besar atau pemecah kompatibilitas (*breaking changes*).
   - `MINOR`: Penambahan fitur baru yang tetap kompatibel.
   - `PATCH`: Perbaikan bug dan optimasi performa.
2. **Android Version Code (`versionCode`)**:
   - Bilangan bulat positif monoton naik (contoh: `1`, `2`, `3`, ...).
   - Google Play mewajibkan setiap pembaruan APK/AAB memiliki `versionCode` lebih tinggi dari versi sebelumnya.
3. **iOS Build Number (`CFBundleVersion`)**:
   - Bilangan bulat positif yang bertambah pada setiap kompilasi archive ke TestFlight / App Store.

---

## 2. Saluran Rilis (Release Channels)
Nusantara Mobile membedakan saluran distribusi aplikasi:
- `debug`: Untuk pengujian lokal dan dev server.
- `internal`: Ditandai dengan `-alpha.1` untuk penguji internal tim.
- `beta`: Ditandai dengan `-beta.1` untuk uji terbuka atau TestFlight beta.
- `produksi`: Rilis stabil tanpa label prerilis untuk toko aplikasi publik.

---

## 3. Perintah CLI Pengelolaan Versi
```bash
# Menampilkan informasi versi saat ini
nusantara mobile distribusi versi tampil

# Menaikkan versi patch (misal: 1.0.0 -> 1.0.1)
nusantara mobile distribusi versi naikkan patch

# Menaikkan versi minor (misal: 1.0.1 -> 1.1.0)
nusantara mobile distribusi versi naikkan minor

# Menaikkan versi mayor (misal: 1.1.0 -> 2.0.0)
nusantara mobile distribusi versi naikkan mayor
```
Kenaikan versi akan otomatis memperbarui nilai pada `nusantara.mobile.json` dan menaikkan `versionCode` serta `buildNumber`.
