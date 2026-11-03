/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 42
 * Pengelola Saluran Rilis Pembaruan (Update Channel Manager)
 */

import { SaluranPembaruan } from '../types';

export interface InfoSaluranPembaruan {
  saluran: SaluranPembaruan;
  namaTampilan: string;
  deskripsi: string;
  tingkatStabilitas: 'sangat_stabil' | 'stabil' | 'sedang' | 'eksperimental' | 'tidak_stabil';
  publik: boolean;
}

export class UpdateChannelManager {
  private saluranAktif: SaluranPembaruan = 'stable';

  private static readonly DAFTAR_SALURAN: Record<SaluranPembaruan, InfoSaluranPembaruan> = {
    stable: {
      saluran: 'stable',
      namaTampilan: 'Stabil (Produksi)',
      deskripsi: 'Saluran resmi teruji untuk seluruh pengguna publik aplikasi.',
      tingkatStabilitas: 'sangat_stabil',
      publik: true,
    },
    testing: {
      saluran: 'testing',
      namaTampilan: 'Pengujian (Open Beta)',
      deskripsi: 'Saluran pra-rilis untuk pengujian fitur baru oleh komunitas pengguna umum.',
      tingkatStabilitas: 'stabil',
      publik: true,
    },
    beta: {
      saluran: 'beta',
      namaTampilan: 'Beta (Closed Testing)',
      deskripsi: 'Saluran rilis beta terbatas untuk pengujian terundang dan penemuan regresi.',
      tingkatStabilitas: 'sedang',
      publik: false,
    },
    alpha: {
      saluran: 'alpha',
      namaTampilan: 'Alpha (Internal QA)',
      deskripsi: 'Saluran pengembangan cepat khusus tim internal QA dan pengembang inti.',
      tingkatStabilitas: 'eksperimental',
      publik: false,
    },
    development: {
      saluran: 'development',
      namaTampilan: 'Pengembangan (Bleeding Edge)',
      deskripsi: 'Saluran khusus eksperimen arsitektur aktif langsung dari branch utama.',
      tingkatStabilitas: 'tidak_stabil',
      publik: false,
    },
  };

  constructor(saluranAwal: SaluranPembaruan = 'stable') {
    this.saluranAktif = saluranAwal;
  }

  public dapatkanSaluranAktif(): SaluranPembaruan {
    return this.saluranAktif;
  }

  public dapatkanInfoSaluranAktif(): InfoSaluranPembaruan {
    return UpdateChannelManager.DAFTAR_SALURAN[this.saluranAktif];
  }

  public setSaluran(saluran: SaluranPembaruan): { sukses: boolean; pesan: string } {
    if (!UpdateChannelManager.DAFTAR_SALURAN[saluran]) {
      return {
        sukses: false,
        pesan: `Saluran '${saluran}' tidak valid. Pilihan: stable, testing, beta, alpha, development.`,
      };
    }
    this.saluranAktif = saluran;
    return {
      sukses: true,
      pesan: `Saluran pembaruan berhasil dialihkan ke '${UpdateChannelManager.DAFTAR_SALURAN[saluran].namaTampilan}'.`,
    };
  }

  public static dapatkanSemuaSaluran(): InfoSaluranPembaruan[] {
    return Object.values(this.DAFTAR_SALURAN);
  }

  public static apakahSaluranSah(nama: string): nama is SaluranPembaruan {
    return nama in this.DAFTAR_SALURAN;
  }
}
