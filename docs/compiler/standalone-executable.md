# Pembuatan & Pengemasan Executable Mandiri NUSANTARA (Phase 45)

Dokumen ini menjelaskan spesifikasi pembuatan berkas biner executable mandiri (*standalone executable*) dan pengemasan bundel aplikasi distribusi untuk bahasa pemrograman NUSANTARA v0.45.0.

---

## 1. Komponen Standalone Executable

Biner mandiri Nusantara dibangun melalui `ExecutableBuilder` yang menggabungkan:
1. **Kode Mesin Objek**: Hasil kompilasi AOT dari kode sumber `.nusantara`.
2. **Runtime C Embedded**: Pengelola memori dasar (alokator, string pool), runtime I/O Nusantara, dan penanganan galat.
3. **Entry Point Wrapper**: Inisialisasi lingkungan proses yang memanggil fungsi `@utama` (`main`).
4. **Pustaka Terikat (Bundled Libraries)**: Pustaka pihak ketiga atau modul standar yang di-link secara statis maupun disiapkan dalam bundel portabel.

---

## 2. Mode Distribusi Runtime

Runtime packager (`RuntimePackager`) mendukung tiga profil embedding:

| Mode | Deskripsi | Ukuran Biner | Kasus Penggunaan |
| :--- | :--- | :--- | :--- |
| `BUNDLED` | Menyertakan alokator memori, string engine, dan runtime penuh | ~150KB - 500KB | Aplikasi mandiri tanpa dependensi luar |
| `MINIMAL` | Hanya menyertakan inisialisasi minimal dan libc binding | ~30KB - 80KB | Embedded systems / container mikro |
| `SHARED` | Memanfaatkan runtime dinamis bersama (`libnusantara.so`) | ~10KB - 25KB | Multi-aplikasi dengan shared runtime |

---

## 3. Struktur Bundel Aplikasi Mandiri

Perintah `nusantara package` menghasilkan direktori distribusi atau arsip tarball (`.tar.gz` / `.zip`) dengan struktur standar berikut:

```
dist/aplikasi/
├── bin/
│   └── aplikasi               # Berkas biner executable native
├── lib/
│   ├── libnusantara.so        # Pustaka bersama (jika mode shared)
│   └── libeksternal.so        # Dependensi pustaka tambahan
├── config/
│   └── nusantara.toml         # Konfigurasi aplikasi saat runtime
├── resources/
│   └── aset.bin               # Aset statis aplikasi
├── manifest.json              # Metadata bundel dan hash SHA-256
├── LISENSI.txt                # Lisensi perangkat lunak
└── BACA-SAYA.txt              # Petunjuk eksekusi dan informasi versi
```

### 3.1 Berkas Manifest (`manifest.json`)
Setiap paket menyertakan manifes kriptografis:
```json
{
  "name": "aplikasi-nusantara",
  "version": "1.0.0",
  "target": "x86_64-unknown-linux-gnu",
  "entrypoint": "bin/aplikasi",
  "files": [
    {
      "path": "bin/aplikasi",
      "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "size": 245760
    }
  ],
  "createdAt": "2026-11-05T00:00:00.000Z"
}
```

---

## 4. Inspeksi Format Biner Bawaan (`BinaryInspector`)

Sistem menyediakan inspeksi biner independen tanpa memerlukan utilitas eksternal seperti `readelf` atau `objdump`:
- **ELF**: Memeriksa Magic Bytes (`\x7fELF`), Kelas (32/64-bit), Endianness, OS ABI, Target Machine (x86_64/AArch64), dan Tipe Objek (EXEC, DYN, REL).
- **PE/COFF**: Memeriksa Magic DOS Header (`MZ`), PE signature offset, dan arsitektur mesin Windows.
- **Mach-O**: Memeriksa Magic `0xFEEDFACE` / `0xFEEDFACF` untuk format macOS/iOS.

---

## 5. Penggunaan CLI

```bash
# Kompilasi langsung kode sumber menjadi executable mandiri
nusantara build program.nusantara -o program --standalone

# Mengemas executable menjadi bundel distribusi lengkap
nusantara package -b program -o dist/app-bundle --archive

# Memeriksa metadata dan arsitektur biner biner
nusantara inspect program
```
