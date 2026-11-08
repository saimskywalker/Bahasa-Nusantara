# Manajemen Aset & Keamanan (Asset Management & Security)

**NUSANTARA Programming Language — Game Development Kit (v0.47.0)**

---

## 1. Perlindungan Anti Path-Traversal

`AssetManager` menerapkan filter keamanan ketat terhadap serangan *directory traversal*:
- Seluruh jalur diperiksa: kemunculan `../`, `/..`, atau referensi `..` langsung akan memicu galat keamanan fatal.
- Ekstensi berkas divalidasi terhadap daftar putih (*whitelist*) tipe aset terkait.

---

## 2. Format yang Didukung

- **Tekstur**: `.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`
- **Audio**: `.wav`, `.mp3`, `.ogg`, `.flac`, `.aac`
- **Model 3D / Mesh**: `.obj`, `.gltf`, `.glb`
- **Konfigurasi Level**: `.json`
- **Naskah**: `.txt`, `.nusantara`
