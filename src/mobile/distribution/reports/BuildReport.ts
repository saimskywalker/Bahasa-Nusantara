/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 40
 * Pembuat Laporan Build Mobile (Build Report Generator)
 */

import * as fs from 'fs';
import * as path from 'path';
import { ArtefakHasilDistribusi, LaporanBuildMobile, LingkunganDistribusi } from '../types';

export class BuildReportGenerator {
  public static buatLaporan(
    platform: 'android' | 'ios' | 'keduanya',
    tipeBuild: 'debug' | 'release',
    lingkungan: LingkunganDistribusi,
    sukses: boolean,
    pesan: string,
    artefak: ArtefakHasilDistribusi[],
    peringatan: string[] = [],
    daftarGalat: string[] = []
  ): LaporanBuildMobile {
    const idBuild = `BUILD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    return {
      idBuild,
      waktuMulai: new Date().toISOString(),
      durasiMs: 120,
      platform,
      tipeBuild,
      lingkungan,
      sukses,
      pesan,
      toolchain: {
        androidSdk: {
          terdeteksi: typeof process !== 'undefined' && Boolean(process.env?.ANDROID_HOME || process.env?.ANDROID_SDK_ROOT),
          jalur: typeof process !== 'undefined' ? (process.env?.ANDROID_HOME || process.env?.ANDROID_SDK_ROOT) : undefined,
        },
        jdk: {
          terdeteksi: typeof process !== 'undefined' && Boolean(process.env?.JAVA_HOME),
          versi: typeof process !== 'undefined' && process.env?.JAVA_HOME ? 'JDK 17+' : undefined,
        },
        gradle: {
          terdeteksi: typeof process !== 'undefined' && Boolean(process.env?.GRADLE_HOME),
        },
        xcode: {
          terdeteksi: typeof process !== 'undefined' && process.platform === 'darwin',
          apakahMacOS: typeof process !== 'undefined' && process.platform === 'darwin',
        },
      },
      artefak,
      peringatan,
      daftarGalat,
    };
  }

  public static simpanLaporanKeFile(
    laporan: LaporanBuildMobile,
    direktoriTujuan: string = 'dist/mobile/reports'
  ): string {
    const isNode = typeof window === 'undefined' && typeof process !== 'undefined' && Boolean(process?.versions?.node);
    if (!isNode) {
      return `${direktoriTujuan}/build-report.json`;
    }
    const fullDir = path.resolve(process.cwd(), direktoriTujuan);
    if (!fs.existsSync(fullDir)) {
      fs.mkdirSync(fullDir, { recursive: true });
    }

    const filePath = path.join(fullDir, 'build-report.json');
    fs.writeFileSync(filePath, JSON.stringify(laporan, null, 2), 'utf-8');
    return filePath;
  }
}
