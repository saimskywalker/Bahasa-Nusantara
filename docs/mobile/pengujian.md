# Pengujian Aplikasi Mobile (Mobile Testing & Simulation)

Nusantara Mobile menyediakan lingkungan pengujian unit, pengujian komponen, integrasi simulator, dan penegasan otomatis.

---

## 1. Menjalankan Suite Pengujian Otomatis

Untuk menjalankan suite pengujian resmi framework mobile:

```bash
# Menjalankan pengujian khusus Fase 37
npm run test:mobile-v37

# Menjalankan seluruh rangkaian tes regresi proyek NUSANTARA
npm test
```

---

## 2. Desktop Preview Simulator

Untuk menguji perilaku antarmuka, navigasi, dan aliran pengguna secara instan tanpa perlu menjalankan emulator berat:

```bash
nusantara mobile jalankan desktop
```
Simulator ini secara otomatis menerapkan:
- Dimensi layar standar ponsel (390 x 844 piksel)
- Orientasi potret dan lanskap
- Penanganan safe area insets (takik kamera dan gestur)
- Emulasi status jaringan dan sensor baterai

---

## 3. Menulis Pengujian untuk Komponen Mobile

Contoh pengujian unit untuk logika komponen:

```typescript
import { AplikasiMobile, TeksMobile, TombolMobile } from '../src/mobile';

const app = new AplikasiMobile({
  nama: 'Uji App',
  id: 'id.nusantara.uji',
  versi: '1.0.0',
  nomorBuild: 1,
});

const teks = new TeksMobile({ teks: 'Halo' });
app.tambahKomponenAkar(teks);

console.assert(app.dapatkanKomponenAkar().length === 1);
```
