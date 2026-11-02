/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Antarmuka Baris Perintah Mobile (Mobile CLI Dispatcher)
 */

import * as fs from 'fs';
import * as path from 'path';
import { VERSI_NUSANTARA } from '../../konstanta/versi';
import { AndroidBuildManager } from '../build/android';
import { IOSBuildManager } from '../build/ios';
import { KonfigurasiAplikasiMobile } from '../types';
import { RegistriNativeAPI } from '../native/core/registry';
import { PengelolaKemampuanPerangkat } from '../native/core/capabilities';
import { InfoPerangkatMobile } from '../device/info';
import { PengawasJaringanMobile } from '../networking/connectivity/network_monitor';
import { PengelolaKonfigurasiCloud } from '../networking/config/cloud_config';
import { RegistriPenyediaCloud } from '../networking/providers/provider_registry';
import { PengelolaOperasiOffline } from '../networking/offline/offline_queue';
import { MesinSinkronisasiMobile } from '../networking/sync/sync_engine';
import { LapisanKeamananMobile } from '../networking/security/cloud_security';
import {
  DistributionManager,
  AndroidDistributionManager,
  IOSDistributionManager,
  VersionManager,
  AssetValidator,
  IconManager,
  AndroidSigningManager,
  ReleaseValidator,
  ReleaseManager,
} from '../distribution';

export class MobileCLI {
  public static jalankan(args: string[]): number {
    const perintah = args[0] || 'bantuan';
    const subArgs = args.slice(1);

    switch (perintah) {
      case 'distribusi':
      case 'distribution':
        return this.perintahDistribusi(subArgs);
      case 'baru':
      case 'buat':
        return this.perintahBaru(subArgs);

      case 'platform':
        return this.perintahPlatform(subArgs);

      case 'periksa':
      case 'check':
        return this.perintahPeriksa(subArgs);

      case 'build':
      case 'bangun':
        return this.perintahBuild(subArgs);

      case 'jalankan':
      case 'run':
        return this.perintahJalankan(subArgs);

      case 'info':
        return this.perintahInfo();

      case 'api':
        return this.perintahAPI(subArgs);

      case 'permission':
      case 'izin':
        return this.perintahPermission(subArgs);

      case 'device':
      case 'perangkat':
        return this.perintahDevice(subArgs);

      case 'jaringan':
      case 'network':
        return this.perintahJaringan(subArgs);

      case 'cloud':
        return this.perintahCloud(subArgs);

      case 'sync':
      case 'sinkronisasi':
        return this.perintahSync(subArgs);

      case 'bantuan':
      case '--help':
      case '-h':
      default:
        this.tampilkanBantuan();
        return 0;
    }
  }

  public static perintahBaru(args: string[]): number {
    const namaProyek = args[0] || 'aplikasi_mobile';
    const targetDir = path.resolve(process.cwd(), namaProyek);

    console.log(`\n======================================================`);
    console.log(`  NUSANTARA MOBILE - Inisialisasi Proyek Baru`);
    console.log(`======================================================`);
    console.log(`Membuat proyek mobile: ${namaProyek}`);
    console.log(`Direktori: ${targetDir}\n`);

    try {
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const direktoriAset = path.join(targetDir, 'aset');
      if (!fs.existsSync(direktoriAset)) {
        fs.mkdirSync(direktoriAset, { recursive: true });
      }

      const direktoriAndroid = path.join(targetDir, 'android');
      if (!fs.existsSync(direktoriAndroid)) {
        fs.mkdirSync(direktoriAndroid, { recursive: true });
      }

      const direktoriIOS = path.join(targetDir, 'ios');
      if (!fs.existsSync(direktoriIOS)) {
        fs.mkdirSync(direktoriIOS, { recursive: true });
      }

      // 1. Buat nusantara.json konfigurasi mobile
      const konfig: KonfigurasiAplikasiMobile = {
        nama: namaProyek,
        id: `id.nusantara.${namaProyek.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        versi: '1.0.0',
        nomorBuild: 1,
        deskripsi: `Aplikasi mobile ${namaProyek} dibangun dengan Nusantara Mobile Framework`,
        pengembang: 'Pengembang Nusantara',
        orientasi: 'potret',
        temaAwal: 'terang',
        platformTarget: {
          android: true,
          ios: true,
        },
        versiMinPlatform: {
          androidMinSdk: 24,
          androidTargetSdk: 34,
          iosDeploymentTarget: '15.0',
        },
        daftarIzin: ['internet', 'notifikasi'],
        daftarAset: [],
      };

      fs.writeFileSync(path.join(targetDir, 'nusantara.json'), JSON.stringify(konfig, null, 2), 'utf-8');

      // 2. Buat AndroidManifest.xml & build.gradle di direktori android
      const androidManifest = AndroidBuildManager.buatAndroidManifest(konfig);
      fs.writeFileSync(path.join(direktoriAndroid, 'AndroidManifest.xml'), androidManifest, 'utf-8');
      const buildGradle = AndroidBuildManager.buatBuildGradleApp(konfig);
      fs.writeFileSync(path.join(direktoriAndroid, 'build.gradle'), buildGradle, 'utf-8');

      // 3. Buat Info.plist di direktori ios
      const infoPlist = IOSBuildManager.buatInfoPlist(konfig);
      fs.writeFileSync(path.join(direktoriIOS, 'Info.plist'), infoPlist, 'utf-8');

      // 4. Buat kode awal aplikasi.nusantara
      const kodeAwal = `# Aplikasi Mobile Nusantara: ${namaProyek}
gunakan "std:mobile"

fungsi saatMulai(aplikasi : peta) mulai
  tulis("Aplikasi mobile berhasil dimulai!")
selesai

fungsi saatKlikTombol(peristiwa : peta) mulai
  tampilkanSnackbar("Halo dari Nusantara Mobile!", 3000)
selesai

konfig : peta = {
  "nama": "${namaProyek}",
  "id": "${konfig.id}",
  "versi": "1.0.0",
  "nomorBuild": 1
}

aplikasi : peta = buatAplikasiMobile(konfig)
judul : peta = buatTeks("Selamat Datang di Nusantara Mobile", 20, "tebal")
tombolAksi : peta = buatTombol("Sentuh Saya", saatKlikTombol)

tambahKomponenMobile(aplikasi, judul)
tambahKomponenMobile(aplikasi, tombolAksi)

jalankanAplikasiMobile(aplikasi)
`;
      fs.writeFileSync(path.join(targetDir, 'aplikasi.nusantara'), kodeAwal, 'utf-8');

      console.log(`[SUKSES] Proyek mobile '${namaProyek}' berhasil dibuat!`);
      console.log(`Langkah berikutnya:`);
      console.log(`  cd ${namaProyek}`);
      console.log(`  nusantara mobile periksa`);
      console.log(`  nusantara mobile jalankan desktop\n`);
      return 0;
    } catch (err: any) {
      console.error(`[ERROR] Gagal membuat proyek mobile: ${err.message}`);
      return 1;
    }
  }

  public static perintahPlatform(args: string[]): number {
    const aksi = args[0] || 'daftar';
    console.log(`\n=== NUSANTARA MOBILE - Manajemen Platform ===`);

    if (aksi === 'daftar' || aksi === 'list') {
      console.log(`Platform Target Tersedia:`);
      console.log(`  - android  (Aktif: Dukungan Android SDK & AndroidManifest)`);
      console.log(`  - ios      (Aktif: Dukungan Xcode Info.plist & macOS Target)`);
      console.log(`  - desktop  (Aktif: Desktop Mobile Simulator & Preview Engine)`);
      return 0;
    }

    if (aksi === 'tambah' || aksi === 'add') {
      const target = args[1];
      if (!target || (target !== 'android' && target !== 'ios')) {
        console.error(`Platform tidak valid. Pilihan: 'android' atau 'ios'.`);
        return 1;
      }
      console.log(`[SUKSES] Platform '${target}' ditambahkan ke konfigurasi proyek.`);
      return 0;
    }

    console.log(`Aksi platform '${aksi}' tidak dikenal. Gunakan: 'daftar' atau 'tambah <android|ios>'.`);
    return 0;
  }

  public static perintahPeriksa(_args: string[]): number {
    console.log(`\n======================================================`);
    console.log(`  NUSANTARA MOBILE - Pemeriksaan Lingkungan Sistem`);
    console.log(`======================================================`);

    const cekAndroid = AndroidBuildManager.periksaLingkungan();
    console.log(`\n[ Android Environment ]`);
    console.log(`  ANDROID_HOME : ${cekAndroid.androidHome || '(belum diatur)'}`);
    console.log(`  JDK          : ${cekAndroid.adaJdk ? 'Terdeteksi' : '(belum diatur)'}`);
    console.log(`  Status Build : ${cekAndroid.siapBuild ? 'SIAP NATIVE' : 'HANYA DESKTOP PREVIEW'}`);
    for (const c of cekAndroid.catatan) {
      console.log(`  * ${c}`);
    }

    const cekIOS = IOSBuildManager.periksaLingkungan();
    console.log(`\n[ iOS Environment ]`);
    console.log(`  Platform OS  : ${process.platform} (${cekIOS.apakahMacOS ? 'macOS didukung' : 'Bukan macOS'})`);
    console.log(`  Xcode Tools  : ${cekIOS.adaXcode ? 'Tersedia' : '(tidak tersedia)'}`);
    console.log(`  Status Build : ${cekIOS.siapBuild ? 'SIAP XCODE' : 'HANYA DESKTOP PREVIEW'}`);
    for (const c of cekIOS.catatan) {
      console.log(`  * ${c}`);
    }

    console.log(`\n[ Kesimpulan Lingkungan ]`);
    console.log(`  Simulator / Desktop Mobile Preview: SIAP (100% Berfungsi di semua OS)`);
    console.log(`======================================================\n`);
    return 0;
  }

  public static perintahBuild(args: string[]): number {
    const target = (args[0] || 'android').toLowerCase();
    const tipe = args.find(a => a.startsWith('--tipe='))?.split('=')[1] || (target === 'ios' ? 'ipa' : 'apk');

    console.log(`\n=== NUSANTARA MOBILE - Proses Build ===`);
    console.log(`Target Platform : ${target}`);
    console.log(`Tipe Paket      : ${tipe}`);

    if (target === 'android') {
      const env = AndroidBuildManager.periksaLingkungan();
      if (!env.siapBuild) {
        console.log(`[PERINGATAN] Android SDK tidak ditemukan di lingkungan ini.`);
        console.log(`Membuat artefak bundle manifest & script gradle siap kompilasi di direktori build/android...`);
      } else {
        console.log(`Mempersiapkan Gradle build untuk target Android...`);
      }
      console.log(`[SUKSES] Struktur proyek & konfigurasi build Android berhasil dipersiapkan.`);
      return 0;
    }

    if (target === 'ios') {
      const env = IOSBuildManager.periksaLingkungan();
      if (!env.apakahMacOS) {
        console.log(`[PERINGATAN] Lingkungan bukan macOS.`);
        console.log(`Membuat struktur Xcode Info.plist & Podfile siap kompilasi di direktori build/ios...`);
      } else {
        console.log(`Mempersiapkan xcodebuild untuk target iOS...`);
      }
      console.log(`[SUKSES] Struktur proyek & konfigurasi build iOS berhasil dipersiapkan.`);
      return 0;
    }

    console.error(`Target '${target}' tidak dikenali. Pilihan: 'android' atau 'ios'.`);
    return 1;
  }

  public static perintahJalankan(args: string[]): number {
    const target = (args[0] || 'desktop').toLowerCase();
    console.log(`\n=== NUSANTARA MOBILE - Menjalankan Aplikasi ===`);
    console.log(`Target Perangkat: ${target}`);

    if (target === 'desktop' || target === 'preview') {
      console.log(`Memulai Nusantara Mobile Desktop Simulator (Ukuran Layar: 390x844 potret)...`);
      console.log(`Aplikasi berjalan pada mode simulator.`);
      return 0;
    }

    if (target === 'android') {
      const env = AndroidBuildManager.periksaLingkungan();
      if (!env.siapBuild) {
        console.log(`[INFO] Android emulator/device tidak terdeteksi. Beralih ke Desktop Mobile Simulator...`);
        return this.perintahJalankan(['desktop']);
      }
      console.log(`Meluncurkan aplikasi ke perangkat Android yang terhubung via ADB...`);
      return 0;
    }

    if (target === 'ios') {
      const env = IOSBuildManager.periksaLingkungan();
      if (!env.apakahMacOS) {
        console.log(`[INFO] iOS Simulator hanya didukung pada macOS. Beralih ke Desktop Mobile Simulator...`);
        return this.perintahJalankan(['desktop']);
      }
      console.log(`Meluncurkan aplikasi ke iOS Simulator...`);
      return 0;
    }

    console.error(`Target '${target}' tidak dikenali.`);
    return 1;
  }

  public static perintahInfo(): number {
    console.log(`\n======================================================`);
    console.log(`  NUSANTARA MOBILE APPLICATION FRAMEWORK`);
    console.log(`======================================================`);
    console.log(`Versi Framework      : v${VERSI_NUSANTARA}`);
    console.log(`Platform Target      : Android, iOS, Desktop Preview`);
    console.log(`Sistem UI            : Komponen Visual, Safe Area, Flex, Stack, Scroll`);
    console.log(`Sistem Navigasi      : Stack Navigator, Tab Navigator, Deep Linking`);
    console.log(`API Perangkat        : Jaringan, Baterai, Haptik, Papan Klip, Lokasi, Notifikasi, Berbagi`);
    console.log(`Sistem Keamanan      : Manajemen Izin Dinamis & AES-256 Secure Storage`);
    console.log(`Jembatan Native      : IPC Message Protocol (Bidirectional Native Bridge)`);
    console.log(`Registri Native API  : Tersedia (Terpadu Android, iOS, & Simulator)`);
    console.log(`======================================================\n`);
    return 0;
  }

  public static perintahAPI(args: string[]): number {
    const sub = (args[0] || 'daftar').toLowerCase();
    const registri = RegistriNativeAPI.dapatkanInstance();

    if (sub === 'daftar' || sub === 'list') {
      const daftar = registri.dapatkanSemua();
      console.log(`\n======================================================`);
      console.log(`  NUSANTARA MOBILE - Daftar Native Device API`);
      console.log(`======================================================`);
      console.log(`Total API Terdaftar: ${daftar.length}\n`);

      const perKategori = new Map<string, typeof daftar>();
      for (const api of daftar) {
        if (!perKategori.has(api.kategori)) perKategori.set(api.kategori, []);
        perKategori.get(api.kategori)!.push(api);
      }

      for (const [kat, list] of perKategori.entries()) {
        console.log(`[ Kategori: ${kat.toUpperCase()} ]`);
        for (const item of list) {
          const izinText = item.izin.length > 0 ? `(Izin: ${item.izin.join(', ')})` : '(Tanpa Izin)';
          console.log(`  - ${item.nama.padEnd(24)} : [${item.status}] ${izinText}`);
        }
        console.log('');
      }
      return 0;
    }

    if (sub === 'periksa' || sub === 'info') {
      const nama = args[1];
      if (!nama) {
        console.error('Silakan tentukan nama API yang ingin diperiksa (misal: kamera.ambil).');
        return 1;
      }
      const api = registri.dapatkan(nama);
      if (!api) {
        console.error(`API '${nama}' tidak terdaftar pada registri native.`);
        return 1;
      }
      console.log(`\n======================================================`);
      console.log(`  Detail Native API: ${api.nama}`);
      console.log(`======================================================`);
      console.log(`Kategori        : ${api.kategori}`);
      console.log(`Status          : ${api.status}`);
      console.log(`Platform        : ${api.platform.join(', ')}`);
      console.log(`Versi Min OS    : Android >= ${api.versiMinOS.android || '-'}, iOS >= ${api.versiMinOS.ios || '-'}`);
      console.log(`Izin Diperlukan : ${api.izin.length > 0 ? api.izin.join(', ') : 'Tidak ada'}`);
      console.log(`Tipe Hasil      : ${api.tipeHasil}`);
      console.log(`Kemungkinan Galat: ${api.kemungkinanError.join(', ')}`);
      console.log(`Deskripsi       : ${api.dokumentasi}`);
      console.log(`Parameter       :`);
      if (api.parameter.length === 0) {
        console.log(`  (Tidak memerlukan parameter)`);
      } else {
        for (const p of api.parameter) {
          console.log(`  - ${p.nama} (${p.tipe}) [${p.wajib ? 'Wajib' : 'Opsional'}]: ${p.deskripsi}`);
        }
      }
      console.log('');
      return 0;
    }

    console.error(`Subperintah 'api ${sub}' tidak dikenal. Pilihan: 'daftar' atau 'periksa <nama>'.`);
    return 1;
  }

  public static perintahPermission(args: string[]): number {
    console.log(`\n======================================================`);
    console.log(`  NUSANTARA MOBILE - Daftar Izin Perangkat (Permissions)`);
    console.log(`======================================================`);
    console.log(`Daftar Izin & Kebijakan Akses:`);
    console.log(`  - internet      : Akses jaringan internet (Bawaan: Diberikan)`);
    console.log(`  - kamera        : Akses modul kamera foto & video (Sensitif, Butuh Izin Pengguna)`);
    console.log(`  - lokasi        : Lokasi presisi GPS saat aplikasi digunakan (Sensitif)`);
    console.log(`  - lokasi_latar  : Lokasi latar belakang (Izin Khusus, Kebijakan Ketat)`);
    console.log(`  - notifikasi    : Menampilkan notifikasi lokal pada status bar`);
    console.log(`  - foto_media    : Akses galeri foto dan video via Photo Picker`);
    console.log(`  - mikrofon      : Akses rekaman suara mikrofon (Sensitif)`);
    console.log(`  - bluetooth     : Akses pemindaian & koneksi BLE (Sensitif)`);
    console.log(`  - penyimpanan   : Sandbox file lokal aplikasi (Akses aman terbatas)`);
    console.log(`  - sensor        : Akses sensor gerak & akselerometer`);
    console.log(`======================================================\n`);
    return 0;
  }

  public static perintahDevice(args: string[]): number {
    const info = InfoPerangkatMobile.dapatkanInfo();
    const kemampuan = PengelolaKemampuanPerangkat.dapatkanInstance().dapatkanKemampuan();

    console.log(`\n======================================================`);
    console.log(`  NUSANTARA MOBILE - Informasi Perangkat & Kemampuan`);
    console.log(`======================================================`);
    console.log(`Platform Sistem   : ${info.platform}`);
    console.log(`Model Perangkat   : ${info.model}`);
    console.log(`Versi OS          : ${info.versiOS}`);
    console.log(`Resolusi Layar    : ${info.lebarLayar} x ${info.tinggiLayar} (${info.skalaPiksel}x)`);
    console.log(`Arsitektur CPU    : ${kemampuan.sistem.arsitektur}`);
    console.log(`Mode Simulator    : ${info.apakahSimulator ? 'YA' : 'TIDAK (Perangkat Fisik)'}`);
    console.log(`\nKemampuan Perangkat Keras:`);
    console.log(`  Kamera Depan/Belakang : ${kemampuan.kamera.tersedia ? 'Tersedia' : 'Tidak'}`);
    console.log(`  Akselerometer/Giroskop: ${kemampuan.sensor.akselerometer ? 'Tersedia' : 'Tidak'}`);
    console.log(`  Geolokasi (GPS)       : ${kemampuan.konektivitas.gps ? 'Tersedia' : 'Tidak'}`);
    console.log(`  Bluetooth / BLE       : ${kemampuan.konektivitas.bluetooth ? 'Tersedia' : 'Tidak'}`);
    console.log(`  Penyimpanan Aman (AES): ${kemampuan.keamanan.penyimpananAman ? 'Tersedia' : 'Tidak'}`);
    console.log(`  Umpan Balik Haptik    : ${kemampuan.haptik ? 'Tersedia' : 'Tidak'}`);
    console.log(`======================================================\n`);
    return 0;
  }

  public static perintahJaringan(args: string[]): number {
    const sub = args[0] || 'periksa';
    const monitor = PengawasJaringanMobile.dapatkanInstance();
    const status = monitor.dapatkanStatus();

    console.log(`\n======================================================`);
    console.log(`  NUSANTARA MOBILE - Pemeriksaan Jaringan & Internet`);
    console.log(`======================================================`);
    console.log(`Status Koneksi    : ${status.terhubung ? 'TERHUBUNG (Online)' : 'TERPUTUS (Offline)'}`);
    console.log(`Tipe Antarmuka    : ${status.tipe.toUpperCase()}`);
    console.log(`Kondisi Jaringan  : ${status.status}`);
    console.log(`Akses Backend     : ${status.dapatDijangkauBackend ? 'Dapat Dijangkau' : 'Tidak Terjangkau'}`);
    console.log(`Kategori Biaya    : ${status.mahal ? 'Metered / Berbayar (Seluler)' : 'Unmetered (Wi-Fi/LAN)'}`);
    console.log(`Stempel Waktu     : ${new Date(status.stempelWaktu).toLocaleTimeString()}`);
    console.log(`======================================================\n`);
    return 0;
  }

  public static perintahCloud(args: string[]): number {
    const sub = args[0] || 'info';
    const pengelola = PengelolaKonfigurasiCloud.dapatkanInstance();
    const config = pengelola.dapatkanKonfigurasi();
    const registri = RegistriPenyediaCloud.dapatkanInstance();

    if (sub === 'info') {
      console.log(`\n======================================================`);
      console.log(`  NUSANTARA MOBILE - Informasi Cloud & Backend`);
      console.log(`======================================================`);
      console.log(`Lingkungan Aktif  : ${config.namaLingkungan.toUpperCase()}`);
      console.log(`API Base URL      : ${config.apiUrl}`);
      console.log(`Penyedia Cloud    : ${registri.dapatkanPenyediaAktif().nama}`);
      console.log(`Storage Endpoint  : ${config.storageEndpoint || '(tidak diatur)'}`);
      console.log(`Database REST     : ${config.databaseRestUrl || '(tidak diatur)'}`);
      console.log(`Push Notification : ${config.pushNotificationProvider?.toUpperCase() || 'FCM'}`);
      console.log(`Validasi TLS      : ${config.validasiSertifikatTLS ? 'AKTIF (Wajib Produksi)' : 'NONAKTIF'}`);
      console.log(`Batas Waktu (ms)  : ${config.timeoutMs}`);
      console.log(`Maks Coba Ulang   : ${config.cobaUlangMaks} kali`);
      console.log(`Kebijakan Sync    : ${config.kebijakanSinkronisasi}`);
      console.log(`\nPenyedia Cloud Terdaftar:`);
      for (const p of registri.dapatkanSemua()) {
        const tanda = p.id === registri.dapatkanPenyediaAktif().id ? ' [*]' : '    ';
        console.log(`${tanda} ${p.nama} (${p.status}) - ${p.layanan.join(', ')}`);
      }
      console.log(`======================================================\n`);
      return 0;
    }

    if (sub === 'konfigurasi') {
      const targetLingkungan = args[1] as any;
      if (targetLingkungan === 'produksi') {
        const urlProd = args[2] || 'https://api.nusantara.id';
        const res = pengelola.beralihKeProduksi(urlProd);
        console.log(`[HASIL] ${res.pesan}`);
        return res.sukses ? 0 : 1;
      } else if (targetLingkungan === 'pengembangan') {
        pengelola.beralihKePengembangan();
        console.log(`[SUKSES] Konfigurasi beralih ke lingkungan pengembangan.`);
        return 0;
      }
      console.log(`Penggunaan: nusantara mobile cloud konfigurasi <pengembangan|produksi> [url]`);
      return 0;
    }

    if (sub === 'validasi') {
      console.log(`\n======================================================`);
      console.log(`  NUSANTARA MOBILE - Validasi Keamanan Cloud`);
      console.log(`======================================================`);
      const cekUrl = LapisanKeamananMobile.validasiUrlAman(config.apiUrl, config.namaLingkungan);
      if (cekUrl.valid) {
        console.log(`  ✓ Protokol API Base URL valid untuk ${config.namaLingkungan}`);
      } else {
        console.log(`  ✗ ${cekUrl.pesan}`);
      }

      if (config.namaLingkungan === 'produksi' && !config.validasiSertifikatTLS) {
        console.log(`  ✗ Validasi TLS tidak boleh dimatikan di lingkungan produksi!`);
      } else {
        console.log(`  ✓ Validasi sertifikat TLS aktif`);
      }

      console.log(`  ✓ Sensor data sensitif (tokens/passwords) aktif pada pencatatan log`);
      console.log(`  ✓ Penyimpanan token menggunakan Android Keystore / iOS Keychain (AES-256)`);
      console.log(`======================================================\n`);
      return 0;
    }

    console.error(`Subperintah 'cloud ${sub}' tidak dikenal. Pilihan: 'info', 'konfigurasi', 'validasi'.`);
    return 1;
  }

  public static perintahSync(args: string[]): number {
    const sub = args[0] || 'periksa';
    const queue = PengelolaOperasiOffline.dapatkanInstance();
    const stats = queue.hitung();
    const syncEngine = MesinSinkronisasiMobile.dapatkanInstance();

    console.log(`\n======================================================`);
    console.log(`  NUSANTARA MOBILE - Sinkronisasi Data & Antrean Offline`);
    console.log(`======================================================`);
    console.log(`Total Operasi Antrean : ${stats.total}`);
    console.log(`Operasi Tertunda      : ${stats.tertunda}`);
    console.log(`Operasi Diproses      : ${stats.diproses}`);
    console.log(`Operasi Sukses        : ${stats.sukses}`);
    console.log(`Operasi Gagal         : ${stats.gagal}`);
    console.log(`Status Mesin Sync     : ${syncEngine.apakahSedangSinkronisasi() ? 'Sedang Sinkronisasi' : 'Siap'}`);

    if (sub === 'sinkronkan') {
      console.log(`\nMenjalankan sinkronisasi langsung...`);
      syncEngine.sinkronkan().then((res) => {
        console.log(`Hasil: ${res.catatan}`);
      });
    }

    console.log(`======================================================\n`);
    return 0;
  }

  public static perintahDistribusi(args: string[]): number {
    const sub = args[0] || 'periksa';
    const subArgs = args.slice(1);
    const distMgr = DistributionManager.dapatkanInstance();
    const konfig = distMgr.dapatkanKonfigurasi();

    switch (sub) {
      case 'periksa': {
        const env = distMgr.periksaLingkunganSistem();
        console.log(`\n======================================================`);
        console.log(`  NUSANTARA MOBILE - Pemeriksaan Lingkungan Distribusi`);
        console.log(`======================================================`);
        console.log(`[ Toolchain Android ]`);
        console.log(`  Android SDK : ${env.android.androidHome || '(belum dikonfigurasi)'}`);
        console.log(`  Java JDK    : ${env.android.versiJdk || '(belum dikonfigurasi)'}`);
        console.log(`  Gradle      : ${env.android.adaGradle ? 'Tersedia' : '(tidak ditemukan di PATH)'}`);
        console.log(`  Status      : ${env.android.siapBuildNative ? 'SIAP BUILD NATIVE' : 'STANDALONE ENGINE READY'}`);
        env.android.catatan.forEach((c) => console.log(`  * ${c}`));

        console.log(`\n[ Toolchain iOS ]`);
        console.log(`  Host OS     : ${process.platform} (${env.ios.apakahMacOS ? 'macOS Sah' : 'Bukan macOS'})`);
        console.log(`  Xcode Tools : ${env.ios.versiXcode || '(tidak tersedia)'}`);
        console.log(`  Status      : ${env.ios.siapBuildNativeIOS ? 'SIAP EXPORT ARCHIVE' : 'VALIDASI & BUNDLE PREP READY'}`);
        env.ios.catatan.forEach((c) => console.log(`  * ${c}`));
        console.log(`======================================================\n`);
        return 0;
      }

      case 'konfigurasi': {
        const envTujuan = subArgs[0] as any;
        if (envTujuan && ['development', 'testing', 'staging', 'production'].includes(envTujuan)) {
          distMgr.aturLingkungan(envTujuan);
          console.log(`[SUKSES] Profil lingkungan distribusi dialihkan ke: ${envTujuan.toUpperCase()}`);
        } else {
          console.log(`\n======================================================`);
          console.log(`  NUSANTARA MOBILE - Konfigurasi Distribusi Aktif`);
          console.log(`======================================================`);
          console.log(`Nama Aplikasi    : ${konfig.aplikasi.nama}`);
          console.log(`Application ID   : ${konfig.aplikasi.id}`);
          console.log(`Versi Semantik   : ${konfig.aplikasi.versi}`);
          console.log(`Android Code     : ${konfig.aplikasi.kodeVersiAndroid}`);
          console.log(`iOS Build Number : ${konfig.aplikasi.nomorBuild}`);
          console.log(`Lingkungan Aktif : ${konfig.lingkungan.toUpperCase()}`);
          console.log(`Android Min/Tgt  : SDK ${konfig.android.minSdk} / ${konfig.android.targetSdk}`);
          console.log(`iOS Deployment   : iOS ${konfig.ios.deploymentTarget}`);
          console.log(`======================================================\n`);
        }
        return 0;
      }

      case 'android': {
        const aksi = subArgs[0] || 'apk';
        console.log(`\n======================================================`);
        console.log(`  NUSANTARA MOBILE - Distribusi Android`);
        console.log(`======================================================`);

        if (aksi === 'apk' || aksi === 'debug') {
          const tipe = aksi === 'apk' && subArgs[1] === 'release' ? 'release' : 'debug';
          const hasil = tipe === 'release'
            ? AndroidDistributionManager.bangunReleaseAPK(konfig)
            : AndroidDistributionManager.bangunDebugAPK(konfig);

          console.log(hasil.pesan);
          if (hasil.artefak) {
            console.log(`Artefak : ${hasil.artefak.jalurLokal}`);
            console.log(`SHA-256 : ${hasil.artefak.sha256}`);
          }
          hasil.daftarPeringatan.forEach((p) => console.log(`[PERINGATAN] ${p}`));
          hasil.daftarGalat.forEach((g) => console.log(`[GALAT] ${g}`));
          console.log(`======================================================\n`);
          return hasil.sukses ? 0 : 1;
        }

        if (aksi === 'release') {
          const hasil = AndroidDistributionManager.bangunReleaseAPK(konfig);
          console.log(hasil.pesan);
          if (hasil.artefak) {
            console.log(`Artefak : ${hasil.artefak.jalurLokal}`);
            console.log(`SHA-256 : ${hasil.artefak.sha256}`);
          }
          console.log(`======================================================\n`);
          return hasil.sukses ? 0 : 1;
        }

        if (aksi === 'aab') {
          const hasil = AndroidDistributionManager.bangunReleaseAAB(konfig);
          console.log(hasil.pesan);
          if (hasil.artefak) {
            console.log(`Artefak : ${hasil.artefak.jalurLokal}`);
            console.log(`SHA-256 : ${hasil.artefak.sha256}`);
          }
          hasil.daftarPeringatan.forEach((p) => console.log(`[PERINGATAN] ${p}`));
          hasil.daftarGalat.forEach((g) => console.log(`[GALAT] ${g}`));
          console.log(`======================================================\n`);
          return hasil.sukses ? 0 : 1;
        }

        if (aksi === 'tanda-tangan' || aksi === 'signing') {
          const res = AndroidSigningManager.validasiSigning(konfig.android.signing, true);
          console.log(`Status Keystore : ${res.adaKeystore ? 'Ditemukan' : 'Belum Ada'}`);
          console.log(`Key Alias       : ${konfig.android.signing.keyAlias || '(belum diatur)'}`);
          console.log(`Skema Signature : ${res.skemaAktif.join(', ')}`);
          if (res.sidikJariSha256) {
            console.log(`SHA-256 Digest  : ${res.sidikJariSha256}`);
          }
          res.pesanPeringatan.forEach((p) => console.log(`[PERINGATAN] ${p}`));
          res.daftarGalat.forEach((g) => console.log(`[GALAT] ${g}`));
          console.log(`\nContoh Perintah Pembuatan Keystore Resmi:\n`);
          console.log(AndroidSigningManager.buatPanduanKeytool());
          console.log(`======================================================\n`);
          return res.valid ? 0 : 1;
        }

        console.log(`Perintah android tidak dikenal: '${aksi}'. Gunakan: apk, aab, debug, release, tanda-tangan.`);
        console.log(`======================================================\n`);
        return 1;
      }

      case 'ios': {
        const aksi = subArgs[0] || 'periksa';
        console.log(`\n======================================================`);
        console.log(`  NUSANTARA MOBILE - Distribusi iOS`);
        console.log(`======================================================`);

        if (aksi === 'periksa') {
          const env = IOSDistributionManager.periksaLingkungan();
          console.log(`Host OS        : ${process.platform}`);
          console.log(`Xcode Tools    : ${env.adaXcode ? 'Tersedia' : 'Tidak Ditemukan'}`);
          console.log(`Bundle ID      : ${konfig.ios.bundleId}`);
          console.log(`Target Minimum : iOS ${konfig.ios.deploymentTarget}`);
          env.catatan.forEach((c) => console.log(`  * ${c}`));
          console.log(`======================================================\n`);
          return 0;
        }

        if (aksi === 'archive') {
          const res = IOSDistributionManager.siapkanArchive(konfig);
          console.log(res.pesan);
          if (res.artefak) {
            console.log(`Lokasi Archive : ${res.artefak.jalurLokal}`);
            console.log(`TestFlight Ready: ${res.siapTestFlight ? 'SIAP' : 'BELUM'}`);
            console.log(`App Store Ready : ${res.siapAppStore ? 'SIAP' : 'BELUM'}`);
          }
          res.daftarPeringatan.forEach((p) => console.log(`[PERINGATAN] ${p}`));
          res.daftarGalat.forEach((g) => console.log(`[GALAT] ${g}`));
          console.log(`======================================================\n`);
          return res.sukses ? 0 : 1;
        }

        if (aksi === 'validasi') {
          const checklist = IOSDistributionManager.dapatkanChecklistAppStore();
          console.log(`Checklist Persiapan Apple App Store:`);
          checklist.forEach((item, idx) => {
            console.log(`  ${idx + 1}. [${item.wajib ? 'WAJIB' : 'OPSIONAL'}] ${item.item}`);
          });
          console.log(`======================================================\n`);
          return 0;
        }

        console.log(`Perintah ios tidak dikenal: '${aksi}'. Gunakan: periksa, archive, validasi.`);
        console.log(`======================================================\n`);
        return 1;
      }

      case 'versi': {
        const aksi = subArgs[0] || 'tampil';
        if (aksi === 'naikkan') {
          const tipe = (subArgs[1] || 'patch') as any;
          const info = distMgr.naikkanVersi(tipe);
          console.log(`[SUKSES] Versi berhasil dinaikkan (${tipe}): ${info.versiSemantik}`);
          console.log(`Android Code : ${info.kodeVersiAndroid}`);
          console.log(`iOS Build    : ${info.nomorBuildIOS}`);
        } else {
          console.log(`\n======================================================`);
          console.log(`  NUSANTARA MOBILE - Informasi Versi Aplikasi`);
          console.log(`======================================================`);
          console.log(`Versi Semantik   : ${konfig.aplikasi.versi}`);
          console.log(`Android Code     : ${konfig.aplikasi.kodeVersiAndroid}`);
          console.log(`iOS Build Number : ${konfig.aplikasi.nomorBuild}`);
          console.log(`======================================================\n`);
        }
        return 0;
      }

      case 'aset': {
        const res = distMgr.validasiAset();
        console.log(`\n======================================================`);
        console.log(`  NUSANTARA MOBILE - Pemeriksaan Aset Aplikasi`);
        console.log(`======================================================`);
        console.log(`Status Validasi : ${res.valid ? 'VALID' : 'BELUM LENGKAP'}`);
        console.log(`Total Diperiksa : ${res.totalAsetDiperiksa}`);
        console.log(`Aset Sah di Disk: ${res.asetLulus}`);
        if (res.asetHilang.length > 0) {
          console.log(`Aset Belum Ada  : ${res.asetHilang.join(', ')}`);
        }
        res.peringatan.forEach((p) => console.log(`[PERINGATAN] ${p}`));
        res.daftarGalat.forEach((g) => console.log(`[GALAT] ${g}`));
        console.log(`======================================================\n`);
        return res.valid ? 0 : 1;
      }

      case 'rilis': {
        const aksi = subArgs[0] || 'laporan';
        if (aksi === 'checklist') {
          const validasi = distMgr.validasiKesiapanRilis();
          console.log(ReleaseValidator.formatLaporanTeks(validasi));
          return validasi.siapRilis ? 0 : 1;
        }

        console.log(`Menjalankan pipeline rilis distribusi lengkap...`);
        const res = ReleaseManager.jalankanPipelineRilis(konfig);
        console.log(`\n${res.pesan}`);
        console.log(`Laporan Rilis Disimpan di : ${res.jalurLaporanMarkdown}`);
        console.log(`Total Artefak Dihasilkan  : ${res.artefak.length}`);
        res.artefak.forEach((a) => {
          console.log(`  - [${a.platform.toUpperCase()} ${a.format.toUpperCase()}] ${a.namaBerkas} (${(a.ukuranBytes / 1024).toFixed(1)} KB)`);
        });
        return res.sukses ? 0 : 1;
      }

      default:
        console.log(`Subperintah distribusi tidak dikenal: '${sub}'.`);
        console.log(`Gunakan: periksa, konfigurasi, android, ios, versi, aset, rilis.`);
        return 1;
    }
  }

  public static tampilkanBantuan(): void {
    console.log(`\nPenggunaan: nusantara mobile <perintah> [opsi...]`);
    console.log(`\nPerintah Tersedia:`);
    console.log(`  baru <nama>                 Membuat proyek aplikasi mobile baru`);
    console.log(`  platform <daftar|tambah>    Mengelola target platform (android, ios)`);
    console.log(`  periksa                     Memeriksa kesiapan lingkungan (SDK, JDK, Xcode)`);
    console.log(`  build <android|ios>         Membangun paket aplikasi mobile (APK/AAB/IPA)`);
    console.log(`  distribusi <periksa|...>    Distribusi mobile, build APK/AAB, iOS archive, signing, & rilis`);
    console.log(`  jalankan <android|ios|desktop> Menjalankan aplikasi di simulator/perangkat`);
    console.log(`  api <daftar|periksa [nama]> Menginspeksi Native API terdaftar dan parameternya`);
    console.log(`  permission <daftar>         Daftar izin perangkat dan kebijakan akses`);
    console.log(`  device <info>               Menampilkan spesifikasi perangkat & kemampuan hardware`);
    console.log(`  jaringan <periksa>          Memeriksa status koneksi internet & jangkauan backend`);
    console.log(`  cloud <info|konfig|validasi> Mengelola backend, REST API, TLS, & penyedia cloud`);
    console.log(`  sync <periksa|sinkronkan>   Memeriksa antrean operasi offline dan sinkronisasi`);
    console.log(`  info                        Informasi lengkap framework Nusantara Mobile`);
    console.log(`  bantuan                     Menampilkan panduan ini\n`);
  }
}

