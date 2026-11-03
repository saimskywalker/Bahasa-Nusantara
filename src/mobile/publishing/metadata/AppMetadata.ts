/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 41
 * Manajer & Validator Metadata Toko Aplikasi (App Store Metadata Manager)
 */

import { MetadataListingLocale, MetadataTokoLengkap, InformasiKontakToko, KebijakanPrivasiToko } from '../types';

export interface HasilValidasiMetadata {
  valid: boolean;
  skorKelengkapan: number; // 0 - 100
  daftarGalat: string[];
  pesanPeringatan: string[];
  rekomendasi: string[];
}

export class AppMetadataManager {
  // Batas Resmi Google Play Console
  public static readonly BATAS_PLAY_NAMA = 30;
  public static readonly BATAS_PLAY_DESKRIPSI_SINGKAT = 80;
  public static readonly BATAS_PLAY_DESKRIPSI_LENGKAP = 4000;

  // Batas Resmi Apple App Store Connect
  public static readonly BATAS_IOS_NAMA = 30;
  public static readonly BATAS_IOS_SUBTITLE = 30;
  public static readonly BATAS_IOS_KATA_KUNCI = 100;
  public static readonly BATAS_IOS_DESKRIPSI_LENGKAP = 4000;
  public static readonly BATAS_CATATAN_RILIS = 500;

  /**
   * Membuat konfigurasi metadata default yang sah dan siap rilis.
   */
  public static buatDefaultMetadata(appId = 'id.nusantara.aplikasi', namaApp = 'Aplikasi Nusantara'): MetadataTokoLengkap {
    const listingId: MetadataListingLocale = {
      locale: 'id',
      namaAplikasi: namaApp,
      judulSubtitle: 'Ditenagai Bahasa NUSANTARA',
      deskripsiSingkat: 'Aplikasi mobile modern berkecepatan tinggi dengan NUSANTARA.',
      deskripsiLengkap:
        `${namaApp} adalah aplikasi mobile resmi yang dikembangkan menggunakan Bahasa Pemrograman NUSANTARA.\n\n` +
        'Fitur Utama:\n' +
        '• Kinerja native responsif dan efisien\n' +
        '• UI elegan, modern, dan intuitif\n' +
        '• Keamanan data terenkripsi end-to-end\n' +
        '• Dukungan sinkronisasi cloud real-time\n\n' +
        'Diproduksi dengan dedikasi oleh Komunitas Pengembang Nusantara.',
      kataKunci: ['nusantara', 'mobile', 'aplikasi', 'indonesia', 'open-source'],
      catatanRilis: 'Rilis perdana aplikasi versi 1.0.0 dengan performa tinggi dan fitur lengkap.',
      kebijakanPrivasiUrl: 'https://nusantara.dev/privasi',
      dukunganUrl: 'https://nusantara.dev/dukungan',
      pemasaranUrl: 'https://nusantara.dev',
    };

    const kontak: InformasiKontakToko = {
      namaPengembang: 'Komunitas Pengembang Nusantara',
      emailDukungan: 'support@nusantara.dev',
      situsWebResmi: 'https://nusantara.dev',
    };

    const privasi: KebijakanPrivasiToko = {
      kebijakanUrl: 'https://nusantara.dev/privasi',
      mengumpulkanDataPribadi: false,
      kategoriData: [],
      tujuanPenggunaan: ['fungsionalitas_aplikasi'],
      berbagiPihakKetiga: false,
      mekanismePenghapusanAkun: true,
      urlPenghapusanAkun: 'https://nusantara.dev/akun/hapus',
    };

    return {
      aplikasiId: appId,
      kategoriAndroid: 'PRODUCTIVITY',
      kategoriIOS: 'Productivity',
      ratingUsia: '4+',
      bahasaUtama: 'id',
      listingPerLocale: {
        id: listingId,
      },
      kontak,
      privasi,
    };
  }

  /**
   * Validasi menyeluruh terhadap kelayakan metadata listing toko aplikasi.
   */
  public static validasiMetadata(metadata: MetadataTokoLengkap): HasilValidasiMetadata {
    const daftarGalat: string[] = [];
    const pesanPeringatan: string[] = [];
    const rekomendasi: string[] = [];

    let poin = 0;
    const totalPoinMaks = 10;

    // 1. Validasi Application ID
    if (!metadata.aplikasiId || !/^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/.test(metadata.aplikasiId)) {
      daftarGalat.push(`Application ID '${metadata.aplikasiId}' tidak valid (harus format reverse-DNS).`);
    } else {
      poin += 1;
    }

    // 2. Validasi Listing Bahasa Utama
    const bahasaUtama = metadata.bahasaUtama || 'id';
    const listingUtama = metadata.listingPerLocale[bahasaUtama];

    if (!listingUtama) {
      daftarGalat.push(`Listing untuk bahasa utama '${bahasaUtama}' belum dibuat.`);
    } else {
      poin += 1;

      // Nama Aplikasi
      if (!listingUtama.namaAplikasi || listingUtama.namaAplikasi.trim().length === 0) {
        daftarGalat.push('Nama aplikasi tidak boleh kosong.');
      } else {
        if (listingUtama.namaAplikasi.length > this.BATAS_PLAY_NAMA) {
          daftarGalat.push(
            `Nama aplikasi (${listingUtama.namaAplikasi.length} kar) melebihi batas Google Play & App Store (${this.BATAS_PLAY_NAMA} kar).`
          );
        }
        if (listingUtama.namaAplikasi.length > this.BATAS_IOS_NAMA) {
          daftarGalat.push(
            `Nama aplikasi (${listingUtama.namaAplikasi.length} kar) melebihi batas iOS App Store (${this.BATAS_IOS_NAMA} kar).`
          );
        }
        poin += 1;
      }

      // Subtitle iOS
      if (listingUtama.judulSubtitle && listingUtama.judulSubtitle.length > this.BATAS_IOS_SUBTITLE) {
        daftarGalat.push(
          `Subtitle iOS (${listingUtama.judulSubtitle.length} kar) melebihi batas (${this.BATAS_IOS_SUBTITLE} kar).`
        );
      }

      // Deskripsi Singkat Google Play
      if (!listingUtama.deskripsiSingkat || listingUtama.deskripsiSingkat.trim().length === 0) {
        pesanPeringatan.push('Deskripsi singkat Google Play belum diisi.');
      } else {
        if (listingUtama.deskripsiSingkat.length > this.BATAS_PLAY_DESKRIPSI_SINGKAT) {
          daftarGalat.push(
            `Deskripsi singkat Google Play (${listingUtama.deskripsiSingkat.length} kar) melebihi batas (${this.BATAS_PLAY_DESKRIPSI_SINGKAT} kar).`
          );
        }
        poin += 1;
      }

      // Deskripsi Lengkap
      if (!listingUtama.deskripsiLengkap || listingUtama.deskripsiLengkap.trim().length === 0) {
        daftarGalat.push('Deskripsi lengkap aplikasi wajib diisi.');
      } else {
        if (listingUtama.deskripsiLengkap.length > this.BATAS_PLAY_DESKRIPSI_LENGKAP) {
          daftarGalat.push(
            `Deskripsi lengkap (${listingUtama.deskripsiLengkap.length} kar) melebihi batas 4000 karakter.`
          );
        }
        if (listingUtama.deskripsiLengkap.length < 50) {
          pesanPeringatan.push('Deskripsi lengkap terlalu singkat (disarankan minimal 50 karakter).');
        }
        poin += 1;
      }

      // Kata Kunci iOS
      if (listingUtama.kataKunci && listingUtama.kataKunci.length > 0) {
        const strKataKunci = listingUtama.kataKunci.join(',');
        if (strKataKunci.length > this.BATAS_IOS_KATA_KUNCI) {
          daftarGalat.push(
            `Kata kunci iOS (${strKataKunci.length} kar) melebihi batas Apple (${this.BATAS_IOS_KATA_KUNCI} kar).`
          );
        }
        poin += 1;
      }

      // Catatan Rilis
      if (!listingUtama.catatanRilis || listingUtama.catatanRilis.trim().length === 0) {
        pesanPeringatan.push("Catatan rilis ('What's New') belum diisi untuk versi ini.");
      } else {
        if (listingUtama.catatanRilis.length > this.BATAS_CATATAN_RILIS) {
          pesanPeringatan.push(
            `Catatan rilis (${listingUtama.catatanRilis.length} kar) melebihi rekomendasi 500 karakter.`
          );
        }
        poin += 1;
      }
    }

    // 3. Validasi Kontak Pengembang
    if (!metadata.kontak.namaPengembang) {
      daftarGalat.push('Nama pengembang atau organisasi wajib diisi.');
    } else {
      poin += 1;
    }

    if (!metadata.kontak.emailDukungan || !metadata.kontak.emailDukungan.includes('@')) {
      daftarGalat.push('Email dukungan pengembang tidak valid.');
    } else {
      poin += 1;
    }

    // 4. Validasi Kebijakan Privasi
    if (!metadata.privasi.kebijakanUrl || !metadata.privasi.kebijakanUrl.startsWith('http')) {
      daftarGalat.push('URL Kebijakan Privasi (Privacy Policy) wajib diisi dengan protokol HTTP/HTTPS valid.');
    } else {
      poin += 1;
    }

    // Kebijakan penghapusan akun (Wajib Google Play & App Store 2024+)
    if (!metadata.privasi.mekanismePenghapusanAkun) {
      pesanPeringatan.push(
        'Jika aplikasi menyediakan pembuatan akun pengguna, Apple App Store dan Google Play mewajibkan opsi penghapusan akun di dalam aplikasi atau tautan web.'
      );
    }

    const skorKelengkapan = Math.round((poin / totalPoinMaks) * 100);

    return {
      valid: daftarGalat.length === 0,
      skorKelengkapan,
      daftarGalat,
      pesanPeringatan,
      rekomendasi,
    };
  }
}
