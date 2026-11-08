# Sistem Animasi Sprite (Sprite Animation System)

**NUSANTARA Programming Language — Game Development Kit (v0.47.0)**

---

## 1. Konsep Utama

Sistem animasi sprite Nusantara mencakup:
- **`AnimationFrame`**: Mewakili satu frame sprite sheet dengan koordinat `u`, `v`, `width`, `height`, dan `duration`.
- **`AnimationClip`**: Rangkaian frame berurutan dengan opsi perulangan (`loop`).
- **`SpriteAnimationController`**: Pengontrol pemutaran animasi (putar, jeda, beralih klip, dan callback saat selesai).
- **Pemotong Spritesheet Otomatis**: Utilitas `createFromSpritesheet` untuk membagi gambar besar ke dalam deretan frame animasi berdasarkan ukuran petak.
