/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 41
 * Manajer Rilis Apple App Store (App Store Release Manager)
 */

import { KonfigurasiAppStoreConnect, HasilUploadASC } from '../types';
import { AppStoreConnectClient } from './AppStoreConnectClient';
import { TestFlightManager } from './TestFlightManager';
import { IOSValidation } from './IOSValidation';

export interface OpsiRilisIOSLengkap {
  jalurArchive: string;
  bundleId: string;
  versiSemantik: string;
  buildNumber: number;
  deploymentTarget?: string;
  sha256: string;
  ukuranBytes: number;
  catatanRilis?: Record<string, string>;
  saluran: 'testflight' | 'appstore';
  modeSimulasi?: boolean;
}

export interface HasilEksekusiRilisIOS {
  sukses: boolean;
  saluran: 'testflight' | 'appstore';
  versi: string;
  buildNumber: number;
  hasilUpload?: HasilUploadASC;
  pesan: string;
  daftarGalat: string[];
  daftarPeringatan: string[];
}

export class AppStoreReleaseManager {
  private client: AppStoreConnectClient;
  private testFlightManager: TestFlightManager;

  constructor(konfig: KonfigurasiAppStoreConnect) {
    this.client = new AppStoreConnectClient(konfig);
    this.testFlightManager = new TestFlightManager(this.client);
  }

  public dapatkanClient(): AppStoreConnectClient {
    return this.client;
  }

  public dapatkanTestFlightManager(): TestFlightManager {
    return this.testFlightManager;
  }

  /**
   * Menjalankan validasi dan proses persiapan rilis Apple iOS.
   */
  public async eksekusiRilis(opsi: OpsiRilisIOSLengkap): Promise<HasilEksekusiRilisIOS> {
    const daftarGalat: string[] = [];
    const daftarPeringatan: string[] = [];

    // 1. Validasi Kelayakan iOS
    const val = IOSValidation.validasiKelayakan({
      bundleId: opsi.bundleId,
      version: opsi.versiSemantik,
      buildNumber: opsi.buildNumber,
      deploymentTarget: opsi.deploymentTarget,
      namaBerkasArchive: opsi.jalurArchive,
    });

    daftarGalat.push(...val.daftarGalat);
    daftarPeringatan.push(...val.pesanPeringatan);

    if (!val.valid) {
      return {
        sukses: false,
        saluran: opsi.saluran,
        versi: opsi.versiSemantik,
        buildNumber: opsi.buildNumber,
        pesan: `Validasi Apple App Store gagal: ${val.daftarGalat[0]}`,
        daftarGalat,
        daftarPeringatan,
      };
    }

    const modeSimulasi = opsi.modeSimulasi !== false;

    // 2. Upload Binary ke App Store Connect
    const hasilUpload = await this.client.unggahBuild(
      opsi.jalurArchive,
      opsi.versiSemantik,
      opsi.buildNumber,
      opsi.ukuranBytes,
      opsi.sha256,
      modeSimulasi
    );

    if (!hasilUpload.sukses) {
      daftarGalat.push(hasilUpload.pesan);
      return {
        sukses: false,
        saluran: opsi.saluran,
        versi: opsi.versiSemantik,
        buildNumber: opsi.buildNumber,
        hasilUpload,
        pesan: 'Unggah berkas iOS ke App Store Connect mengalami kegagalan.',
        daftarGalat,
        daftarPeringatan,
      };
    }

    // 3. Konfigurasi TestFlight jika ditargetkan
    if (opsi.saluran === 'testflight') {
      await this.testFlightManager.siapkanRilisBeta({
        buildVersion: opsi.versiSemantik,
        buildNumber: opsi.buildNumber,
        catatanBeta: opsi.catatanRilis || { id: 'Build pengujian beta terbaru.' },
      });
    }

    return {
      sukses: true,
      saluran: opsi.saluran,
      versi: opsi.versiSemantik,
      buildNumber: opsi.buildNumber,
      hasilUpload,
      pesan: `Build iOS v${opsi.versiSemantik} (#${opsi.buildNumber}) berhasil dipersiapkan untuk saluran '${opsi.saluran.toUpperCase()}'.`,
      daftarGalat,
      daftarPeringatan,
    };
  }
}
