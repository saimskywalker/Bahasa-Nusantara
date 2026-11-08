# Arsitektur Nusantara Game Development Kit (Game SDK)

**NUSANTARA Programming Language — Phase 47 (v0.47.0)**

Nusantara Game Development Kit (Game SDK) dirancang dengan arsitektur berlapis (*layered architecture*) yang modular, deterministik, dan berkinerja tinggi. Game SDK dapat dijalankan baik di lingkungan browser modern (menggunakan elemen `<canvas>` HTML5 dan Web Audio API) maupun di lingkungan headless (CLI, server, dan suite pengujian otomatis melalui virtual command buffer dan rasterizer berbasis memori).

---

## 1. Diagram Lapisan Arsitektur

```
+-----------------------------------------------------------------------+
|                    APLIKASI GAME NUSANTARA (.nusantara)              |
+-----------------------------------------------------------------------+
|        Standar Library: std:game (permainan, engine, GameApp)        |
+-----------------------------------+-----------------------------------+
|     Sistem Adegan & UI (Scene,    |  Partikel, Animasi, & Audio       |
|     SceneManager, GameUI, Panel)  |  (SpriteAnimation, Particle2D)   |
+-----------------------------------+-----------------------------------+
|               ECS (Entity Component System) & Dunia                  |
|        (Entity, Component, World, Query Cache, System Runner)        |
+-----------------+-----------------+-----------------+-----------------+
|  Mesin Fisika   |  Sistem Input   |  Manajer Aset   |  Jaringan &     |
|  2D (RigidBody, |  (Keyboard,     |  (Cache, Anti-  |  Simpanan       |
|  AABB, Impulse) |  Mouse, Action) |  Traversal)     |  (SaveManager)  |
+-----------------+-----------------+-----------------+-----------------+
|                    Mesin Grafika & Renderer Terpadu                  |
|     (IRenderer, Canvas2DRenderer Virtual/DOM, Camera2D, Camera3D)     |
+-----------------------------------------------------------------------+
|                   Mesin Inti (Core Engine Loop)                       |
|     (GameLoop dengan Fixed Timestep Accumulator, Time, EventBus)      |
+-----------------------------------------------------------------------+
|           Lingkungan Eksekusi: Browser DOM / Headless Node.js        |
+-----------------------------------------------------------------------+
```

---

## 2. Prinsip Desain Utama

1. **Dual-Environment (Browser & Headless):**
   Setiap modul dalam Game SDK dirancang agar tidak pernah crash jika objek browser global seperti `window`, `document`, atau `AudioContext` tidak tersedia. Ketika dijalankan di CLI atau lingkungan server, subsistem grafika menggunakan *virtual rasterizer & command buffer* dan subsistem audio menggunakan driver simulasi berbasis memori.

2. **Pemisahan Update Logika dan Fisika (Fixed Timestep Accumulator):**
   Game SDK menggunakan pola akumulator waktu (`accumulator`) dengan interval waktu tetap (default `1/60` detik). Ini menjamin simulasi fisika bersifat deterministik tanpa memandang variasi frame rate render.

3. **Arsitektur ECS Berorientasi Cache:**
   Entitas direpresentasikan sebagai ID integer/string ringan, sedangkan komponen disimpan dalam struktur *sparse-set* terindeks untuk pemrosesan kueri super cepat.

4. **Keamanan Tanpa Kompromi:**
   Sistem pemuatan aset dilengkapi pelindung *anti path-traversal* yang menolak karakter `..` atau akses di luar batas direktori aset yang diizinkan. Sistem simpanan (save system) diverifikasi dengan checksum kriptografis untuk mencegah kecurangan atau korupsi berkas.
