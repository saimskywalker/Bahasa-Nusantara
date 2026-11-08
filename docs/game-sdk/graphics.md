# Mesin Grafika & Renderer (Graphics Engine)

**NUSANTARA Programming Language — Game Development Kit (v0.47.0)**

---

## 1. Antarmuka `IRenderer`

Mesin grafika Nusantara dirancang secara abstrak melalui antarmuka `IRenderer`:
- `clear(color)`: Mengosongkan buffer tampilan dengan warna latar.
- `drawRect(x, y, w, h, color)`: Menggambar persegi panjang berwarna.
- `drawCircle(x, y, radius, color)`: Menggambar lingkaran.
- `drawLine(x1, y1, x2, y2, color, lineWidth)`: Menggambar garis lurus.
- `drawText(text, x, y, color, font)`: Menggambar teks antarmuka.
- `drawSprite(texture, x, y, w, h, rotation)`: Menggambar sprite bertekstur.
- `flush()`: Mengeksekusi seluruh antrean perintah render (*render command buffer*).

---

## 2. Implementasi Virtual Rasterizer

Ketika dijalankan di luar browser (misalnya pada server multiplayer, CLI testing, atau CI/CD), `Canvas2DRenderer` secara transparan mengaktifkan rasterizer virtual berbasis memori yang menghitung jumlah *draw calls*, segitiga, dan verifikasi geometris tanpa menimbulkan error modul eksternal.
