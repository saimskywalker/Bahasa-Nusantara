/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 41
 * Manajer Rilis Android Terpadu (Android Play Release Manager)
 */

import {
  KonfigurasiGooglePlay,
  GooglePlayTrack,
  HasilUploadPlay,
  InfoRilisTrackPlay,
} from '../types';
import { GooglePlayClient } from './GooglePlayClient';
import { PlayTrackManager } from './PlayTrackManager';
import { PlayListingManager } from './PlayListingManager';
import { PlayValidation } from './PlayValidation';

export interface OpsiRilisAndroidLengkap {
  jalurAab: string;
  packageName: string;
  versionCode: number;
  versiSemantik: string;
  targetSdk: number;
  track: GooglePlayTrack;
  sha256: string;
  ukuranBytes: number;
  catatanRilis?: Record<string, string>;
  userFraction?: number;
  modeSimulasi?: boolean;
}

export interface HasilEksekusiRilisAndroid {
  sukses: boolean;
  track: GooglePlayTrack;
  versionCode: number;
  hasilUpload?: HasilUploadPlay;
  infoTrack?: InfoRilisTrackPlay;
  pesan: string;
  daftarGalat: string[];
  daftarPeringatan: string[];
}

export class PlayReleaseManager {
  private client: GooglePlayClient;
  private trackManager: PlayTrackManager;
  private listingManager: PlayListingManager;

  constructor(konfig: KonfigurasiGooglePlay) {
    this.client = new GooglePlayClient(konfig);
    this.trackManager = new PlayTrackManager(this.client);
    this.listingManager = new PlayListingManager(this.client);
  }

  public dapatkanClient(): GooglePlayClient {
    return this.client;
  }

  public dapatkanTrackManager(): PlayTrackManager {
    return this.trackManager;
  }

  public dapatkanListingManager(): PlayListingManager {
    return this.listingManager;
  }

  /**
   * Menjalankan validasi dan proses publikasi rilis Android.
   */
  public async eksekusiRilis(opsi: OpsiRilisAndroidLengkap): Promise<HasilEksekusiRilisAndroid> {
    const daftarGalat: string[] = [];
    const daftarPeringatan: string[] = [];

    // 1. Validasi Kelayakan Google Play
    const val = PlayValidation.validasiKelayakan({
      packageName: opsi.packageName,
      versionCode: opsi.versionCode,
      targetSdk: opsi.targetSdk,
      track: opsi.track,
      namaBerkasAAB: opsi.jalurAab,
      ukuranAabBytes: opsi.ukuranBytes,
    });

    daftarGalat.push(...val.daftarGalat);
    daftarPeringatan.push(...val.pesanPeringatan);

    if (!val.valid) {
      return {
        sukses: false,
        track: opsi.track,
        versionCode: opsi.versionCode,
        pesan: `Validasi Google Play gagal: ${val.daftarGalat[0]}`,
        daftarGalat,
        daftarPeringatan,
      };
    }

    const modeSimulasi = opsi.modeSimulasi !== false;

    // 2. Upload AAB
    const hasilUpload = await this.client.unggahAAB(
      opsi.jalurAab,
      opsi.versionCode,
      opsi.sha256,
      opsi.ukuranBytes,
      opsi.track,
      modeSimulasi
    );

    if (!hasilUpload.sukses) {
      daftarGalat.push(hasilUpload.pesan);
      return {
        sukses: false,
        track: opsi.track,
        versionCode: opsi.versionCode,
        hasilUpload,
        pesan: 'Unggah berkas AAB ke Google Play mengalami kegagalan.',
        daftarGalat,
        daftarPeringatan,
      };
    }

    // 3. Tetapkan ke Track
    const resTrack = await this.trackManager.tetapkanRilisTrack({
      track: opsi.track,
      versionCode: opsi.versionCode,
      userFraction: opsi.userFraction,
      releaseNotes: opsi.catatanRilis,
    });

    // 4. Commit Edit Transaksi
    await this.client.commitEdit(modeSimulasi);

    return {
      sukses: true,
      track: opsi.track,
      versionCode: opsi.versionCode,
      hasilUpload,
      infoTrack: resTrack.rilis,
      pesan: `Rilis Android berhasil disiapkan pada track '${opsi.track.toUpperCase()}' (v${opsi.versiSemantik}, code: ${opsi.versionCode}).`,
      daftarGalat,
      daftarPeringatan,
    };
  }
}
