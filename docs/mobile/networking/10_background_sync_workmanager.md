# Penjadwalan Tugas Latar Belakang: WorkManager & BackgroundTasks

## 1. Integrasi API Platform Resmi

Untuk menjalankan sinkronisasi data atau pengunduhan konten saat pengguna tidak sedang membuka aplikasi, platform Android dan iOS mewajibkan penggunaan penjadwal resmi:
- **Android:** `androidx.work.WorkManager`
  - Mendukung *Constraints*: `NetworkType.CONNECTED`, `NetworkType.UNMETERED`, `requiresBatteryNotLow(true)`, `requiresCharging(true)`.
  - Menjamin eksekusi tugas meskipun perangkat di-restart (*persistent work*).
- **iOS:** `BGTaskScheduler` (`BGAppRefreshTask` & `BGProcessingTask`)
  - Dijadwalkan oleh sistem operasi secara cerdas berdasarkan pola penggunaan baterai dan kebiasaan pengguna.

---

## 2. Definisi Batasan Tugas (*Task Constraints*)

Dalam Nusantara Mobile, tugas latar belakang didaftarkan dengan batasan yang eksplisit:
```typescript
PengelolaTugasBackgroundMobile.dapatkanInstance().daftarkanTugas(
  'sync_catatan_berkala',
  'Sinkronisasi Catatan Latar Belakang',
  async () => {
    const res = await MesinSinkronisasiMobile.dapatkanInstance().sinkronkan();
    return res.sukses;
  },
  {
    memerlukanJaringan: true,
    memerlukanWifi: false,
    memerlukanBateraiCukup: true,
  },
  15 // Interval menit
);
```
Dengan batasan ini, aplikasi Nusantara Mobile dijamin tidak akan menguras baterai atau menggunakan kuota seluler mahal saat pengguna sedang kehabisan daya.
