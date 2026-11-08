# Sistem Input & Pemetaan Aksi (Input & Action Mapping)

**NUSANTARA Programming Language — Game Development Kit (v0.47.0)**

---

## 1. Pemetaan Aksi Abstrak (Action Mapping)

Alih-alih mengikat tombol fisik secara kaku, `InputManager` mendukung pemetaan aksi abstrak:

```typescript
input.petakanAksi('lompat', ['Space', 'KeyW', 'ArrowUp']);
input.petakanAksi('tembak', ['KeyJ', 'Mouse0']);

if (input.apakahAksiDitekan('lompat')) {
  // Karakter melompat
}
```

---

## 2. Simulasi Input Headless

Untuk keperluan pengujian otomatis (*unit tests*), `InputManager` memiliki metode simulasi:
- `simulasikanTekanTombol(kode)`
- `simulasikanLepasTombol(kode)`
- `simulasikanGerakMouse(x, y)`
- `simulasikanTekanMouse(tombol)`
