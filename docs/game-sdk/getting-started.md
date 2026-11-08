# Panduan Memulai Cepat (Getting Started)

**NUSANTARA Programming Language — Game Development Kit (v0.47.0)**

---

## 1. Membuat Proyek Game Baru

Gunakan perkakas CLI resmi Nusantara untuk membuat struktur proyek game secara otomatis:

```bash
nusantara game new PetualanganSakti --template=2d
```

Pilihan templat yang didukung:
- `--template=2d`: Proyek game 2D dengan sprite, kamera 2D, dan fisika platformer.
- `--template=3d`: Proyek game 3D dengan kubus, kamera 3D perspektif, dan pencahayaan.
- `--template=ecs`: Proyek berorientasi arsitektur Entity Component System murni.

Struktur folder yang dihasilkan:
```
PetualanganSakti/
├── project.nusantara.toml
├── src/
│   └── utama.nusantara
├── assets/
│   ├── README.md
│   ├── textures/
│   ├── audio/
│   └── scenes/
│       └── adegan_utama.json
└── README.md
```

---

## 2. Menjalankan Game

Masuk ke direktori proyek dan jalankan perintah:

```bash
cd PetualanganSakti
nusantara game run
```

---

## 3. Struktur Kode Sumber Dasar

Contoh berkas `src/utama.nusantara`:

```nusantara
gunakan "std:game";

var app = buatAplikasiGame("Game Keren", 800, 600);
tulis("Game berjalan pada target 60 FPS!");

// Simulasi langkah loop
app.langkah(1 / 60);
```
