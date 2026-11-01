/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 37
 * Abstraksi Penyimpanan Aman Mobile (Mobile Secure Storage / Keychain / Keystore)
 */

import * as crypto from 'node:crypto';

export class PenyimpananAmanMobile {
  private static defaultInstance: PenyimpananAmanMobile = new PenyimpananAmanMobile();
  private penyimpanan: Map<string, string> = new Map();
  private readonly kunciEnkripsiInternal: Buffer;

  public static simpan(kunci: string, nilai: string): boolean {
    const cipherText = PenyimpananAmanMobile.defaultInstance.enkripsi(nilai);
    PenyimpananAmanMobile.defaultInstance.penyimpanan.set(kunci, cipherText);
    return true;
  }

  public static ambil(kunci: string): string | null {
    const cipherText = PenyimpananAmanMobile.defaultInstance.penyimpanan.get(kunci);
    if (!cipherText) return null;
    try {
      return PenyimpananAmanMobile.defaultInstance.dekripsi(cipherText);
    } catch {
      return null;
    }
  }

  public static hapus(kunci: string): boolean {
    return PenyimpananAmanMobile.defaultInstance.penyimpanan.delete(kunci);
  }

  public static memiliki(kunci: string): boolean {
    return PenyimpananAmanMobile.defaultInstance.penyimpanan.has(kunci);
  }

  constructor(frasaKunci: string = 'nusantara-mobile-keystore-salt') {
    this.kunciEnkripsiInternal = crypto.scryptSync(frasaKunci, 'garam_keystore_nusantara', 32);
  }

  private enkripsi(teksPolos: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.kunciEnkripsiInternal, iv);
    let terenkripsi = cipher.update(teksPolos, 'utf8', 'hex');
    terenkripsi += cipher.final('hex');
    return `${iv.toString('hex')}:${terenkripsi}`;
  }

  private dekripsi(dataTerenkripsi: string): string {
    const [ivHex, kontenHex] = dataTerenkripsi.split(':');
    if (!ivHex || !kontenHex) throw new Error('Data penyimpanan aman rusak');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.kunciEnkripsiInternal, iv);
    let didekripsi = decipher.update(kontenHex, 'hex', 'utf8');
    didekripsi += decipher.final('utf8');
    return didekripsi;
  }

  public async simpan(kunci: string, nilai: string): Promise<void> {
    const cipherText = this.enkripsi(nilai);
    this.penyimpanan.set(kunci, cipherText);
  }

  public async ambil(kunci: string): Promise<string | null> {
    const cipherText = this.penyimpanan.get(kunci);
    if (!cipherText) return null;
    try {
      return this.dekripsi(cipherText);
    } catch {
      return null;
    }
  }

  public async hapus(kunci: string): Promise<boolean> {
    return this.penyimpanan.delete(kunci);
  }

  public async apakahAda(kunci: string): Promise<boolean> {
    return this.penyimpanan.has(kunci);
  }

  public async bersihkan(): Promise<void> {
    this.penyimpanan.clear();
  }
}
