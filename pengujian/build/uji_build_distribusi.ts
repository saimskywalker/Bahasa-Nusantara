/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 23
 * Uji Sistem Build & Distribusi (Build System & Distribution)
 */

import { MesinBuild, PengemasArsip, PenataRilis, muatKonfigurasiBuild } from '../../src/build';

let totalUji = 0;
let lulusUji = 0;

function pastikan(kondisi: boolean, pesan: string) {
  totalUji++;
  if (!kondisi) {
    throw new Error(`[GAGAL] ${pesan}`);
  }
  lulusUji++;
  console.log(`  [✓ LULUS] ${pesan}`);
}

async function jalankanUjiBuild() {
  console.log('\n============================================================');
  console.log('  PENGUJIAN SISTEM BUILD & DISTRIBUSI (PHASE 23)');
  console.log('============================================================\n');

  // 1. Konfigurasi Build
  console.log('--- Kelompok 1: Konfigurasi Build ---');
  const konfig = muatKonfigurasiBuild();
  pastikan(konfig.platformTarget.length > 0, 'Target platform konfigurasi build harus ada');
  pastikan(konfig.optimasi !== undefined, 'Pengaturan optimasi harus didefinisikan');

  // 2. Mesin Build
  console.log('\n--- Kelompok 2: Mesin Build & Eksekusi ---');
  const mesin = new MesinBuild();
  const hasil = mesin.bangun({ target: ['linux'] });
  pastikan(hasil.sukses === true, 'Eksekusi bangun linux-x64 harus berhasil');
  pastikan(hasil.artefak.length > 0, 'Harus menghasilkan artefak build');

  // 3. Pengemas Arsip
  console.log('\n--- Kelompok 3: Pengemas Arsip & Kemasan ---');
  const namaArsip = PengemasArsip.buatNamaArsip('nusantara', '0.23.0', 'linux-x64');
  pastikan(namaArsip.includes('linux-x64'), 'Nama arsip harus memuat nama platform');

  const art = PengemasArsip.kemas('nusantara', '0.23.0', 'linux-x64');
  pastikan(typeof art.sha256 === 'string' && art.sha256.length === 64, 'Checksum SHA-256 harus 64 karakter hex');

  // 4. Penata Rilis
  console.log('\n--- Kelompok 4: Penata Rilis & Manifest ---');
  const manifest = PenataRilis.susunManifest('nusantara', 'v0.23.0', 'release', hasil.artefak);
  pastikan(manifest.versi === 'v0.23.0', 'Versi manifest harus v0.23.0');
  pastikan(manifest.artefak.length === hasil.artefak.length, 'Jumlah artefak manifest harus cocok');

  const teksChecksum = PenataRilis.buatTeksChecksum(hasil.artefak);
  pastikan(teksChecksum.length > 0, 'Teks checksum rilis harus dihasilkan');

  console.log('\n============================================================');
  console.log(`TOTAL UJI: ${totalUji} | LULUS: ${lulusUji} | GAGAL: ${totalUji - lulusUji}`);
  console.log('============================================================\n');
}

jalankanUjiBuild().catch(err => {
  console.error(err);
  process.exit(1);
});
