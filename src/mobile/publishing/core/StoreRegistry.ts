/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 41
 * Registri Toko Aplikasi & Lingkungan Distribusi (Store Registry)
 */

import { KonfigurasiGooglePlay, KonfigurasiAppStoreConnect } from '../types';

export class StoreRegistry {
  private static instance: StoreRegistry;
  private konfigGooglePlay: KonfigurasiGooglePlay;
  private konfigAppStoreConnect: KonfigurasiAppStoreConnect;

  private constructor() {
    this.konfigGooglePlay = {
      applicationId: 'id.nusantara.aplikasi',
      packageName: 'id.nusantara.aplikasi',
      defaultTrack: 'internal',
      autoCommitEdit: false,
      userFraction: 1.0,
      serviceAccountKeyEnv: 'GOOGLE_PLAY_KEY_JSON',
    };

    this.konfigAppStoreConnect = {
      bundleId: 'id.nusantara.aplikasi',
      defaultChannel: 'testflight',
      privateKeyEnv: 'APP_STORE_CONNECT_PRIVATE_KEY',
    };
  }

  public static dapatkanInstance(): StoreRegistry {
    if (!StoreRegistry.instance) {
      StoreRegistry.instance = new StoreRegistry();
    }
    return StoreRegistry.instance;
  }

  public dapatkanKonfigPlay(): KonfigurasiGooglePlay {
    return { ...this.konfigGooglePlay };
  }

  public setKonfigPlay(parsial: Partial<KonfigurasiGooglePlay>): KonfigurasiGooglePlay {
    this.konfigGooglePlay = {
      ...this.konfigGooglePlay,
      ...parsial,
    };
    return this.dapatkanKonfigPlay();
  }

  public dapatkanKonfigASC(): KonfigurasiAppStoreConnect {
    return { ...this.konfigAppStoreConnect };
  }

  public setKonfigASC(parsial: Partial<KonfigurasiAppStoreConnect>): KonfigurasiAppStoreConnect {
    this.konfigAppStoreConnect = {
      ...this.konfigAppStoreConnect,
      ...parsial,
    };
    return this.dapatkanKonfigASC();
  }
}
