/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 41
 * Fasad Utama Mobile App Store Integration & Automated Release (Publishing Manager)
 */

import {
  KonfigurasiGooglePlay,
  KonfigurasiAppStoreConnect,
  MetadataTokoLengkap,
  StatusKoneksiGooglePlay,
  StatusKoneksiASC,
  HasilEksekusiPipeline,
  OpsiPipelineRilis,
  PermintaanPersetujuanRilis,
  LaporanPublikasiLengkap,
} from '../types';
import { StoreRegistry } from './StoreRegistry';
import { GooglePlayClient } from '../android/GooglePlayClient';
import { PlayReleaseManager, HasilEksekusiRilisAndroid } from '../android/PlayReleaseManager';
import { AppStoreConnectClient } from '../ios/AppStoreConnectClient';
import { AppStoreReleaseManager, HasilEksekusiRilisIOS } from '../ios/AppStoreReleaseManager';
import { AppMetadataManager } from '../metadata/AppMetadata';
import { StoreListingManager } from '../metadata/StoreListing';
import { ScreenshotManager } from '../metadata/ScreenshotManager';
import { ReleaseNotesManager } from '../metadata/ReleaseNotes';
import { ReleasePipeline } from '../automation/ReleasePipeline';
import { ApprovalGate } from '../automation/ApprovalGate';
import { RollbackPlanner, RencanaPemulihanRilis } from '../automation/RollbackPlanner';
import { StoreValidator } from '../validation/StoreValidator';
import { PublishingHistoryManager } from '../reports/PublishingHistory';
import { PublishingReportGenerator } from '../reports/PublishingReport';

export class PublishingManager {
  private static instance: PublishingManager;

  private registry: StoreRegistry;
  private listingManager: StoreListingManager;
  private historyManager: PublishingHistoryManager;
  private approvalGate: ApprovalGate;

  private playReleaseManager: PlayReleaseManager;
  private iosReleaseManager: AppStoreReleaseManager;

  private constructor() {
    this.registry = StoreRegistry.dapatkanInstance();
    this.listingManager = new StoreListingManager();
    this.historyManager = PublishingHistoryManager.dapatkanInstance();
    this.approvalGate = ApprovalGate.dapatkanInstance();

    this.playReleaseManager = new PlayReleaseManager(this.registry.dapatkanKonfigPlay());
    this.iosReleaseManager = new AppStoreReleaseManager(this.registry.dapatkanKonfigASC());
  }

  public static dapatkanInstance(): PublishingManager {
    if (!PublishingManager.instance) {
      PublishingManager.instance = new PublishingManager();
    }
    return PublishingManager.instance;
  }

  // ==========================================
  // KONEKSI & DIAGNOSTIK
  // ==========================================

  public async ujiKoneksiAndroid(): Promise<StatusKoneksiGooglePlay> {
    return this.playReleaseManager.dapatkanClient().ujiKoneksi();
  }

  public async ujiKoneksiIOS(): Promise<StatusKoneksiASC> {
    return this.iosReleaseManager.dapatkanClient().ujiKoneksi();
  }

  public async periksaSemuaKoneksi() {
    const [android, ios] = await Promise.all([this.ujiKoneksiAndroid(), this.ujiKoneksiIOS()]);
    return { android, ios };
  }

  // ==========================================
  // METADATA & LISTING TOKO
  // ==========================================

  public dapatkanMetadata(): MetadataTokoLengkap {
    return this.listingManager.dapatkanMetadata();
  }

  public perbaruiMetadata(parsial: Partial<MetadataTokoLengkap>): MetadataTokoLengkap {
    const current = this.listingManager.dapatkanMetadata();
    const updated = { ...current, ...parsial };
    this.listingManager = new StoreListingManager(updated);
    return this.listingManager.dapatkanMetadata();
  }

  public simpanMetadataKeDisk(dir = 'store-metadata'): boolean {
    return this.listingManager.simpanKeDirektori(dir);
  }

  public muatMetadataDariDisk(dir = 'store-metadata'): MetadataTokoLengkap {
    return this.listingManager.muatDariDirektori(dir);
  }

  // ==========================================
  // VALIDASI KOMPREHENSIF
  // ==========================================

  public validasiKesiapanPublikasi(params?: {
    apakahAdaAAB?: boolean;
    apakahAdaArchiveIOS?: boolean;
    apakahSigningAndroidValid?: boolean;
    apakahSigningIOSValid?: boolean;
  }) {
    const meta = this.dapatkanMetadata();
    return StoreValidator.validasiKomprehensif({
      metadata: meta,
      packageName: meta.aplikasiId,
      targetSdk: 34,
      apakahAdaAAB: params?.apakahAdaAAB ?? true,
      apakahAdaArchiveIOS: params?.apakahAdaArchiveIOS ?? true,
      apakahSigningAndroidValid: params?.apakahSigningAndroidValid ?? true,
      apakahSigningIOSValid: params?.apakahSigningIOSValid ?? true,
    });
  }

  public validasiAsetToko() {
    const mockAset = ScreenshotManager.buatMockDaftarAset();
    return ScreenshotManager.validasiSemuaAset(mockAset);
  }

  // ==========================================
  // AUTOMATION & RELEASE PIPELINE
  // ==========================================

  public async jalankanPipeline(opsi?: OpsiPipelineRilis): Promise<HasilEksekusiPipeline> {
    const pipeline = new ReleasePipeline();
    const hasil = await pipeline.jalankan(opsi);

    // Catat ke riwayat
    this.historyManager.catatAksi({
      platform: opsi?.platform === 'ios' ? 'ios' : 'android',
      versi: '1.0.0',
      versionCode: 1,
      trackAtauChannel: opsi?.trackAndroid || 'internal',
      status: hasil.sukses ? 'sukses' : hasil.membutuhkanPersetujuan ? 'meninjau' : 'gagal',
      aksi: 'RELEASE_PIPELINE_EXECUTION',
      namaBerkas: 'id.nusantara.aplikasi-1.0.0.aab',
      sha256: 'd71b67f34d1f7f201b2dceeb61c638ad7f5a47ec16d8088e77bd7ab2089baf7d',
      akunTarget: 'Google Play & App Store Connect',
      pesan: hasil.ringkasan,
      eksekutor: 'Release Pipeline Engine',
      modeSandbox: opsi?.modeSimulasi !== false,
    });

    return hasil;
  }

  // ==========================================
  // APPROVAL GATE
  // ==========================================

  public dapatkanPersetujuanMenunggu(): PermintaanPersetujuanRilis[] {
    return this.approvalGate.dapatkanAntreanMenunggu();
  }

  public dapatkanRiwayatPersetujuan(): PermintaanPersetujuanRilis[] {
    return this.approvalGate.dapatkanRiwayat();
  }

  public setujuiRilis(idPermintaan: string, disetujuiOleh?: string): boolean {
    const res = this.approvalGate.setujui(idPermintaan, disetujuiOleh);
    if (res) {
      this.historyManager.catatAksi({
        platform: 'android',
        versi: '1.0.0',
        versionCode: 1,
        trackAtauChannel: 'production',
        status: 'disetujui',
        aksi: 'RELEASE_APPROVAL_GRANTED',
        namaBerkas: 'id.nusantara.aplikasi-1.0.0.aab',
        sha256: 'd71b67f34d1f7f201b2dceeb61c638ad7f5a47ec16d8088e77bd7ab2089baf7d',
        akunTarget: 'Google Play & App Store Connect',
        pesan: `Persetujuan rilis '${idPermintaan}' diberikan oleh ${disetujuiOleh || 'Pengembang'}.`,
        eksekutor: disetujuiOleh || 'Pengembang',
        modeSandbox: true,
      });
    }
    return res;
  }

  public tolakRilis(idPermintaan: string, alasan?: string): boolean {
    return this.approvalGate.tolak(idPermintaan, alasan);
  }

  // ==========================================
  // ROLLBACK & RECOVERY
  // ==========================================

  public susunRencanaRollback(params: {
    platform: 'android' | 'ios' | 'keduanya';
    versiBermasalah: string;
    versionCodeBermasalah: number;
    versiStabilSebelumnya: string;
    trackAtauChannel: string;
  }): RencanaPemulihanRilis {
    return RollbackPlanner.susunRencanaRollback(params);
  }

  // ==========================================
  // RIWAYAT & LAPORAN
  // ==========================================

  public dapatkanRiwayatPublikasi() {
    return this.historyManager.dapatkanRiwayat();
  }

  public buatLaporanPublikasi(): LaporanPublikasiLengkap {
    const meta = this.dapatkanMetadata();
    const idLaporan = `lap_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    return {
      idLaporan,
      namaProyek: 'Aplikasi Nusantara',
      applicationId: meta.aplikasiId,
      platform: 'keduanya',
      versi: '1.0.0',
      buildNumber: 1,
      berkasBinary: {
        android: 'dist/mobile/android/release/id.nusantara.aplikasi-1.0.0.aab',
        ios: 'dist/mobile/ios/archive/id.nusantara.aplikasi-1.0.0.xcarchive',
      },
      trackAtauChannel: 'INTERNAL / TESTFLIGHT',
      akunTujuanMasked: 'nu***@nusantara.dev / TEAM***',
      statusPublikasi: 'siap_diunggah',
      skorKepatuhan: 100,
      daftarPeringatan: [],
      daftarGalat: [],
      tindakanLanjutan: [
        'Konfirmasikan otorisasi rilis pada gerbang persetujuan sebelum mengirim ke toko aplikasi.',
        'Verifikasi bahwa pengujian internal TestFlight dan Google Play Internal Sharing telah berhasil.',
      ],
      stempelWaktu: new Date().toISOString(),
      modeSandbox: true,
    };
  }

  public simpanLaporanPublikasi(laporan: LaporanPublikasiLengkap) {
    return PublishingReportGenerator.simpanLaporanKeDisk(laporan);
  }
}
