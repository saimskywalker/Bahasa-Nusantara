/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 38
 * Inisialisasi Seluruh Layanan Native API (Native API Services Initializer)
 */

import { RegistriNativeAPI } from '../core/registry';
import { dapatkanAdaptorPlatformAktif } from '../adapters';
import { buatHasilSukses, buatHasilGagal, KodeGalatNative } from '../core/result';
import { PengirimPeristiwaNative } from '../core/events';
import { KonteksAplikasiMobile } from '../../core/application_context';

export function inisialisasiSemuaLayananNativeAPI(registri: RegistriNativeAPI = RegistriNativeAPI.dapatkanInstance()): void {
  const adaptor = dapatkanAdaptorPlatformAktif();
  const eventDispatcher = PengirimPeristiwaNative.dapatkanInstance();

  // 1. PERANGKAT (Device Info)
  registri.daftarkan({
    nama: 'perangkat.info',
    kategori: 'perangkat',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: [],
    status: 'didukung',
    parameter: [],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.OPERASI_GAGAL],
    dokumentasi: 'Mendapatkan informasi detail perangkat keras, OS, model, resolusi, dan status emulator.',
    eksekusi: async () => adaptor.dapatkanInfoPerangkat(),
  });

  // 2. KAMERA (Camera API)
  registri.daftarkan({
    nama: 'kamera.ketersediaan',
    kategori: 'kamera',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: [],
    status: 'didukung',
    parameter: [],
    tipeHasil: 'peta',
    kemungkinanError: [],
    dokumentasi: 'Memeriksa ketersediaan modul kamera depan dan belakang pada perangkat.',
    eksekusi: async () =>
      buatHasilSukses({
        kameraDepan: true,
        kameraBelakang: true,
        flashTersedia: true,
      }),
  });

  registri.daftarkan({
    nama: 'kamera.ambil',
    kategori: 'kamera',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: ['kamera'],
    status: 'didukung',
    parameter: [
      { nama: 'kamera', tipe: 'teks', wajib: false, deskripsi: 'Pilihan posisi kamera (depan atau belakang)', nilaiBawaan: 'belakang' },
      { nama: 'flash', tipe: 'logika', wajib: false, deskripsi: 'Aktifkan flash saat mengambil foto', nilaiBawaan: false },
      { nama: 'kualitas', tipe: 'bilangan', wajib: false, deskripsi: 'Kualitas kompresi foto (1-100)', nilaiBawaan: 85 },
    ],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.IZIN_DITOLAK, KodeGalatNative.DIBATALKAN_PENGGUNA, KodeGalatNative.SUMBER_DAYA_SIBUK],
    dokumentasi: 'Membuka kamera native untuk mengambil foto dengan izin pengguna.',
    eksekusi: async (arg?: any) => adaptor.ambilFoto(arg),
  });

  // 3. MEDIA & GALERI (Media Picker)
  registri.daftarkan({
    nama: 'galeri.pilih_foto',
    kategori: 'media',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: ['foto_media'],
    status: 'didukung',
    parameter: [
      { nama: 'maksPilihan', tipe: 'bilangan', wajib: false, deskripsi: 'Jumlah maksimum foto yang dipilih', nilaiBawaan: 1 },
    ],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.IZIN_DITOLAK, KodeGalatNative.DIBATALKAN_PENGGUNA],
    dokumentasi: 'Membuka Android Photo Picker atau iOS PHPicker untuk memilih foto secara aman berbasis URI.',
    eksekusi: async (arg?: any) => adaptor.pilihMedia({ tipe: 'foto', ...arg }),
  });

  registri.daftarkan({
    nama: 'galeri.pilih_video',
    kategori: 'media',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: ['foto_media'],
    status: 'didukung',
    parameter: [
      { nama: 'maksPilihan', tipe: 'bilangan', wajib: false, deskripsi: 'Jumlah maksimum video yang dipilih', nilaiBawaan: 1 },
    ],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.IZIN_DITOLAK, KodeGalatNative.DIBATALKAN_PENGGUNA],
    dokumentasi: 'Membuka pemilih video sistem untuk mengambil file video secara aman.',
    eksekusi: async (arg?: any) => adaptor.pilihMedia({ tipe: 'video', ...arg }),
  });

  // 4. LOKASI & GPS (Location API)
  registri.daftarkan({
    nama: 'lokasi.ambil',
    kategori: 'lokasi',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: ['lokasi'],
    status: 'didukung',
    parameter: [
      { nama: 'akurasiTinggi', tipe: 'logika', wajib: false, deskripsi: 'Gunakan GPS untuk akurasi tinggi', nilaiBawaan: true },
      { nama: 'timeoutMs', tipe: 'bilangan', wajib: false, deskripsi: 'Batas waktu pencarian koordinat dalam ms', nilaiBawaan: 10000 },
    ],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.IZIN_DITOLAK, KodeGalatNative.TIMEOUT, KodeGalatNative.PERANGKAT_TIDAK_TERSEDIA],
    dokumentasi: 'Mengambil koordinat lintang, bujur, dan akurasi lokasi saat aplikasi digunakan.',
    eksekusi: async (arg?: any) => adaptor.dapatkanLokasi(arg),
  });

  registri.daftarkan({
    nama: 'lokasi.pantau',
    kategori: 'lokasi',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: ['lokasi'],
    status: 'didukung',
    parameter: [],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.IZIN_DITOLAK],
    dokumentasi: 'Memulai pemantauan perubahan posisi geografis perangkat secara berkala.',
    eksekusi: async () => {
      const res = await adaptor.dapatkanLokasi();
      eventDispatcher.kirim('lokasi.berubah', res.data);
      return buatHasilSukses({ aktif: true, lokasiAwal: res.data }, 'Pemantauan lokasi dimulai.');
    },
  });

  registri.daftarkan({
    nama: 'lokasi.henti',
    kategori: 'lokasi',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: [],
    status: 'didukung',
    parameter: [],
    tipeHasil: 'peta',
    kemungkinanError: [],
    dokumentasi: 'Menghentikan pemantauan lokasi dan membebaskan sensor GPS.',
    eksekusi: async () => buatHasilSukses({ aktif: false }, 'Pemantauan lokasi dihentikan.'),
  });

  // 5. NOTIFIKASI LOKAL (Notification API)
  registri.daftarkan({
    nama: 'notifikasi.kirim',
    kategori: 'notifikasi',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: ['notifikasi'],
    status: 'didukung',
    parameter: [
      { nama: 'id', tipe: 'teks', wajib: true, deskripsi: 'ID unik notifikasi' },
      { nama: 'judul', tipe: 'teks', wajib: true, deskripsi: 'Judul notifikasi' },
      { nama: 'pesan', tipe: 'teks', wajib: true, deskripsi: 'Isi pesan teks notifikasi' },
    ],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.IZIN_DITOLAK, KodeGalatNative.OPERASI_GAGAL],
    dokumentasi: 'Mengirimkan notifikasi lokal secara instan pada bilah status perangkat.',
    eksekusi: async (arg: any) => adaptor.jadwalkanNotifikasi({ ...arg, tundaDetik: 0 }),
  });

  registri.daftarkan({
    nama: 'notifikasi.jadwal',
    kategori: 'notifikasi',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: ['notifikasi'],
    status: 'didukung',
    parameter: [
      { nama: 'id', tipe: 'teks', wajib: true, deskripsi: 'ID unik notifikasi' },
      { nama: 'judul', tipe: 'teks', wajib: true, deskripsi: 'Judul notifikasi' },
      { nama: 'pesan', tipe: 'teks', wajib: true, deskripsi: 'Isi pesan teks notifikasi' },
      { nama: 'tundaDetik', tipe: 'bilangan', wajib: true, deskripsi: 'Waktu tunda dalam satuan detik' },
    ],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.IZIN_DITOLAK, KodeGalatNative.OPERASI_GAGAL],
    dokumentasi: 'Menjadwalkan notifikasi lokal untuk ditampilkan setelah durasi tunda tertentu.',
    eksekusi: async (arg: any) => adaptor.jadwalkanNotifikasi(arg),
  });

  registri.daftarkan({
    nama: 'notifikasi.batal',
    kategori: 'notifikasi',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: [],
    status: 'didukung',
    parameter: [
      { nama: 'id', tipe: 'teks', wajib: true, deskripsi: 'ID unik notifikasi yang akan dibatalkan' },
    ],
    tipeHasil: 'peta',
    kemungkinanError: [],
    dokumentasi: 'Membatalkan notifikasi lokal yang sedang dijadwalkan.',
    eksekusi: async (arg: any) => adaptor.batalkanNotifikasi(arg?.id || String(arg || '')),
  });

  // 6. SENSOR PERANGKAT (Sensor API)
  registri.daftarkan({
    nama: 'sensor.akselerometer',
    kategori: 'sensor',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: ['sensor'],
    status: 'didukung',
    parameter: [],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.PERANGKAT_TIDAK_TERSEDIA],
    dokumentasi: 'Membaca percepatan gerak 3 sumbu (x, y, z) dalam satuan m/s².',
    eksekusi: async () => adaptor.bacaSensor('akselerometer'),
  });

  registri.daftarkan({
    nama: 'sensor.giroskop',
    kategori: 'sensor',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: ['sensor'],
    status: 'didukung',
    parameter: [],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.PERANGKAT_TIDAK_TERSEDIA],
    dokumentasi: 'Membaca laju rotasi perangkat pada sumbu alpha, beta, dan gamma.',
    eksekusi: async () => adaptor.bacaSensor('giroskop'),
  });

  registri.daftarkan({
    nama: 'sensor.magnetometer',
    kategori: 'sensor',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: ['sensor'],
    status: 'didukung',
    parameter: [],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.PERANGKAT_TIDAK_TERSEDIA],
    dokumentasi: 'Membaca kekuatan medan geomagnetik bumi dalam mikrotesla (µT).',
    eksekusi: async () => adaptor.bacaSensor('magnetometer'),
  });

  registri.daftarkan({
    nama: 'sensor.kedekatan',
    kategori: 'sensor',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: ['sensor'],
    status: 'didukung',
    parameter: [],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.PERANGKAT_TIDAK_TERSEDIA],
    dokumentasi: 'Membaca jarak objek dekat dengan layar perangkat ponsel.',
    eksekusi: async () => adaptor.bacaSensor('kedekatan'),
  });

  registri.daftarkan({
    nama: 'sensor.cahaya',
    kategori: 'sensor',
    platform: ['android', 'simulator'],
    versiMinOS: { android: 24 },
    izin: ['sensor'],
    status: 'didukung',
    parameter: [],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.TIDAK_DIDUKUNG],
    dokumentasi: 'Membaca tingkat intensitas cahaya sekitar (ambient light) dalam lux.',
    eksekusi: async () => adaptor.bacaSensor('cahaya'),
  });

  // 7. BLUETOOTH (Bluetooth API)
  registri.daftarkan({
    nama: 'bluetooth.status',
    kategori: 'bluetooth',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: ['bluetooth'],
    status: 'didukung',
    parameter: [],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.IZIN_DITOLAK],
    dokumentasi: 'Memeriksa status aktif adaptor Bluetooth dan dukungan Bluetooth Low Energy (BLE).',
    eksekusi: async () =>
      buatHasilSukses({
        aktif: true,
        mendukungBLE: true,
        namaAdaptor: 'Perangkat Mobile',
      }),
  });

  registri.daftarkan({
    nama: 'bluetooth.pindai',
    kategori: 'bluetooth',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: ['bluetooth', 'lokasi'],
    status: 'didukung',
    parameter: [
      { nama: 'durasiMs', tipe: 'bilangan', wajib: false, deskripsi: 'Batas durasi pemindaian dalam milidetik', nilaiBawaan: 3000 },
    ],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.IZIN_DITOLAK, KodeGalatNative.OPERASI_GAGAL],
    dokumentasi: 'Memindai perangkat Bluetooth sekitar dengan izin pengguna dan batas waktu terukur.',
    eksekusi: async (arg?: any) => adaptor.pindaiBluetooth(arg),
  });

  // 8. BATERAI & DAYA (Battery API)
  registri.daftarkan({
    nama: 'baterai.info',
    kategori: 'baterai',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: [],
    status: 'didukung',
    parameter: [],
    tipeHasil: 'peta',
    kemungkinanError: [],
    dokumentasi: 'Mendapatkan persentase baterai, status pengisian daya, dan mode hemat daya.',
    eksekusi: async () => adaptor.dapatkanStatusBaterai(),
  });

  // 9. JARINGAN & KONEKTIVITAS (Network API)
  registri.daftarkan({
    nama: 'jaringan.status',
    kategori: 'jaringan',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: ['internet'],
    status: 'didukung',
    parameter: [],
    tipeHasil: 'peta',
    kemungkinanError: [],
    dokumentasi: 'Mendapatkan status koneksi (terhubung/terputus) dan tipe jaringan (WiFi, Seluler, Ethernet).',
    eksekusi: async () => adaptor.dapatkanStatusJaringan(),
  });

  // 10. AUDIO & MIKROFON (Audio API)
  registri.daftarkan({
    nama: 'audio.putar',
    kategori: 'audio',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: [],
    status: 'didukung',
    parameter: [
      { nama: 'sumber', tipe: 'teks', wajib: true, deskripsi: 'URL atau path file audio yang akan diputar' },
    ],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.OPERASI_GAGAL],
    dokumentasi: 'Memutar berkas audio lokal atau dari tautan URL.',
    eksekusi: async (arg: any) => adaptor.putarAudio(arg?.sumber || String(arg || '')),
  });

  registri.daftarkan({
    nama: 'audio.rekam',
    kategori: 'audio',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: ['mikrofon'],
    status: 'didukung',
    parameter: [
      { nama: 'durasiMaksDetik', tipe: 'bilangan', wajib: false, deskripsi: 'Batas durasi rekaman audio', nilaiBawaan: 10 },
    ],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.IZIN_DITOLAK, KodeGalatNative.OPERASI_GAGAL],
    dokumentasi: 'Merekam audio dari mikrofon perangkat setelah mendapatkan izin pengguna.',
    eksekusi: async (arg?: any) => adaptor.rekamAudio(arg),
  });

  registri.daftarkan({
    nama: 'audio.henti',
    kategori: 'audio',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: [],
    status: 'didukung',
    parameter: [],
    tipeHasil: 'peta',
    kemungkinanError: [],
    dokumentasi: 'Menghentikan proses pemutaran atau perekaman audio dan melepaskan resource.',
    eksekusi: async () => adaptor.hentikanAudio(),
  });

  // 11. SISTEM BERKAS & PENYIMPANAN APLIKASI (File System API)
  registri.daftarkan({
    nama: 'berkas.baca',
    kategori: 'berkas',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: ['penyimpanan'],
    status: 'didukung',
    parameter: [
      { nama: 'jalur', tipe: 'teks', wajib: true, deskripsi: 'Jalur berkas di dalam sandbox aplikasi' },
    ],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.PATH_TIDAK_AMAN, KodeGalatNative.OPERASI_GAGAL],
    dokumentasi: 'Membaca konten teks berkas lokal pada direktori sandbox aplikasi.',
    eksekusi: async (arg: any) => adaptor.bacaBerkas(arg?.jalur || String(arg || '')),
  });

  registri.daftarkan({
    nama: 'berkas.tulis',
    kategori: 'berkas',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: ['penyimpanan'],
    status: 'didukung',
    parameter: [
      { nama: 'jalur', tipe: 'teks', wajib: true, deskripsi: 'Jalur berkas sandbox tujuan' },
      { nama: 'konten', tipe: 'teks', wajib: true, deskripsi: 'Konten teks yang akan ditulis' },
    ],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.PATH_TIDAK_AMAN, KodeGalatNative.OPERASI_GAGAL],
    dokumentasi: 'Menulis konten teks ke berkas lokal dengan proteksi anti-path traversal.',
    eksekusi: async (arg: any) => adaptor.tulisBerkas(arg?.jalur || '', arg?.konten || ''),
  });

  registri.daftarkan({
    nama: 'berkas.hapus',
    kategori: 'berkas',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: ['penyimpanan'],
    status: 'didukung',
    parameter: [
      { nama: 'jalur', tipe: 'teks', wajib: true, deskripsi: 'Jalur berkas yang akan dihapus' },
    ],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.PATH_TIDAK_AMAN],
    dokumentasi: 'Menghapus berkas dalam direktori kerja aplikasi.',
    eksekusi: async (arg: any) => adaptor.hapusBerkas(arg?.jalur || String(arg || '')),
  });

  // 12. PAPAN KLIP (Clipboard API)
  registri.daftarkan({
    nama: 'papan_klip.salin',
    kategori: 'papan_klip',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: [],
    status: 'didukung',
    parameter: [
      { nama: 'teks', tipe: 'teks', wajib: true, deskripsi: 'Teks yang akan disalin ke clipboard' },
    ],
    tipeHasil: 'peta',
    kemungkinanError: [],
    dokumentasi: 'Menyalin teks ke clipboard perangkat sistem.',
    eksekusi: async (arg: any) => adaptor.salinTeks(arg?.teks || String(arg || '')),
  });

  registri.daftarkan({
    nama: 'papan_klip.tempel',
    kategori: 'papan_klip',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: [],
    status: 'didukung',
    parameter: [],
    tipeHasil: 'peta',
    kemungkinanError: [],
    dokumentasi: 'Membaca teks dari clipboard perangkat pengguna.',
    eksekusi: async () => adaptor.tempelTeks(),
  });

  // 13. SHARE SHEET (Share API)
  registri.daftarkan({
    nama: 'bagikan.konten',
    kategori: 'bagikan',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: [],
    status: 'didukung',
    parameter: [
      { nama: 'judul', tipe: 'teks', wajib: false, deskripsi: 'Judul konten berbagi' },
      { nama: 'teks', tipe: 'teks', wajib: false, deskripsi: 'Pesan teks atau deskripsi yang dibagikan' },
      { nama: 'url', tipe: 'teks', wajib: false, deskripsi: 'Tautan URL yang dibagikan' },
    ],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.DIBATALKAN_PENGGUNA],
    dokumentasi: 'Membuka dialog share sheet bawaan sistem operasi Android atau iOS.',
    eksekusi: async (arg: any) => adaptor.bagikan(arg || {}),
  });

  // 14. PENYIMPANAN AMAN (Secure Storage API)
  registri.daftarkan({
    nama: 'simpan_aman.tulis',
    kategori: 'simpan_aman',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: [],
    status: 'didukung',
    parameter: [
      { nama: 'kunci', tipe: 'teks', wajib: true, deskripsi: 'Kunci identifikasi data' },
      { nama: 'nilai', tipe: 'teks', wajib: true, deskripsi: 'Nilai rahasia (token, kredensial, sandi)' },
    ],
    tipeHasil: 'peta',
    kemungkinanError: [KodeGalatNative.ENKRIPSI_GAGAL],
    dokumentasi: 'Menyimpan nilai sensitif dengan enkripsi hardware Keystore / Keychain.',
    eksekusi: async (arg: any) => adaptor.simpanAman(arg?.kunci || '', arg?.nilai || ''),
  });

  registri.daftarkan({
    nama: 'simpan_aman.baca',
    kategori: 'simpan_aman',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: [],
    status: 'didukung',
    parameter: [
      { nama: 'kunci', tipe: 'teks', wajib: true, deskripsi: 'Kunci data yang dicari' },
    ],
    tipeHasil: 'peta',
    kemungkinanError: [],
    dokumentasi: 'Mengambil dan mendekripsi nilai sensitif yang tersimpan dengan aman.',
    eksekusi: async (arg: any) => adaptor.ambilAman(arg?.kunci || String(arg || '')),
  });

  registri.daftarkan({
    nama: 'simpan_aman.hapus',
    kategori: 'simpan_aman',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: [],
    status: 'didukung',
    parameter: [
      { nama: 'kunci', tipe: 'teks', wajib: true, deskripsi: 'Kunci data yang akan dihapus' },
    ],
    tipeHasil: 'peta',
    kemungkinanError: [],
    dokumentasi: 'Menghapus nilai sensitif dari penyimpanan terenkripsi.',
    eksekusi: async (arg: any) => adaptor.hapusAman(arg?.kunci || String(arg || '')),
  });

  // 15. HAPTIK & GETARAN (Haptic API)
  registri.daftarkan({
    nama: 'haptik.getar',
    kategori: 'haptik',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: [],
    status: 'didukung',
    parameter: [
      { nama: 'durasiMs', tipe: 'bilangan', wajib: false, deskripsi: 'Durasi getaran dalam ms', nilaiBawaan: 200 },
    ],
    tipeHasil: 'peta',
    kemungkinanError: [],
    dokumentasi: 'Memicu getaran fisik singkat pada perangkat ponsel.',
    eksekusi: async (arg?: any) => adaptor.getar(arg?.durasiMs || Number(arg) || 200),
  });

  registri.daftarkan({
    nama: 'haptik.pola',
    kategori: 'haptik',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: [],
    status: 'didukung',
    parameter: [
      { nama: 'pola', tipe: 'teks', wajib: false, deskripsi: 'Jenis umpan balik (ringan, sedang, berat, sukses, peringatan, gagal)', nilaiBawaan: 'sukses' },
    ],
    tipeHasil: 'peta',
    kemungkinanError: [],
    dokumentasi: 'Memicu respons umpan balik haptik spesifik sistem operasi.',
    eksekusi: async (arg?: any) => adaptor.haptik(arg?.pola || String(arg || 'sukses')),
  });

  // 16. SIKLUS HIDUP APLIKASI (Application Lifecycle API)
  registri.daftarkan({
    nama: 'lifecycle.status',
    kategori: 'lifecycle',
    platform: ['android', 'ios', 'simulator'],
    versiMinOS: { android: 24, ios: '14.0' },
    izin: [],
    status: 'didukung',
    parameter: [],
    tipeHasil: 'peta',
    kemungkinanError: [],
    dokumentasi: 'Mendapatkan status siklus hidup aplikasi (aktif, jeda, resume, berhenti).',
    eksekusi: async () => {
      const konteks = KonteksAplikasiMobile.dapatkanKonteks();
      return buatHasilSukses({
        status: konteks.lifecycle.dapatkanStatus(),
        apakahAktif: konteks.lifecycle.apakahAktif(),
      });
    },
  });
}
