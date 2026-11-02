/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 39
 * Registri Multi-Cloud Provider & Ekosistem Layanan (Cloud Provider Registry)
 */

export interface InfoPenyediaCloud {
  id: string;
  nama: string;
  layanan: Array<'auth' | 'storage' | 'database' | 'notification' | 'realtime'>;
  status: 'didukung' | 'simulasi' | 'eksperimental';
  deskripsi: string;
}

export class RegistriPenyediaCloud {
  private static instance: RegistriPenyediaCloud;
  private penyediaList: Map<string, InfoPenyediaCloud> = new Map();
  private penyediaAktifId = 'mock_local';

  private constructor() {
    this.daftarkan({
      id: 'mock_local',
      nama: 'Nusantara Mock Local Cloud',
      layanan: ['auth', 'storage', 'database', 'notification', 'realtime'],
      status: 'didukung',
      deskripsi: 'Penyedia cloud lokal terisolasi dalam memori & sandbox untuk pengembangan dan unit testing.',
    });

    this.daftarkan({
      id: 'supabase',
      nama: 'Supabase Cloud Services',
      layanan: ['auth', 'storage', 'database', 'realtime'],
      status: 'didukung',
      deskripsi: 'Integrasi backend Supabase via PostgREST, GoTrue Auth PKCE, dan Storage API.',
    });

    this.daftarkan({
      id: 'firebase',
      nama: 'Google Firebase Mobile Suite',
      layanan: ['auth', 'storage', 'database', 'notification'],
      status: 'didukung',
      deskripsi: 'Integrasi Firebase REST (Auth, Firestore, Cloud Storage, dan Firebase Cloud Messaging).',
    });

    this.daftarkan({
      id: 'rest_kustom',
      nama: 'Nusantara Custom Web & REST API',
      layanan: ['auth', 'storage', 'database'],
      status: 'didukung',
      deskripsi: 'Server backend mandiri yang dibangun dengan Web Framework & ORM NUSANTARA.',
    });
  }

  public static dapatkanInstance(): RegistriPenyediaCloud {
    if (!this.instance) {
      this.instance = new RegistriPenyediaCloud();
    }
    return this.instance;
  }

  public daftarkan(info: InfoPenyediaCloud): void {
    this.penyediaList.set(info.id, info);
  }

  public dapatkan(id: string): InfoPenyediaCloud | undefined {
    return this.penyediaList.get(id);
  }

  public dapatkanSemua(): InfoPenyediaCloud[] {
    return Array.from(this.penyediaList.values());
  }

  public pilihPenyedia(id: string): boolean {
    if (this.penyediaList.has(id)) {
      this.penyediaAktifId = id;
      return true;
    }
    return false;
  }

  public dapatkanPenyediaAktif(): InfoPenyediaCloud {
    return this.penyediaList.get(this.penyediaAktifId) || this.penyediaList.get('mock_local')!;
  }
}
