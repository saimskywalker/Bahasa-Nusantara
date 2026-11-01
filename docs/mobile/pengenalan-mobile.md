# Pengenalan Nusantara Mobile Framework

Selamat datang di **Nusantara Mobile Application Framework** (Fase 37). Nusantara Mobile adalah framework resmi bahasa pemrograman NUSANTARA yang memungkinkan pengembang membangun aplikasi seluler lintas platform untuk sistem operasi **Android** dan **iOS** dengan antarmuka deklaratif berbahasa Indonesia.

---

## 1. Visi & Filosofi

1. **Bahasa Indonesia sebagai Bahasa Utama**: Semua deklarasi UI, peristiwa (*event*), konfigurasi, dan API perangkat ditulis dengan istilah Bahasa Indonesia yang jelas, elegan, dan baku.
2. **Satu Basis Kode untuk Android & iOS**: Logika bisnis dan antarmuka pengguna didefinisikan satu kali menggunakan ekstensi `.nusantara`, dan dapat dikompilasi atau dijalankan pada target Android, iOS, maupun Simulator Desktop.
3. **Keamanan Bawaan (*Security by Design*)**: Dilengkapi dengan sistem perizinan terperinci (*fine-grained permissions*), mitigasi path traversal pada manajemen aset, serta enkripsi penyimpanan aman menggunakan AES-256-CBC.
4. **Pendekatan Realistis & Transparan**: Tidak membuat binding fiktif atau compiler palsu. Jika lingkungan host tidak memiliki Android SDK atau Xcode lengkap, framework secara cerdas menyediakan simulator desktop berkualitas tinggi untuk preview instan.

---

## 2. Arsitektur Inti

Nusantara Mobile tersusun atas 6 lapisan modular:
- **Mobile Core**: Siklus hidup aplikasi (`StatusLifecycleMobile`), konfigurasi terpusat, pengelola status reaktif (`PengelolaStateMobile`), dan konteks aplikasi runtime.
- **Mobile UI & Layout**: Primitif UI (Teks, Tombol, Input, Sakelar, dsb.) serta mesin tata letak responsif dengan perhitungan Safe Area Insets (takik kamera/poni, bar beranda).
- **Mobile Navigation**: Navigator tumpukan (*stack*), navigasi tab bawah, dan pengelola tautan dalam (*deep linking*).
- **Device APIs**: Abstraksi baterai, jaringan, haptik/getaran, papan klip, geolokasi, notifikasi lokal, dan dialog berbagi.
- **Security & Permissions**: Pengelola izin dinamis dan penyimpanan aman (*secure storage*).
- **Platform Build & CLI**: Generator artefak Android (`AndroidManifest.xml`, `build.gradle`), iOS (`Info.plist`, `Podfile`), dan alat bantu baris perintah `nusantara mobile`.

---

## 3. Contoh Singkat

```nusantara
gunakan "std:mobile" sebagai seluler

fungsi saatKlik(evt : peta) mulai
  tampilkanSnackbar("Halo dari Nusantara Mobile!", 3000)
selesai

program HaloMobile
mulai
  konfig : peta = {
    "nama": "Aplikasi Perdana",
    "id": "id.nusantara.perdana",
    "versi": "1.0.0",
    "nomorBuild": 1
  }

  app : peta = seluler.buatAplikasiMobile(konfig)
  judul : peta = seluler.buatTeks("Selamat Datang!", 22, "tebal")
  tombol : peta = seluler.buatTombol("Sentuh Saya", saatKlik)

  seluler.tambahKomponenMobile(app, judul)
  seluler.tambahKomponenMobile(app, tombol)
  seluler.jalankanAplikasiMobile(app)
selesai
```
