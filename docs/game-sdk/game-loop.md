# Siklus Hidup dan Game Loop (Game Loop & Lifecycle)

**NUSANTARA Programming Language — Game Development Kit (v0.47.0)**

---

## 1. Konsep Akumulator Fixed Timestep

Game loop di Nusantara mengadopsi pendekatan industri standar untuk mencegah artefak fisika seperti *tunneling* atau ketidakkonsistenan tabrakan saat frame rate berfluktuasi:

1. **`onFixedUpdate(fixedDt)`**:
   Dijalankan dengan interval waktu konstan (default `1/60` detik = `16.67ms`) melalui akumulator sisa waktu. Digunakan untuk perhitungan fisika, simulasi gerak, dan deteksi benturan.

2. **`onUpdate(dt)`**:
   Dijalankan satu kali per frame dengan `dt` variabel. Digunakan untuk input pengguna, logika AI, transisi UI, dan pembaruan animasi.

3. **`onRender(alpha)`**:
   Dijalankan satu kali per frame untuk menggambar seluruh grafika ke buffer layar dengan interpolasi faktor `alpha`.

---

## 2. Penggunaan API

```nusantara
gunakan "std:game";

var app = buatAplikasiGame("Siklus Game", 800, 600);

// Menjalankan game secara berkelanjutan
app.mulai();

// Menjeda game (pause)
app.jeda();

// Melanjutkan game (resume)
app.lanjutkan();

// Menghentikan game
app.berhenti();
```
