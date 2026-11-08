# Entity Component System (ECS)

**NUSANTARA Programming Language — Game Development Kit (v0.47.0)**

---

## 1. Konsep Dasar ECS

Arsitektur ECS memisahkan data murni dari logika:
1. **Entitas (`Entity`)**: Wadah identitas unik tanpa logika atau status bawaan selain daftar komponen yang terpasang.
2. **Komponen (`Component`)**: Struktur data murni yang merepresentasikan atribut entitas (misal: posisi, gambar, tubuh fisika).
3. **Sistem (`System`)**: Fungsi atau kelas yang memproses seluruh entitas yang memiliki kecocokan pola komponen tertentu.
4. **Dunia (`World`)**: Kontainer utama penyimpan entitas, kueri cache, dan pengatur siklus eksekusi sistem.

---

## 2. Kueri Entitas

Dalam ECS Nusantara, kueri dilakukan dengan menyaring entitas yang memiliki kombinasi komponen tertentu secara efisien:

```typescript
const entities = world.query([Transform2D, Sprite]);
for (const e of entities) {
  const transform = e.getComponent(Transform2D)!;
  const sprite = e.getComponent(Sprite)!;
  // render sprite pada posisi transform
}
```
