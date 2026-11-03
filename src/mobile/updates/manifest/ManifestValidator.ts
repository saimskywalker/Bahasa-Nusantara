/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 42
 * Validator Skema & Keamanan Manifest Pembaruan (Manifest Validator)
 */

import { ManifestPembaruan } from '../types';
import { UpdateSecurityPolicy } from '../security/UpdateSecurityPolicy';
import { VersionChecker } from '../core/VersionChecker';

export interface HasilValidasiManifest {
  valid: boolean;
  kesalahan: string[];
  pesanGalat: string[];
  peringatan: string[];
}

export class ManifestValidator {
  public static validasi(manifest: any): HasilValidasiManifest {
    const kesalahan: string[] = [];
    const peringatan: string[] = [];

    if (!manifest || typeof manifest !== 'object') {
      return {
        valid: false,
        kesalahan: ['Manifest pembaruan harus berupa obyek JSON yang valid.'],
        pesanGalat: ['Manifest pembaruan harus berupa obyek JSON yang valid.'],
        peringatan: [],
      };
    }

    // 1. Schema Version
    if (typeof manifest.schemaVersion !== 'number' || manifest.schemaVersion < 1) {
      kesalahan.push("Field 'schemaVersion' wajib berupa angka bulat positif (>= 1).");
    }

    // 2. Application ID
    if (!manifest.applicationId || typeof manifest.applicationId !== 'string') {
      kesalahan.push("Field 'applicationId' wajib diisi (contoh: 'id.nusantara.aplikasi').");
    } else if (!/^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/.test(manifest.applicationId)) {
      kesalahan.push(`Format applicationId '${manifest.applicationId}' tidak valid (wajib reverse-DNS).`);
    }

    // 3. Platform
    const platformSah = ['android', 'ios', 'keduanya'];
    if (!platformSah.includes(manifest.platform)) {
      kesalahan.push(`Field 'platform' harus salah satu dari: ${platformSah.join(', ')}.`);
    }

    // 4. Saluran (Channel)
    const channelSah = ['development', 'alpha', 'beta', 'testing', 'stable'];
    if (!channelSah.includes(manifest.channel)) {
      kesalahan.push(`Field 'channel' harus salah satu dari: ${channelSah.join(', ')}.`);
    }

    // 5. Versi Semantik
    if (!manifest.releaseVersion || !VersionChecker.uraiSemver(manifest.releaseVersion)) {
      kesalahan.push(`Field 'releaseVersion' ('${manifest.releaseVersion}') tidak berformat SemVer valid.`);
    }
    if (!manifest.minimumSupportedVersion || !VersionChecker.uraiSemver(manifest.minimumSupportedVersion)) {
      kesalahan.push(`Field 'minimumSupportedVersion' ('${manifest.minimumSupportedVersion}') tidak berformat SemVer valid.`);
    }

    // 6. Update Type & Policy
    const updateTypes = ['native_store', 'ota_resource', 'hybrid'];
    if (!updateTypes.includes(manifest.updateType)) {
      kesalahan.push(`Field 'updateType' harus salah satu dari: ${updateTypes.join(', ')}.`);
    }

    const policies = ['opsional', 'disarankan', 'wajib', 'keamanan', 'resource_saja'];
    if (!policies.includes(manifest.policy)) {
      kesalahan.push(`Field 'policy' harus salah satu dari: ${policies.join(', ')}.`);
    }

    // 7. Kedaluwarsa
    if (manifest.expirationDate) {
      const expTime = new Date(manifest.expirationDate).getTime();
      if (isNaN(expTime)) {
        kesalahan.push("Format 'expirationDate' tidak valid ISO 8601.");
      } else if (expTime < Date.now()) {
        kesalahan.push(`Manifest pembaruan ini telah kedaluwarsa pada ${manifest.expirationDate}.`);
      }
    }

    // 8. Validasi Resources (Jika tipe OTA / hybrid)
    if (manifest.updateType === 'ota_resource' || manifest.updateType === 'hybrid') {
      if (!Array.isArray(manifest.resources) || manifest.resources.length === 0) {
        kesalahan.push("Pembaruan tipe OTA/hybrid wajib menyertakan array 'resources' yang tidak kosong.");
      } else {
        let totalUkuran = 0;
        const tipeResourceSah = ['theme', 'images', 'fonts', 'localization', 'content', 'config', 'template'];

        manifest.resources.forEach((res: any, idx: number) => {
          const resLabel = `Resource #${idx + 1} (${res.id || 'tanpa-id'})`;

          if (!res.id) kesalahan.push(`${resLabel}: 'id' wajib diisi.`);
          if (!tipeResourceSah.includes(res.tipe)) {
            kesalahan.push(`${resLabel}: 'tipe' tidak valid (pilihan: ${tipeResourceSah.join(', ')}).`);
          }

          // Cek path traversal
          const cekPath = UpdateSecurityPolicy.periksaPathTraversal(res.jalurRelatif || '');
          if (!cekPath.valid) {
            kesalahan.push(`${resLabel}: ${cekPath.pesan}`);
          }

          // Cek ekstensi terlarang
          const cekExt = UpdateSecurityPolicy.periksaEkstensiAman(res.jalurRelatif || '');
          if (!cekExt.valid) {
            kesalahan.push(`${resLabel}: ${cekExt.pesan}`);
          }

          // Cek hash SHA-256 (harus 64 karakter heksadesimal)
          if (!res.sha256 || !/^[a-fA-F0-9]{64}$/.test(res.sha256)) {
            kesalahan.push(`${resLabel}: 'sha256' harus berupa string 64 karakter heksadesimal.`);
          }

          // Cek ukuran
          if (typeof res.ukuranByte !== 'number' || res.ukuranByte <= 0) {
            kesalahan.push(`${resLabel}: 'ukuranByte' harus bernilai angka positif.`);
          } else {
            totalUkuran += res.ukuranByte;
          }
        });

        // Cek total batas bundle
        if (totalUkuran > UpdateSecurityPolicy.MAKS_TOTAL_UKURAN_BUNDLE) {
          kesalahan.push(`Total ukuran seluruh resource (${(totalUkuran / 1024 / 1024).toFixed(1)} MB) melebihi batas bundle 100 MB.`);
        }
      }
    }

    // 9. Peringatan Tanda Tangan
    if (!manifest.tandaTangan) {
      peringatan.push('Manifest tidak memiliki tanda tangan digital kriptografis. Sangat disarankan untuk rilis produksi.');
    }

    return {
      valid: kesalahan.length === 0,
      kesalahan,
      pesanGalat: kesalahan,
      peringatan,
    };
  }
}
