# Registri Penyedia Multi-Cloud (Cloud Provider Registry)

## 1. Arsitektur Multi-Cloud Nusantara Mobile

`RegistriPenyediaCloud` memungkinkan pengembang memilih atau menukar infrastruktur backend tanpa harus merombak kode aplikasi front-end. 

Penyedia yang terdaftar secara resmi:
1. **`mock_local` (Bawaan):**
   - Layanan: `auth`, `storage`, `database`, `notification`, `realtime`.
   - Menggunakan penyimpanan memori terisolasi. Sangat ideal untuk unit testing, CI/CD pipeline, dan simulasi offline desktop.
2. **`supabase`:**
   - Layanan: `auth`, `storage`, `database`, `realtime`.
   - Menghubungkan ke PostgreSQL via PostgREST, GoTrue Auth (PKCE), Supabase Storage, dan Realtime Channels.
3. **`firebase`:**
   - Layanan: `auth`, `storage`, `database`, `notification`.
   - Menghubungkan ke Firebase Auth REST, Cloud Firestore REST, Firebase Storage REST, dan FCM.
4. **`rest_kustom`:**
   - Layanan: `auth`, `storage`, `database`.
   - Menghubungkan ke backend mandiri yang dibangun menggunakan Web Framework (Phase 30) dan ORM (Phase 32) bahasa NUSANTARA.

---

## 2. Pergantian Penyedia melalui CLI

Pengembang dapat melihat status penyedia terdaftar melalui perintah:
```bash
nusantara mobile cloud info
```
Dan mengonfigurasi lingkungan:
```bash
nusantara mobile cloud konfigurasi pengembangan
nusantara mobile cloud konfigurasi produksi https://api.nusantara.id
```
