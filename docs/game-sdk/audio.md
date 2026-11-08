# Mesin Audio (Audio Engine)

**NUSANTARA Programming Language — Game Development Kit (v0.47.0)**

---

## 1. Arsitektur Kategori Volume

`AudioManager` mengorganisir pemutaran suara ke dalam 3 kategori volume hierarkis:
1. **Master Volume**: Mengontrol volume keseluruhan aplikasi.
2. **Music Volume**: Mengontrol pemutaran musik latar (`BGM`).
3. **SFX Volume**: Mengontrol efek suara benturan, tembakan, atau interaksi UI.

---

## 2. Fitur Audio

- Pendaftaran klip (`registerClip`).
- Pemutaran berulang (`loop`).
- Jeda (`pause`), lanjutkan (`resume`), dan hentikan (`stop`).
- Fallback otomatis ke mock driver saat dieksekusi di lingkungan headless tanpa crash.
