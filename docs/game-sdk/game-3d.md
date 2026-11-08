# Pengembangan Game 3D (3D Game Development)

**NUSANTARA Programming Language — Game Development Kit (v0.47.0)**

---

## 1. Primitif dan Matematika 3D

Nusantara Game SDK menyediakan primitif matematika dan geometri 3D:
- **`Vector3`**: Vektor 3 dimensi untuk koordinat spasial (X, Y, Z), perhitungan dot product, cross product, dan magnitudo.
- **`Camera3D`**: Kamera 3D berbasis proyeksi perspektif atau ortografis dengan kontrol `fov` (Field of View), aspek rasio, dan vektor `target`.
- **`Mesh`**: Struktur data geometri dengan *vertex buffer*, indeks segitiga, normal, dan koordinat UV.
- **`Material`**: Parameter shading permukaan (diffuse, specular, shininess).

---

## 2. Contoh Penggunaan

```nusantara
gunakan "std:game";

var cam = kamera3D();
tulis("FOV Kamera 3D: " + teks(cam.fov));

var kubusPos = vektor3(0, 0, -10);
tulis("Posisi kubus: Z=" + teks(kubusPos.z));
```
