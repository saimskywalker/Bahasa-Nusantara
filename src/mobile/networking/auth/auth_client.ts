/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 39
 * Klien Autentikasi Mobile & Pengelola Token Aman (Mobile Authentication Client)
 */

import * as crypto from 'node:crypto';
import {
  InfoTokenAutentikasi,
  KonfigurasiPKCE,
  SkemaAutentikasi,
  StatusAutentikasi,
} from '../types';
import { PenyimpananAmanMobile } from '../../security/secure_storage';
import { LapisanKeamananMobile } from '../security/cloud_security';
import { KlienAPIMobile } from '../core/api_client';

export class KlienAutentikasiMobile {
  private static readonly KUNCI_TOKEN_AKSES = 'nusantara_mobile_auth_access_token';
  private static readonly KUNCI_TOKEN_REFRESH = 'nusantara_mobile_auth_refresh_token';
  private static readonly KUNCI_META_AUTH = 'nusantara_mobile_auth_metadata';

  private status: StatusAutentikasi = 'belum_masuk';
  private infoToken?: InfoTokenAutentikasi;
  private klienAPI?: KlienAPIMobile;
  private readonly baseUrl?: string;

  constructor(opsi?: { apiClient?: KlienAPIMobile; baseUrl?: string }) {
    this.klienAPI = opsi?.apiClient;
    this.baseUrl = opsi?.baseUrl;
    this.muatSesiDariPenyimpananAman();
  }

  public dapatkanStatus(): StatusAutentikasi {
    if (!this.infoToken) return 'belum_masuk';
    if (this.apakahTokenKedaluwarsa()) {
      return 'kedaluwarsa';
    }
    return this.status;
  }

  public apakahTerautentikasi(): boolean {
    return this.dapatkanStatus() === 'terautentikasi';
  }

  public dapatkanTokenAkses(): string | undefined {
    return this.infoToken?.accessToken;
  }

  public dapatkanDataPengguna(): Record<string, any> | undefined {
    return this.infoToken?.dataPengguna;
  }

  public masukSinkron(emailAtauUser: string, kataSandi: string): { sukses: boolean; pesan: string; pengguna?: any } {
    if (!emailAtauUser || !kataSandi) {
      return { sukses: false, pesan: 'Identitas pengguna dan kata sandi wajib diisi.' };
    }
    const tokenBaru: InfoTokenAutentikasi = {
      skema: 'bearer',
      accessToken: `jwt_sim_${crypto.randomBytes(16).toString('hex')}`,
      refreshToken: `ref_sim_${crypto.randomBytes(24).toString('hex')}`,
      kedaluwarsaPada: Date.now() + 3600 * 1000,
      dataPengguna: {
        id: `usr_${Date.now()}`,
        email: emailAtauUser,
        nama: emailAtauUser.split('@')[0],
      },
      dibuatPada: Date.now(),
    };
    this.simpanSesiAman(tokenBaru);
    return { sukses: true, pesan: 'Berhasil masuk.', pengguna: tokenBaru.dataPengguna };
  }

  /**
   * Login ke server backend dan simpan token di penyimpanan aman (Keystore / Keychain)
   */
  public async masuk(emailAtauUser: string, kataSandi: string): Promise<{ sukses: boolean; pesan: string; pengguna?: any }> {
    if (!emailAtauUser || !kataSandi) {
      return { sukses: false, pesan: 'Identitas pengguna dan kata sandi wajib diisi.' };
    }

    try {
      let dataRespon: any = null;

      if (this.klienAPI) {
        const res = await this.klienAPI.kirim('/auth/masuk', {
          identitas: emailAtauUser,
          kataSandi,
        });

        if (!res.sukses) {
          return { sukses: false, pesan: res.galat || 'Gagal masuk ke server.' };
        }
        dataRespon = res.data;
      } else {
        // Simulasi otentikasi aman untuk pengujian & simulator
        const accessToken = `jwt_sim_${crypto.randomBytes(16).toString('hex')}`;
        const refreshToken = `ref_sim_${crypto.randomBytes(24).toString('hex')}`;
        dataRespon = {
          accessToken,
          refreshToken,
          kedaluwarsaPada: Date.now() + 3600 * 1000, // 1 jam
          pengguna: {
            id: `usr_${Date.now()}`,
            email: emailAtauUser,
            nama: emailAtauUser.split('@')[0],
          },
        };
      }

      const tokenBaru: InfoTokenAutentikasi = {
        skema: 'bearer',
        accessToken: dataRespon.accessToken || dataRespon.token,
        refreshToken: dataRespon.refreshToken,
        kedaluwarsaPada: dataRespon.kedaluwarsaPada || (Date.now() + 3600 * 1000),
        dataPengguna: dataRespon.pengguna,
        dibuatPada: Date.now(),
      };

      this.simpanSesiAman(tokenBaru);
      return { sukses: true, pesan: 'Berhasil masuk.', pengguna: tokenBaru.dataPengguna };
    } catch (err: any) {
      return { sukses: false, pesan: `Galat autentikasi: ${err.message}` };
    }
  }

  /**
   * Logout dan hapus token dari Android Keystore / iOS Keychain
   */
  public keluar(): void {
    this.infoToken = undefined;
    this.status = 'belum_masuk';
    PenyimpananAmanMobile.hapus(KlienAutentikasiMobile.KUNCI_TOKEN_AKSES);
    PenyimpananAmanMobile.hapus(KlienAutentikasiMobile.KUNCI_TOKEN_REFRESH);
    PenyimpananAmanMobile.hapus(KlienAutentikasiMobile.KUNCI_META_AUTH);
    if (this.klienAPI) {
      this.klienAPI.setTokenHeader(undefined);
    }
  }

  /**
   * Memperbarui Access Token menggunakan Refresh Token
   */
  public async perbaruiToken(): Promise<boolean> {
    const refreshToken = this.infoToken?.refreshToken || PenyimpananAmanMobile.ambil(KlienAutentikasiMobile.KUNCI_TOKEN_REFRESH);
    if (!refreshToken) {
      this.status = 'belum_masuk';
      return false;
    }

    this.status = 'memperbarui';

    try {
      let accessTokenBaru = '';
      let refreshTokenBaru = refreshToken;

      if (this.klienAPI) {
        const res = await this.klienAPI.kirim('/auth/refresh', { refreshToken });
        if (res.sukses && res.data?.accessToken) {
          accessTokenBaru = res.data.accessToken;
          refreshTokenBaru = res.data.refreshToken || refreshToken;
        } else {
          this.keluar();
          return false;
        }
      } else {
        accessTokenBaru = `jwt_sim_refreshed_${crypto.randomBytes(16).toString('hex')}`;
      }

      const tokenDiperbarui: InfoTokenAutentikasi = {
        skema: this.infoToken?.skema || 'bearer',
        accessToken: accessTokenBaru,
        refreshToken: refreshTokenBaru,
        kedaluwarsaPada: Date.now() + 3600 * 1000,
        dataPengguna: this.infoToken?.dataPengguna,
        dibuatPada: Date.now(),
      };

      this.simpanSesiAman(tokenDiperbarui);
      return true;
    } catch {
      this.status = 'kedaluwarsa';
      return false;
    }
  }

  /**
   * Membuat konfigurasi OAuth 2.0 PKCE yang aman untuk aplikasi mobile publik
   */
  public static buatKonfigurasiPKCE(clientId: string, authEndpoint: string, tokenEndpoint: string, redirectUri: string, lingkup: string[] = ['openid', 'profile']): KonfigurasiPKCE {
    // Generate code_verifier (43 - 128 karakter aman)
    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    // Generate SHA-256 code_challenge
    const hash = crypto.createHash('sha256').update(codeVerifier).digest();
    const codeChallenge = hash.toString('base64url');
    const state = crypto.randomBytes(16).toString('hex');

    return {
      clientId,
      authEndpoint,
      tokenEndpoint,
      redirectUri,
      lingkup,
      codeVerifier,
      codeChallenge,
      state,
    };
  }

  public apakahTokenKedaluwarsa(): boolean {
    if (!this.infoToken || !this.infoToken.kedaluwarsaPada) return false;
    // Beri toleransi 30 detik sebelum masa kedaluwarsa sebenarnya
    return Date.now() >= (this.infoToken.kedaluwarsaPada - 30000);
  }

  private simpanSesiAman(info: InfoTokenAutentikasi): void {
    this.infoToken = info;
    this.status = 'terautentikasi';

    PenyimpananAmanMobile.simpan(KlienAutentikasiMobile.KUNCI_TOKEN_AKSES, info.accessToken);
    if (info.refreshToken) {
      PenyimpananAmanMobile.simpan(KlienAutentikasiMobile.KUNCI_TOKEN_REFRESH, info.refreshToken);
    }
    PenyimpananAmanMobile.simpan(
      KlienAutentikasiMobile.KUNCI_META_AUTH,
      JSON.stringify({
        skema: info.skema,
        kedaluwarsaPada: info.kedaluwarsaPada,
        dataPengguna: info.dataPengguna,
        dibuatPada: info.dibuatPada,
      })
    );

    if (this.klienAPI) {
      this.klienAPI.setTokenHeader(info.accessToken);
    }
  }

  private muatSesiDariPenyimpananAman(): void {
    try {
      const accessToken = PenyimpananAmanMobile.ambil(KlienAutentikasiMobile.KUNCI_TOKEN_AKSES);
      const metaStr = PenyimpananAmanMobile.ambil(KlienAutentikasiMobile.KUNCI_META_AUTH);
      const refreshToken = PenyimpananAmanMobile.ambil(KlienAutentikasiMobile.KUNCI_TOKEN_REFRESH) || undefined;

      if (accessToken && metaStr) {
        const meta = JSON.parse(metaStr);
        this.infoToken = {
          skema: meta.skema || 'bearer',
          accessToken,
          refreshToken,
          kedaluwarsaPada: meta.kedaluwarsaPada,
          dataPengguna: meta.dataPengguna,
          dibuatPada: meta.dibuatPada,
        };
        this.status = this.apakahTokenKedaluwarsa() ? 'kedaluwarsa' : 'terautentikasi';
        if (this.klienAPI && this.status === 'terautentikasi') {
          this.klienAPI.setTokenHeader(accessToken);
        }
      }
    } catch {
      this.status = 'belum_masuk';
    }
  }
}
