/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 42
 * Pengelola Konten & Tema Dinamis OTA (OTA Content Manager)
 */

import { ActivationManager } from './ActivationManager';

export interface TemaDinamis {
  id?: string;
  nama: string;
  mode?: 'terang' | 'gelap';
  warnaPrimer?: string;
  warnaAksen?: string;
  warnaLatar?: string;
}

export class OTAContentManager {
  private static instance: OTAContentManager;
  private activationManager: ActivationManager;

  private constructor() {
    this.activationManager = ActivationManager.dapatkanInstance();
  }

  public static dapatkanInstance(): OTAContentManager {
    if (!OTAContentManager.instance) {
      OTAContentManager.instance = new OTAContentManager();
    }
    return OTAContentManager.instance;
  }

  /**
   * Mengambil tema visual aktif yang diperbarui lewat OTA.
   */
  public dapatkanTemaAktif(jalur = 'themes/default.json'): TemaDinamis {
    const raw = this.activationManager.bacaResource(jalur);
    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw);
      } catch {
        // Fallback
      }
    }
    return {
      nama: 'Tema Bawaan Nusantara',
      mode: 'gelap',
      warnaPrimer: '#0284c7',
      warnaAksen: '#10b981',
      warnaLatar: '#0f172a',
    };
  }

  /**
   * Mengambil terjemahan lokalisasi aktif dari OTA.
   */
  public dapatkanKatalogBahasa(locale = 'id'): Record<string, string> {
    const jalur = `locales/${locale}.json`;
    const raw = this.activationManager.bacaResource(jalur);
    if (typeof raw === 'string') {
      try {
        const obj = JSON.parse(raw);
        return obj.terjemahan || obj;
      } catch {
        // Fallback
      }
    }
    return {
      sambutan: 'Selamat datang di Nusantara Mobile',
      tombolLanjut: 'Lanjutkan',
    };
  }

  /**
   * Mengambil konten data konfigurasi dinamis.
   */
  public dapatkanKonfigurasiDinamis(kunci: string): any {
    const raw = this.activationManager.bacaResource(`config/${kunci}.json`);
    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
    return null;
  }
}
