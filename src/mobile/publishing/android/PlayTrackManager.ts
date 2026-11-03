/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 41
 * Pengelola Release Track Google Play (Play Track Manager)
 */

import { GooglePlayTrack, InfoRilisTrackPlay, StatusRilisPlay } from '../types';
import { GooglePlayClient } from './GooglePlayClient';

export class PlayTrackManager {
  private client: GooglePlayClient;
  private trackCache: Map<GooglePlayTrack, InfoRilisTrackPlay> = new Map();

  constructor(client: GooglePlayClient) {
    this.client = client;
    this.inisialisasiDefaultTracks();
  }

  private inisialisasiDefaultTracks(): void {
    const tracks: GooglePlayTrack[] = ['internal', 'closed', 'open', 'production'];
    for (const t of tracks) {
      this.trackCache.set(t, {
        track: t,
        name: `Track ${t.toUpperCase()}`,
        versionCodes: [1],
        status: 'completed',
        releaseNotes: {
          id: 'Rilis stabil versi awal.',
          en: 'Initial stable release.',
        },
        updateTime: new Date().toISOString(),
      });
    }
  }

  public async dapatkanSemuaTrack(): Promise<InfoRilisTrackPlay[]> {
    return Array.from(this.trackCache.values());
  }

  public async dapatkanInfoTrack(track: GooglePlayTrack): Promise<InfoRilisTrackPlay> {
    if (!this.trackCache.has(track)) {
      const data = await this.client.dapatkanStatusTrack(track);
      this.trackCache.set(track, data);
    }
    return this.trackCache.get(track)!;
  }

  /**
   * Menetapkan rilis ke track Google Play dengan konfigurasi rollout bertahap jika ditentukan.
   */
  public async tetapkanRilisTrack(opsi: {
    track: GooglePlayTrack;
    versionCode: number;
    status?: StatusRilisPlay;
    userFraction?: number; // 0.1 s/d 1.0 (10% s/d 100%)
    releaseNotes?: Record<string, string>;
  }): Promise<{ sukses: boolean; rilis: InfoRilisTrackPlay; pesan: string }> {
    const existing = await this.dapatkanInfoTrack(opsi.track);

    const versionCodes = Array.from(new Set([opsi.versionCode, ...existing.versionCodes]));
    const status = opsi.status || (opsi.track === 'production' && opsi.userFraction && opsi.userFraction < 1 ? 'inProgress' : 'completed');

    const updated: InfoRilisTrackPlay = {
      ...existing,
      versionCodes,
      status,
      userFraction: opsi.userFraction || 1.0,
      releaseNotes: opsi.releaseNotes || existing.releaseNotes,
      updateTime: new Date().toISOString(),
    };

    this.trackCache.set(opsi.track, updated);

    return {
      sukses: true,
      rilis: updated,
      pesan: `Track '${opsi.track}' berhasil diperbarui dengan versionCode: ${opsi.versionCode} (Status: ${status}).`,
    };
  }

  /**
   * Mempromosikan build dari track pengujian (misal: internal) ke track produksi atau open testing.
   */
  public async promosikanBuild(
    dariTrack: GooglePlayTrack,
    keTrack: GooglePlayTrack,
    versionCode: number
  ): Promise<{ sukses: boolean; pesan: string }> {
    const sumber = await this.dapatkanInfoTrack(dariTrack);
    if (!sumber.versionCodes.includes(versionCode)) {
      return {
        sukses: false,
        pesan: `versionCode '${versionCode}' tidak ditemukan pada track sumber '${dariTrack}'.`,
      };
    }

    await this.tetapkanRilisTrack({
      track: keTrack,
      versionCode,
      releaseNotes: sumber.releaseNotes,
    });

    return {
      sukses: true,
      pesan: `Build '${versionCode}' berhasil dipromosikan dari '${dariTrack}' ke '${keTrack}'.`,
    };
  }
}
