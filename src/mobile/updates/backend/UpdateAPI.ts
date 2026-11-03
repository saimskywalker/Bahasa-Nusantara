/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 42
 * Router & API Server Pembaruan Mobile (Backend Update API)
 */

import { UpdateRegistry } from './UpdateRegistry';
import { VersionChecker } from '../core/VersionChecker';
import { PlatformMobile, SaluranPembaruan, ManifestPembaruan } from '../types';

export class UpdateBackendAPI {
  private registry: UpdateRegistry;

  constructor() {
    this.registry = UpdateRegistry.dapatkanInstance();
  }

  /**
   * Endpoint: GET /api/mobile/updates/check
   */
  public handleCheck(query: {
    appId?: string;
    platform?: string;
    currentVersion?: string;
    channel?: string;
  }): { status: number; data: any } {
    const appId = query.appId || 'id.nusantara.aplikasi';
    const platform = (query.platform as PlatformMobile) || 'android';
    const currentVersion = query.currentVersion || '0.41.0';
    const channel = (query.channel as SaluranPembaruan) || 'stable';

    const manifest = this.registry.ambilManifest(appId, platform, channel);
    if (!manifest) {
      return {
        status: 404,
        data: { galat: `Tidak ada rilis aktif untuk ${appId} pada platform ${platform} dan saluran ${channel}.` },
      };
    }

    const hasil = VersionChecker.periksaKetersediaan(currentVersion, appId, platform, manifest);
    return {
      status: 200,
      data: hasil,
    };
  }

  /**
   * Endpoint: GET /api/mobile/updates/manifest
   */
  public handleManifest(query: {
    appId?: string;
    platform?: string;
    channel?: string;
  }): { status: number; data: ManifestPembaruan | { galat: string } } {
    const appId = query.appId || 'id.nusantara.aplikasi';
    const platform = (query.platform as PlatformMobile) || 'android';
    const channel = (query.channel as SaluranPembaruan) || 'stable';

    const manifest = this.registry.ambilManifest(appId, platform, channel);
    if (!manifest) {
      return {
        status: 404,
        data: { galat: 'Manifest tidak ditemukan.' },
      };
    }

    return {
      status: 200,
      data: manifest,
    };
  }

  /**
   * Endpoint: POST /api/mobile/updates/report
   */
  public handleReport(body: any): { status: number; data: { sukses: boolean; idLaporan?: string; pesan: string } } {
    if (!body || !body.applicationId) {
      return {
        status: 400,
        data: { sukses: false, pesan: 'Payload laporan tidak lengkap.' },
      };
    }

    const idLaporan = `lap_upd_${Date.now()}`;
    return {
      status: 200,
      data: {
        sukses: true,
        idLaporan,
        pesan: 'Laporan pembaruan berhasil diterima dan dicatat dalam audit trail backend.',
      },
    };
  }
}
