/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 41
 * Validasi Kepatuhan & Persyaratan App Store iOS (Apple Store Validation)
 */

export interface HasilValidasiRilisIOS {
  valid: boolean;
  bundleIdSah: boolean;
  deploymentTargetSah: boolean;
  exportComplianceSah: boolean;
  privasiLengkap: boolean;
  daftarGalat: string[];
  pesanPeringatan: string[];
}

export class IOSValidation {
  public static readonly DEPLOYMENT_TARGET_MINIMAL = 15.0; // Standar rilis iOS modern

  /**
   * Memvalidasi parameter rilis iOS terhadap ketentuan Apple App Store Review Guidelines.
   */
  public static validasiKelayakan(params: {
    bundleId: string;
    version: string;
    buildNumber: number;
    deploymentTarget?: string;
    hasExportComplianceDeclaration?: boolean;
    privacyDescriptions?: Record<string, string>;
    namaBerkasArchive?: string;
  }): HasilValidasiRilisIOS {
    const daftarGalat: string[] = [];
    const pesanPeringatan: string[] = [];

    // 1. Validasi Bundle ID
    const bundleRegex = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;
    const bundleIdSah = bundleRegex.test(params.bundleId);
    if (!bundleIdSah) {
      daftarGalat.push(`Bundle ID '${params.bundleId}' tidak valid (format reverse-DNS wajib untuk Apple App Store).`);
    }

    // 2. Validasi Deployment Target
    let deploymentTargetSah = true;
    if (params.deploymentTarget) {
      const numTarget = parseFloat(params.deploymentTarget);
      if (isNaN(numTarget) || numTarget < this.DEPLOYMENT_TARGET_MINIMAL) {
        pesanPeringatan.push(
          `Deployment target iOS (${params.deploymentTarget}) di bawah rekomendasi minimal (${this.DEPLOYMENT_TARGET_MINIMAL}).`
        );
      }
    }

    // 3. Validasi Export Compliance (Enkripsi AS)
    const exportComplianceSah = params.hasExportComplianceDeclaration !== false;
    if (!exportComplianceSah) {
      pesanPeringatan.push(
        "Kunci 'ITSAppUsesNonExemptEncryption' belum diset di Info.plist. Apple akan meminta deklarasi kepatuhan ekspor manual saat build diunggah."
      );
    }

    // 4. Validasi Deskripsi Privasi (Usage Descriptions)
    let privasiLengkap = true;
    if (params.privacyDescriptions) {
      for (const [kunci, desc] of Object.entries(params.privacyDescriptions)) {
        if (!desc || desc.trim().length === 0) {
          daftarGalat.push(`Deskripsi privasi '${kunci}' kosong. Apple Review akan menolak binary tanpa penjelasan alasan penggunaan.`);
          privasiLengkap = false;
        }
      }
    }

    // 5. Validasi Build Number
    if (!Number.isInteger(params.buildNumber) || params.buildNumber <= 0) {
      daftarGalat.push(`CFBundleVersion (${params.buildNumber}) harus berupa bilangan bulat positif.`);
    }

    return {
      valid: daftarGalat.length === 0,
      bundleIdSah,
      deploymentTargetSah,
      exportComplianceSah,
      privasiLengkap,
      daftarGalat,
      pesanPeringatan,
    };
  }
}
