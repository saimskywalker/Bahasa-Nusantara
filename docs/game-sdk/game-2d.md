# Pengembangan Game 2D (2D Game Development)

**NUSANTARA Programming Language — Game Development Kit (v0.47.0)**

---

## 1. Komponen Dasar Game 2D

Pengembangan game 2D di Nusantara memanfaatkan komponen terpadu:
- **`Transform2D`**: Menyimpan koordinat `x`, `y`, rotasi (`rotation`), serta skala (`scaleX`, `scaleY`).
- **`Sprite`**: Menyimpan referensi tekstur, dimensi `width` dan `height`, serta modulasi warna.
- **`Camera2D`**: Kamera 2D fleksibel dengan dukungan *zoom*, panning, *follow target*, dan *viewport clamping*.
- **`RigidBody2D` & `BoxCollider2D`**: Komponen fisika untuk platformer dan permainan aksi 2D.

---

## 2. Contoh Pembuatan Objek 2D

```nusantara
gunakan "std:game";

var app = buatAplikasiGame("Demo 2D", 800, 600);
var posisi = vektor2(400, 300);
var batas = kotak(posisi.x, posisi.y, 32, 32);

tulis("Pemain berada pada kotak: " + teks(batas.x) + ", " + teks(batas.y));
```
