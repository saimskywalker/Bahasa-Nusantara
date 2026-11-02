/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 40
 * Pengelola Code Signing iOS (Apple Code Signing Integration)
 */

import { KonfigurasiSigningIOS } from '../types';
import { IOSDistributionConfig } from '../config/IOSConfig';

export interface HasilValidasiSigningIOS {
  valid: boolean;
  adaIdentitas: boolean;
  adaProvisioning: boolean;
  bundleIdValid: boolean;
  metodeEkspor: string;
  pesanPeringatan: string[];
  daftarGalat: string[];
}

export class CodeSigningManager {
  public static validasiCodeSigning(
    konfig: KonfigurasiSigningIOS,
    apakahRilisAppStore: boolean = true
  ): HasilValidasiSigningIOS {
    const pesanPeringatan: string[] = [];
    const daftarGalat: string[] = [];

    // 1. Validasi Bundle Identifier
    const cekBundle = IOSDistributionConfig.validasiBundleIdentifier(konfig.bundleIdentifier);
    const bundleIdValid = cekBundle.valid;
    if (!bundleIdValid && cekBundle.pesan) {
      daftarGalat.push(cekBundle.pesan);
    }

    // 2. Pemeriksaan Identitas Signing
    const adaIdentitas = Boolean(konfig.identitasSigning && konfig.identitasSigning.trim().length > 0);
    if (!adaIdentitas) {
      if (apakahRilisAppStore) {
        daftarGalat.push('Identitas sertifikat Apple Distribution belum ditentukan untuk rilis iOS.');
      } else {
        pesanPeringatan.push('Identitas sertifikat belum dipilih, default ke Automatic / Development signing.');
      }
    }

    // 3. Pemeriksaan Provisioning Profile
    const adaProvisioning = Boolean(
      konfig.jalurProvisioningProfile && konfig.jalurProvisioningProfile.trim().length > 0
    );
    if (!adaProvisioning && apakahRilisAppStore) {
      pesanPeringatan.push(
        'Jalur file provisioning profile (.mobileprovision) belum ditentukan secara eksplisit. Memerlukan Xcode Managed Provisioning di macOS.'
      );
    }

    // 4. Metode Ekspor
    const metode = konfig.metodeEkspor || 'app-store';

    return {
      valid: daftarGalat.length === 0,
      adaIdentitas,
      adaProvisioning,
      bundleIdValid,
      metodeEkspor: metode,
      pesanPeringatan,
      daftarGalat,
    };
  }

  public static buatExportOptionsPlist(konfig: KonfigurasiSigningIOS): string {
    const method = konfig.metodeEkspor || 'app-store';
    const signingStyle = konfig.jalurProvisioningProfile ? 'manual' : 'automatic';
    const teamIdXml = konfig.teamId ? `    <key>teamID</key>\n    <string>${konfig.teamId}</string>\n` : '';

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>destination</key>
    <string>export</string>
    <key>method</key>
    <string>${method}</string>
    <key>signingStyle</key>
    <string>${signingStyle}</string>
${teamIdXml}    <key>stripSwiftSymbols</key>
    <true/>
    <key>compileBitcode</key>
    <false/>
</dict>
</plist>`;
  }
}
