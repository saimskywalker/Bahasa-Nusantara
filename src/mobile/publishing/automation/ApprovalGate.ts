/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 41
 * Gerbang Persetujuan Rilis (Release Approval Gate & Workflow)
 */

import { PermintaanPersetujuanRilis, TipeAksiPersetujuan } from '../types';

export class ApprovalGate {
  private static instance: ApprovalGate;
  private antreanPersetujuan: Map<string, PermintaanPersetujuanRilis> = new Map();
  private riwayatKeputusan: PermintaanPersetujuanRilis[] = [];

  private constructor() {}

  public static dapatkanInstance(): ApprovalGate {
    if (!ApprovalGate.instance) {
      ApprovalGate.instance = new ApprovalGate();
    }
    return ApprovalGate.instance;
  }

  /**
   * Membuat permintaan persetujuan baru sebelum tindakan berdampak rilis dijalankan.
   */
  public buatPermintaan(params: {
    tipeAksi: TipeAksiPersetujuan;
    namaAplikasi: string;
    platform: 'android' | 'ios';
    versi: string;
    versionCodeAtauBuild: number;
    trackAtauChannel: string;
    berkasBinary: string;
    ukuranBinaryKb: number;
    sha256Binary: string;
    tujuanDistribusi: string;
    dampakTindakan: string;
    akunTokoTujuan: string;
    metadataBerubah?: Record<string, string>;
  }): PermintaanPersetujuanRilis {
    const id = `appr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const permintaan: PermintaanPersetujuanRilis = {
      id,
      tipeAksi: params.tipeAksi,
      namaAplikasi: params.namaAplikasi,
      platform: params.platform,
      versi: params.versi,
      versionCodeAtauBuild: params.versionCodeAtauBuild,
      trackAtauChannel: params.trackAtauChannel,
      berkasBinary: params.berkasBinary,
      ukuranBinaryKb: params.ukuranBinaryKb,
      sha256Binary: params.sha256Binary,
      tujuanDistribusi: params.tujuanDistribusi,
      dampakTindakan: params.dampakTindakan,
      akunTokoTujuan: params.akunTokoTujuan,
      metadataBerubah: params.metadataBerubah || {},
      tanggalDibuat: new Date().toISOString(),
      status: 'menunggu',
    };

    this.antreanPersetujuan.set(id, permintaan);
    return permintaan;
  }

  /**
   * Memberikan persetujuan eksplisit untuk suatu aksi rilis.
   */
  public setujui(idPermintaan: string, disetujuiOleh: string = 'Pengembang Utama'): boolean {
    const permintaan = this.antreanPersetujuan.get(idPermintaan);
    if (!permintaan || permintaan.status !== 'menunggu') return false;

    permintaan.status = 'disetujui';
    permintaan.disetujuiOleh = disetujuiOleh;
    permintaan.waktuKeputusan = new Date().toISOString();

    this.antreanPersetujuan.delete(idPermintaan);
    this.riwayatKeputusan.unshift(permintaan);
    return true;
  }

  /**
   * Menolak permintaan publikasi rilis dengan alasan yang dicatat.
   */
  public tolak(idPermintaan: string, alasan: string = 'Dibatalkan oleh pengguna'): boolean {
    const permintaan = this.antreanPersetujuan.get(idPermintaan);
    if (!permintaan || permintaan.status !== 'menunggu') return false;

    permintaan.status = 'ditolak';
    permintaan.catatanPenolakan = alasan;
    permintaan.waktuKeputusan = new Date().toISOString();

    this.antreanPersetujuan.delete(idPermintaan);
    this.riwayatKeputusan.unshift(permintaan);
    return true;
  }

  public dapatkanPermintaan(id: string): PermintaanPersetujuanRilis | undefined {
    return this.antreanPersetujuan.get(id);
  }

  public dapatkanAntreanMenunggu(): PermintaanPersetujuanRilis[] {
    return Array.from(this.antreanPersetujuan.values());
  }

  public dapatkanRiwayat(): PermintaanPersetujuanRilis[] {
    return [...this.riwayatKeputusan];
  }

  /**
   * Format teks ringkasan persetujuan untuk ditampilkan di terminal atau modal dialog.
   */
  public formatRingkasanTeks(p: PermintaanPersetujuanRilis): string {
    return (
      '======================================================\n' +
      `  PERSETUJUAN PUBLIKASI RILIS (${p.platform.toUpperCase()})\n` +
      '======================================================\n' +
      `ID Permintaan  : ${p.id}\n` +
      `Aplikasi       : ${p.namaAplikasi} (${p.platform.toUpperCase()})\n` +
      `Versi Target   : v${p.versi} (Build / Code: ${p.versionCodeAtauBuild})\n` +
      `Track / Saluran: ${p.trackAtauChannel.toUpperCase()}\n` +
      `Berkas Binary  : ${p.berkasBinary} (${p.ukuranBinaryKb.toFixed(1)} KB)\n` +
      `SHA-256        : ${p.sha256Binary}\n` +
      `Akun Tujuan    : ${p.akunTokoTujuan}\n` +
      `Dampak         : ${p.dampakTindakan}\n` +
      '------------------------------------------------------\n' +
      'PERINGATAN: Tindakan ini memerlukan otorisasi eksplisit.\n' +
      'Persetujuan ini HANYA berlaku untuk rilis ini saja.\n' +
      '======================================================'
    );
  }
}
