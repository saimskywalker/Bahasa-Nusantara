/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 40
 * NUSANTARA Mobile Distribution Center (Dashboard Distribusi & Publikasi)
 */

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  PackageCheck,
  ShieldCheck,
  Apple,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  RotateCw,
  FolderGit2,
  Layers,
  Sparkles,
  Info,
  KeyRound,
  FileCheck2,
  Calendar,
  Tag,
  ArrowUpRight,
  Sliders,
  Image as ImageIcon,
} from 'lucide-react';
import {
  DistributionManager,
  KonfigurasiDistribusiLengkap,
  LaporanValidasiRilis,
  ArtefakHasilDistribusi,
  AndroidDistributionManager,
  IOSDistributionManager,
  ReleaseReportGenerator,
} from '../mobile/distribution';

export default function StudioDistribusiMobile() {
  const distMgr = DistributionManager.dapatkanInstance();
  const [konfig, setKonfig] = useState<KonfigurasiDistribusiLengkap>(distMgr.dapatkanKonfigurasi());
  const [laporanValidasi, setLaporanValidasi] = useState<LaporanValidasiRilis | null>(null);
  const [daftarArtefak, setDaftarArtefak] = useState<ArtefakHasilDistribusi[]>([]);
  const [laporanMarkdown, setLaporanMarkdown] = useState<string>('');
  const [tabAktif, setTabAktif] = useState<'ringkasan' | 'android' | 'ios' | 'aset' | 'versi' | 'checklist' | 'laporan'>('ringkasan');
  const [sedangMemproses, setSedangMemproses] = useState<boolean>(false);
  const [pesanNotifikasi, setPesanNotifikasi] = useState<{ teks: string; tipe: 'sukses' | 'peringatan' | 'galat' } | null>(null);

  const envSistem = distMgr.periksaLingkunganSistem();

  useEffect(() => {
    muatData();
  }, []);

  const muatData = () => {
    const cfg = distMgr.dapatkanKonfigurasi();
    setKonfig(cfg);
    const val = distMgr.validasiKesiapanRilis();
    setLaporanValidasi(val);
    const md = ReleaseReportGenerator.buatLaporanMarkdown(cfg, val, daftarArtefak);
    setLaporanMarkdown(md);
  };

  const handleUbahLingkungan = (env: any) => {
    const baru = distMgr.aturLingkungan(env);
    setKonfig(baru);
    const val = distMgr.validasiKesiapanRilis();
    setLaporanValidasi(val);
    setPesanNotifikasi({ teks: `Lingkungan distribusi dialihkan ke ${env.toUpperCase()}`, tipe: 'sukses' });
  };

  const handleNaikkanVersi = (tipe: 'mayor' | 'minor' | 'patch') => {
    const res = distMgr.naikkanVersi(tipe);
    muatData();
    setPesanNotifikasi({
      teks: `Versi berhasil dinaikkan ke ${res.versiSemantik} (Android: ${res.kodeVersiAndroid}, iOS: ${res.nomorBuildIOS})`,
      tipe: 'sukses',
    });
  };

  const handleBuildAPK = (tipe: 'debug' | 'release') => {
    setSedangMemproses(true);
    setTimeout(() => {
      const res = tipe === 'release'
        ? AndroidDistributionManager.bangunReleaseAPK(konfig)
        : AndroidDistributionManager.bangunDebugAPK(konfig);

      if (res.artefak) {
        setDaftarArtefak((prev) => [res.artefak!, ...prev.filter((a) => a.namaBerkas !== res.artefak!.namaBerkas)]);
      }
      muatData();
      setSedangMemproses(false);
      setPesanNotifikasi({
        teks: res.pesan,
        tipe: res.sukses ? 'sukses' : 'galat',
      });
    }, 400);
  };

  const handleBuildAAB = () => {
    setSedangMemproses(true);
    setTimeout(() => {
      const res = AndroidDistributionManager.bangunReleaseAAB(konfig);
      if (res.artefak) {
        setDaftarArtefak((prev) => [res.artefak!, ...prev.filter((a) => a.namaBerkas !== res.artefak!.namaBerkas)]);
      }
      muatData();
      setSedangMemproses(false);
      setPesanNotifikasi({
        teks: res.pesan,
        tipe: res.sukses ? 'sukses' : 'galat',
      });
    }, 400);
  };

  const handleSiapkanIOSArchive = () => {
    setSedangMemproses(true);
    setTimeout(() => {
      const res = IOSDistributionManager.siapkanArchive(konfig);
      if (res.artefak) {
        setDaftarArtefak((prev) => [res.artefak!, ...prev.filter((a) => a.namaBerkas !== res.artefak!.namaBerkas)]);
      }
      muatData();
      setSedangMemproses(false);
      setPesanNotifikasi({
        teks: res.pesan,
        tipe: res.sukses ? 'sukses' : 'peringatan',
      });
    }, 400);
  };

  const handleJalankanPipelineLengkap = () => {
    setSedangMemproses(true);
    setTimeout(() => {
      const res = distMgr.jalankanDistribusiRilis();
      setDaftarArtefak(res.artefak);
      setLaporanValidasi(res.validasi);
      setLaporanMarkdown(ReleaseReportGenerator.buatLaporanMarkdown(konfig, res.validasi, res.artefak));
      setSedangMemproses(false);
      setPesanNotifikasi({
        teks: res.pesan,
        tipe: res.sukses ? 'sukses' : 'peringatan',
      });
    }, 600);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Top Banner Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 px-6 py-5 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-lg shadow-emerald-500/20 text-white">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  NUSANTARA Mobile Distribution Center
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  v0.40.0
                </span>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {konfig.lingkungan.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pusat orkestrasi build Android (APK & AAB), persiapan iOS Archive, signing Keystore/Keychain, dan validasi rilis publik.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={konfig.lingkungan}
              onChange={(e) => handleUbahLingkungan(e.target.value)}
              className="bg-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="development">Development</option>
              <option value="testing">Testing</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>

            <button
              onClick={handleJalankanPipelineLengkap}
              disabled={sedangMemproses}
              className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-md transition disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{sedangMemproses ? 'Memproses...' : 'Jalankan Rilis'}</span>
            </button>
          </div>
        </div>

        {/* Notifikasi Pop-up */}
        {pesanNotifikasi && (
          <div
            className={`mt-4 px-4 py-2.5 rounded-lg text-xs flex items-center justify-between border ${
              pesanNotifikasi.tipe === 'sukses'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : pesanNotifikasi.tipe === 'peringatan'
                ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}
          >
            <span>{pesanNotifikasi.teks}</span>
            <button
              onClick={() => setPesanNotifikasi(null)}
              className="text-slate-400 hover:text-white ml-3"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/50 px-6 space-x-1 overflow-x-auto">
        {[
          { id: 'ringkasan', label: 'Ringkasan & Toolchain', icon: Sliders },
          { id: 'android', label: 'Android (APK & AAB)', icon: PackageCheck },
          { id: 'ios', label: 'iOS (Archive & Xcode)', icon: Apple },
          { id: 'aset', label: 'Ikon & Splash', icon: ImageIcon },
          { id: 'versi', label: 'Pengelola Versi', icon: Tag },
          { id: 'checklist', label: 'Checklist Validasi', icon: FileCheck2 },
          { id: 'laporan', label: 'Laporan Publikasi', icon: FileCode2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const aktif = tabAktif === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTabAktif(tab.id as any)}
              className={`flex items-center space-x-2 py-3 px-4 text-xs font-medium border-b-2 transition whitespace-nowrap ${
                aktif
                  ? 'border-emerald-500 text-emerald-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="p-6 space-y-6 flex-1">
        {/* TAB 1: RINGKASAN */}
        {tabAktif === 'ringkasan' && (
          <div className="space-y-6">
            {/* Kartu Status Utama */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Application ID</span>
                <p className="text-sm font-semibold text-white mt-1 font-mono truncate">{konfig.aplikasi.id}</p>
                <span className="text-[10px] text-emerald-400 mt-2 block">Android Package / iOS Bundle ID</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Versi Semantik</span>
                <p className="text-sm font-semibold text-white mt-1 font-mono">v{konfig.aplikasi.versi}</p>
                <span className="text-[10px] text-slate-400 mt-2 block">
                  Code: {konfig.aplikasi.kodeVersiAndroid} | Build: {konfig.aplikasi.nomorBuild}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Kesiapan Rilis</span>
                <div className="flex items-center space-x-2 mt-1">
                  {laporanValidasi?.siapRilis ? (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      SIAP RILIS
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      MEMERLUKAN TINDAKAN
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-2 block">
                  {laporanValidasi?.totalLulus || 0} Lulus, {laporanValidasi?.totalGagal || 0} Gagal
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Artefak Terpasang</span>
                <p className="text-sm font-semibold text-white mt-1">{daftarArtefak.length} Berkas</p>
                <span className="text-[10px] text-slate-400 mt-2 block">Siap didistribusikan di dist/</span>
              </div>
            </div>

            {/* Status Toolchain Lingkungan */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Pemeriksaan Lingkungan Toolchain Mobile</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Android SDK Status */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">Android Build Toolchain</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      envSistem.android.siapBuildNative
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {envSistem.android.siapBuildNative ? 'NATIVE SDK SIAP' : 'STANDALONE ENGINE SIAP'}
                    </span>
                  </div>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• SDK Path: <span className="text-slate-200 font-mono">{envSistem.android.androidHome || '(belum diatur)'}</span></li>
                    <li>• JDK Path: <span className="text-slate-200 font-mono">{process.env.JAVA_HOME || '(belum diatur)'}</span></li>
                    <li>• Gradle: <span className="text-slate-200">{envSistem.android.adaGradle ? 'Terdeteksi' : 'Bawaan / Standalone'}</span></li>
                  </ul>
                  {envSistem.android.catatan.map((c, idx) => (
                    <p key={idx} className="text-[11px] text-slate-500 italic">• {c}</p>
                  ))}
                </div>

                {/* iOS Xcode Status */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">iOS Apple Toolchain</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      envSistem.ios.siapBuildNativeIOS
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {envSistem.ios.siapBuildNativeIOS ? 'XCODE SIAP' : 'HANYA MACOS ARCHIVE'}
                    </span>
                  </div>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Host OS: <span className="text-slate-200 font-mono">{process.platform}</span></li>
                    <li>• Apple Xcode: <span className="text-slate-200">{envSistem.ios.versiXcode || '(tidak tersedia)'}</span></li>
                    <li>• Bundle Target: <span className="text-slate-200 font-mono">{konfig.ios.bundleId}</span></li>
                  </ul>
                  {envSistem.ios.catatan.map((c, idx) => (
                    <p key={idx} className="text-[11px] text-slate-500 italic">• {c}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ANDROID */}
        {tabAktif === 'android' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Eksekusi Build Android</h3>
                  <p className="text-xs text-slate-400">Buat berkas instalasi APK Debug, Release APK, atau AAB resmi Google Play.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBuildAPK('debug')}
                    disabled={sedangMemproses}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
                  >
                    Build APK Debug
                  </button>
                  <button
                    onClick={() => handleBuildAPK('release')}
                    disabled={sedangMemproses}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-xs font-medium text-white transition"
                  >
                    Build APK Release
                  </button>
                  <button
                    onClick={handleBuildAAB}
                    disabled={sedangMemproses}
                    className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-xs font-semibold text-white transition"
                  >
                    Build AAB (Google Play)
                  </button>
                </div>
              </div>

              {/* Konfigurasi Signing Android */}
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  <span>Konfigurasi Keystore & Penandatanganan (Signing)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Jalur Keystore (.keystore / .jks)</label>
                    <input
                      type="text"
                      disabled
                      value={konfig.android.signing.keystorePath || ''}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Key Alias</label>
                    <input
                      type="text"
                      disabled
                      value={konfig.android.signing.keyAlias || ''}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Env Var Sandi Keystore (Anti-Hardcoded)</label>
                    <input
                      type="text"
                      disabled
                      value={konfig.android.signing.storePasswordEnv || ''}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Skema Signature Aktif</label>
                    <span className="text-slate-300 font-mono text-xs block py-1.5">
                      {(konfig.android.signing.skemaSigning || ['v2', 'v3']).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: IOS */}
        {tabAktif === 'ios' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Persiapan Rilis Apple iOS</h3>
                  <p className="text-xs text-slate-400">Siapkan struktur .xcarchive, Info.plist, ExportOptions.plist, dan checklist App Store Connect.</p>
                </div>
                <button
                  onClick={handleSiapkanIOSArchive}
                  disabled={sedangMemproses}
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white transition"
                >
                  Siapkan iOS Archive
                </button>
              </div>

              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="font-semibold text-slate-200">Apple Code Signing & Provisioning</span>
                <p className="text-slate-400">
                  Bundle ID: <span className="font-mono text-slate-200">{konfig.ios.bundleId}</span> | Deployment Target: <span className="font-mono text-slate-200">iOS {konfig.ios.deploymentTarget}</span>
                </p>
                <p className="text-slate-400">
                  Identitas: <span className="font-mono text-slate-200">{konfig.ios.signing.identitasSigning || 'Apple Distribution'}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ASET */}
        {tabAktif === 'aset' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Pengelola Ikon & Splash Screen Mobile</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-semibold text-slate-200">Ikon Aplikasi Utama</span>
                  <p className="text-slate-400">Jalur: <span className="font-mono text-slate-300">{konfig.aset.ikonUtama}</span></p>
                  <p className="text-slate-400">Ukuran Standar: 512x512 (Google Play), 1024x1024 (App Store)</p>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-semibold text-slate-200">Splash Screen</span>
                  <p className="text-slate-400">Jalur: <span className="font-mono text-slate-300">{konfig.aset.splashUtama}</span></p>
                  <p className="text-slate-400">Android 12+ API: Theme.SplashScreen terintegrasi.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: VERSI */}
        {tabAktif === 'versi' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Pengelola Versi Semantik & Release Channel</h3>
                  <p className="text-xs text-slate-400">Kelola kenaikan versi aplikasi, Android versionCode, dan iOS Build Number.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleNaikkanVersi('patch')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
                  >
                    + Patch ({konfig.aplikasi.versi.split('.')[0]}.{konfig.aplikasi.versi.split('.')[1]}.{parseInt(konfig.aplikasi.versi.split('.')[2] || '0', 10) + 1})
                  </button>
                  <button
                    onClick={() => handleNaikkanVersi('minor')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
                  >
                    + Minor ({konfig.aplikasi.versi.split('.')[0]}.{parseInt(konfig.aplikasi.versi.split('.')[1] || '0', 10) + 1}.0)
                  </button>
                  <button
                    onClick={() => handleNaikkanVersi('mayor')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
                  >
                    + Mayor ({parseInt(konfig.aplikasi.versi.split('.')[0] || '1', 10) + 1}.0.0)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Versi SemVer</span>
                  <p className="text-base font-bold text-white font-mono mt-1">{konfig.aplikasi.versi}</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Android versionCode</span>
                  <p className="text-base font-bold text-white font-mono mt-1">{konfig.aplikasi.kodeVersiAndroid}</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">iOS CFBundleVersion</span>
                  <p className="text-base font-bold text-white font-mono mt-1">{konfig.aplikasi.nomorBuild}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CHECKLIST VALIDASI */}
        {tabAktif === 'checklist' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Checklist Kesiapan Rilis Toko Aplikasi</h3>
              <button
                onClick={muatData}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Segarkan Pemeriksaan</span>
              </button>
            </div>

            <div className="space-y-2">
              {laporanValidasi?.checklist.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-3 text-xs"
                >
                  <div className="mt-0.5">
                    {item.status === 'lulus' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : item.status === 'peringatan' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-200">{item.judul}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                        {item.kategori}
                      </span>
                    </div>
                    <p className="text-slate-400 mt-0.5">{item.pesan}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: LAPORAN MARKDOWN */}
        {tabAktif === 'laporan' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Laporan Rilis Terstruktur (Markdown)</h3>
            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {laporanMarkdown}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
