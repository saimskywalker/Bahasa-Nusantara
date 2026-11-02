/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 39
 * Lapisan Keamanan Mobile & Redaksi Rahasia (Cloud Security Layer)
 */

export class LapisanKeamananMobile {
  private static readonly POLA_SENSITIF = [
    /password/i,
    /sandi/i,
    /token/i,
    /secret/i,
    /authorization/i,
    /kunci/i,
    /api[-_]?key/i,
    /bearer/i,
    /refresh/i,
  ];

  /**
   * Sensor nilai rahasia dalam header atau objek data sebelum dicetak ke log
   */
  public static redaksiHeader(headers: Record<string, string>): Record<string, string> {
    const hasil: Record<string, string> = {};
    for (const [kunci, nilai] of Object.entries(headers)) {
      if (this.apakahSensitif(kunci)) {
        hasil[kunci] = this.maskingNilai(nilai);
      } else {
        hasil[kunci] = nilai;
      }
    }
    return hasil;
  }

  /**
   * Sensor data sensitif dalam objek atau kamus
   */
  public static redaksiData(data: any): any {
    if (data === null || data === undefined) return data;
    if (typeof data === 'string') {
      return data;
    }
    if (Array.isArray(data)) {
      return data.map((item) => this.redaksiData(item));
    }
    if (typeof data === 'object') {
      const tersensor: Record<string, any> = {};
      for (const [k, v] of Object.entries(data)) {
        if (this.apakahSensitif(k) && typeof v === 'string') {
          tersensor[k] = this.maskingNilai(v);
        } else {
          tersensor[k] = this.redaksiData(v);
        }
      }
      return tersensor;
    }
    return data;
  }

  /**
   * Memeriksa apakah nama kunci merupakan parameter sensitif
   */
  public static apakahSensitif(kunci: string): boolean {
    return this.POLA_SENSITIF.some((pola) => pola.test(kunci));
  }

  /**
   * Menutupi sebagian besar karakter sensitif
   */
  public static maskingNilai(nilai: string): string {
    if (!nilai) return '';
    if (nilai.length <= 6) return '******';
    const depan = nilai.substring(0, 3);
    const belakang = nilai.substring(nilai.length - 3);
    return `${depan}...***...${belakang}`;
  }

  /**
   * Memvalidasi apakah URL aman untuk lingkungan produksi
   */
  public static validasiUrlAman(url: string, lingkungan: 'pengembangan' | 'staging' | 'produksi' = 'produksi'): { valid: boolean; pesan?: string } {
    if (!url || typeof url !== 'string') {
      return { valid: false, pesan: 'URL tidak boleh kosong.' };
    }

    try {
      const parsed = new URL(url);
      if (lingkungan === 'produksi' && parsed.protocol !== 'https:') {
        return {
          valid: false,
          pesan: `Protokol tidak aman: '${parsed.protocol}'. Lingkungan produksi mewajibkan HTTPS dengan validasi sertifikat TLS.`,
        };
      }
      return { valid: true };
    } catch {
      return { valid: false, pesan: `Format URL tidak valid: '${url}'` };
    }
  }

  /**
   * Mencegah upaya pengembang klien menginjeksikan role atau hak akses lokal
   */
  public static periksaKlaimKlien(data: Record<string, any>): { aman: boolean; peringatan?: string } {
    const klaimIlegal = ['peran', 'role', 'is_admin', 'hak_akses', 'sudo', 'superadmin'];
    for (const k of klaimIlegal) {
      if (k in data) {
        return {
          aman: false,
          peringatan: `Peringatan Keamanan: Klien mencoba menentukan klaim '${k}' secara langsung. Otorisasi peran wajib diverifikasi di sisi server.`,
        };
      }
    }
    return { aman: true };
  }

  /**
   * Membersihkan nama berkas dari upaya manipulasi path traversal
   */
  public static amankanNamaBerkas(nama: string): string {
    return nama.replace(/\.\./g, '').replace(/[\\/]/g, '_').trim();
  }
}
