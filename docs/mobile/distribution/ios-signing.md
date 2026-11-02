# Apple Code Signing & Provisioning Profiles

Apple memberlakukan kebijakan penandatanganan kode yang sangat ketat untuk memastikan seluruh biner yang dieksekusi di perangkat iPhone/iPad berasal dari sumber terverifikasi.

---

## 1. Komponen Utama Apple Signing
1. **Signing Certificate**:
   - *Apple Development Certificate*: Untuk pengujian pada perangkat terdaftar.
   - *Apple Distribution Certificate*: Untuk rilis publik ke TestFlight dan App Store.
2. **Apple Worldwide Developer Relations (WWDR) Certificate**:
   - Sertifikat perantara (*intermediate CA*) dari Apple yang harus terpasang di Keychain macOS.
3. **Provisioning Profile (`.mobileprovision`)**:
   - Mengaitkan App ID, sertifikat penandatangan, perangkat yang diizinkan (pada ad-hoc/development), dan kapabilitas khusus (*entitlements*).

---

## 2. Format Bundle Identifier
Apple mewajibkan format reverse-domain name system, contoh:
- `id.nusantara.aplikasi`
- `com.perusahaan.toko`

Karakter yang diizinkan adalah alfanumerik (`a-z`, `A-Z`, `0-9`) dan tanda minus (`-`).

---

## 3. Validasi Signing iOS via CLI
```bash
nusantara mobile distribusi ios validasi
```
Memeriksa apakah konfigurasi identitas penandatanganan, Team ID, dan profil provisioning telah sesuai dengan standar distribusi App Store.
