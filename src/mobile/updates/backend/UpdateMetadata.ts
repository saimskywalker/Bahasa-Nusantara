/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 42
 * Pengelola Metadata & Catatan Rilis Server Backend (Update Metadata)
 */

export interface MetadataAplikasiBackend {
  applicationId: string;
  nama: string;
  versiAktif: string;
  versiMinimum: string;
  saluranTersedia: string[];
  catatanPerubahan: Record<string, string>;
}

export class UpdateMetadataManager {
  private static instance: UpdateMetadataManager;
  private apps: Map<string, MetadataAplikasiBackend> = new Map();

  private constructor() {
    this.apps.set('id.nusantara.aplikasi', {
      applicationId: 'id.nusantara.aplikasi',
      nama: 'Aplikasi Nusantara Resmi',
      versiAktif: '1.2.0',
      versiMinimum: '1.0.0',
      saluranTersedia: ['stable', 'testing', 'beta', 'alpha', 'development'],
      catatanPerubahan: {
        '1.2.0': 'Pembaruan tema visual Garuda Dark dan perbaikan performa sistem lokalisasi.',
        '1.1.0': 'Integrasi App Store Connect dan perbaikan bug notifikasi.',
        '1.0.0': 'Rilis perdana aplikasi mobile ditenagai bahasa NUSANTARA.',
      },
    });
  }

  public static dapatkanInstance(): UpdateMetadataManager {
    if (!UpdateMetadataManager.instance) {
      UpdateMetadataManager.instance = new UpdateMetadataManager();
    }
    return UpdateMetadataManager.instance;
  }

  public dapatkanMetadata(appId: string): MetadataAplikasiBackend | undefined {
    return this.apps.get(appId);
  }

  public perbaruiVersiMinimum(appId: string, versiBaru: string): boolean {
    const a = this.apps.get(appId);
    if (a) {
      a.versiMinimum = versiBaru;
      return true;
    }
    return false;
  }
}
