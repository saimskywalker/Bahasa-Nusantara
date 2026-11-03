# Pemeriksa Versi Semantik (VersionChecker)

Modul `VersionChecker` bertanggung jawab mengurai, memvalidasi, dan membandingkan versi aplikasi sesuai standar **SemVer 2.0.0** (`MAYOR.MINOR.PATCH[-PRERELEASE][+BUILD]`).

## Format Versi yang Didukung
- Standar: `1.2.3`
- Dengan awalan v: `v1.2.3`
- Prerelease: `1.2.3-alpha.1`, `1.2.3-beta.2`
- Build Metadata: `1.2.3+20261103.42`

## Fungsi Utama
- `VersionChecker.uraiSemver(versiStr: string)`: Menghasilkan struktur SemVer terurai `{ major, minor, patch, prerelease, buildMetadata }` atau `null` jika tidak valid.
- `VersionChecker.bandingkan(versi1, versi2)`: Menghasilkan `1` (v1 > v2), `-1` (v1 < v2), atau `0` (v1 == v2).
- `VersionChecker.apakahMemenuhiMinimum(versiTerpasang, versiMinimum)`: Menentukan apakah versi klien memenuhi syarat batas versi minimum server.
- `VersionChecker.periksaKetersediaan(versiLokal, appId, platform, manifest)`: Menghasilkan obyek evaluasi komprehensif `HasilPemeriksaanVersi`.
