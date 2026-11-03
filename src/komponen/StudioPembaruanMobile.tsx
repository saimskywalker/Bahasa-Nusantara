/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Mobile Update System & Over-the-Air Updates (OTA) Studio
 * Target Versi: v0.42.0 (Phase 42)
 */

import React, { useState, useMemo } from 'react';
import {
  RefreshCw,
  Smartphone,
  ShieldCheck,
  ShieldAlert,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  History,
  FileCode,
  Layers,
  ArrowRight,
  RotateCcw,
  Sliders,
  Terminal,
  Activity,
  Copy,
  Check,
  Play,
  FileText,
  Lock,
  Radio,
  ExternalLink,
  ChevronRight,
  HardDrive
} from 'lucide-react';
import {
  UpdateManager,
  VersionChecker,
  UpdatePolicyManager,
  SaluranPembaruan,
  KebijakanPembaruan,
  StatusPembaruan,
  JenisPembaruan,
  ManifestPembaruan,
  GooglePlayInAppUpdate,
  AppleAppStoreUpdate,
  TrustManager,
  SignatureVerifier,
  HashValidator,
  UpdateReportGenerator,
} from '../mobile/updates';

export default function StudioPembaruanMobile() {
  const [activeSubTab, setActiveSubTab] = useState<
    'ringkasan' | 'semver' | 'saluran' | 'manifest' | 'ota' | 'store' | 'rollback' | 'laporan'
  >('ringkasan');

  // Instance UpdateManager
  const manager = useMemo(() => UpdateManager.dapatkanInstance(), []);

  // State untuk interactive controls
  const [currentVerInput, setCurrentVerInput] = useState('0.41.0');
  const [remoteVerInput, setRemoteVerInput] = useState('0.42.0');
  const [minVerInput, setMinVerInput] = useState('0.40.0');
  const [selectedChannel, setSelectedChannel] = useState<SaluranPembaruan>('stable');
  const [selectedPolicy, setSelectedPolicy] = useState<KebijakanPembaruan>('disarankan');
  const [otaTheme, setOtaTheme] = useState('nusantara-garuda-dark');
  const [otaLang, setOtaLang] = useState('id-ID');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Play In-App Updates state
  const [playFlowType, setPlayFlowType] = useState<'flexible' | 'immediate'>('flexible');
  const [playStatus, setPlayStatus] = useState<string>('idle');
  const [playProgress, setPlayProgress] = useState<number>(0);

  // OTA state
  const [otaStatus, setOtaStatus] = useState<string>('idle');
  const [otaLog, setOtaLog] = useState<string[]>([]);
  const [activeBundleVersion, setActiveBundleVersion] = useState<string>('bundle-2026.11.01');
  const [hasBackup, setHasBackup] = useState<boolean>(true);

  // Manifest editor/viewer state
  const [manifestPayload, setManifestPayload] = useState<string>(
    JSON.stringify(
      {
        manifestVersion: '1.0',
        appId: 'org.nusantara.app',
        appName: 'Nusantara Mobile Demo',
        version: '0.42.0',
        buildNumber: 42,
        minimumSupportedVersion: '0.40.0',
        channel: 'stable',
        releaseDate: '2026-11-03T10:00:00Z',
        policy: 'recommended',
        rolloutPercentage: 100,
        releaseNotes: {
          id: 'Pembaruan OTA Tema Garuda & Integrasi Play In-App Update',
          en: 'OTA Theme Garuda update & Play In-App Update support'
        },
        nativeBinary: {
          android: {
            minSdkVersion: 24,
            targetSdkVersion: 34,
            packageUrl: 'https://play.google.com/store/apps/details?id=org.nusantara.app',
            fileSize: 18500000,
            sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
          },
          ios: {
            minIosVersion: '15.0',
            appStoreUrl: 'https://apps.apple.com/app/id1234567890',
            bundleId: 'org.nusantara.app'
          }
        },
        otaResources: {
          bundleVersion: 'bundle-2026.11.03-garuda',
          bundleUrl: 'https://cdn.nusantara-lang.org/updates/org.nusantara.app/bundle-garuda.zip',
          bundleSize: 1420500,
          bundleSha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f901234567890abcdef1234567890abcdef',
          files: [
            { path: 'assets/themes/garuda.json', sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', size: 4096, type: 'theme' },
            { path: 'assets/locales/id.json', sha256: 'cca999837943d0f0113f04b2a88e9323531649987f2824cf4817a3b3a6ef0854', size: 12400, type: 'localization' },
            { path: 'assets/config/mobile.json', sha256: '3a4366db0c31e697a54f01e57d806ce7686d1d6635b15ed808a2a0d954e4e1f8', size: 2048, type: 'config' }
          ]
        },
        signature: {
          algorithm: 'Ed25519',
          keyId: 'nusantara-root-release-2026',
          value: 'sig_ed25519_canonical_mock_valid_signature_nusantara_2026'
        }
      },
      null,
      2
    )
  );

  const [signatureStatus, setSignatureStatus] = useState<{
    valid: boolean;
    pesan: string;
    digest?: string;
  }>({
    valid: true,
    pesan: 'Tanda tangan digital terverifikasi dengan Root Key (nusantara-root-release-2026)',
    digest: 'c893b169f417f7b3096b79c6d4822f672ddbb1b0445d475c87a55c2f558913b8'
  });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // SemVer comparison live calculation
  const semverResult = useMemo(() => {
    const isValidCur = VersionChecker.isValid(currentVerInput);
    const isValidRem = VersionChecker.isValid(remoteVerInput);
    const isValidMin = VersionChecker.isValid(minVerInput);

    if (!isValidCur || !isValidRem) {
      return { error: 'Format SemVer tidak valid (harus MAYOR.MINOR.PATCH)' };
    }

    const cmp = VersionChecker.compare(remoteVerInput, currentVerInput);
    const needsUpdate = cmp > 0;
    const isBelowMin = isValidMin && VersionChecker.isBelowMinimum(currentVerInput, minVerInput);
    const diffType = VersionChecker.diff(currentVerInput, remoteVerInput);

    return {
      isValidCur,
      isValidRem,
      cmp,
      needsUpdate,
      isBelowMin,
      diffType,
      policyEval: isBelowMin ? 'mandatory (dibawah batas minimum)' : selectedPolicy
    };
  }, [currentVerInput, remoteVerInput, minVerInput, selectedPolicy]);

  // OTA simulation runner
  const jalankanSimulasiOTA = () => {
    setOtaStatus('downloading');
    setOtaLog(['[OTA] Memulai siklus pembaruan resource OTA...', '[OTA] Memvalidasi skema manifest dan saluran rilis...']);

    setTimeout(() => {
      setOtaLog(prev => [...prev, '[OTA] Mengunduh paket bundle: bundle-garuda.zip (1.42 MB) via HTTPS']);
      setOtaStatus('verifying');
    }, 600);

    setTimeout(() => {
      setOtaLog(prev => [
        ...prev,
        '[OTA] Validasi integritas SHA-256 bundle: a1b2c3d4... [LULUS]',
        '[OTA] Validasi ekstensi terlarang (anti-code injection): tidak ada file executable (.dex, .so, .apk)',
        '[OTA] Mempersiapkan direktori pementasan (staging)...'
      ]);
      setOtaStatus('staging');
    }, 1200);

    setTimeout(() => {
      setOtaLog(prev => [
        ...prev,
        '[OTA] Menyimpan cadangan aktif ke folder backup: bundle-2026.11.01',
        '[OTA] Melakukan atomic swap direktori aktif...',
        '[OTA] Berhasil mengaktifkan resource bundle: bundle-2026.11.03-garuda'
      ]);
      setOtaStatus('completed');
      setActiveBundleVersion('bundle-2026.11.03-garuda');
      setHasBackup(true);
    }, 1900);
  };

  // Rollback simulation runner
  const jalankanRollback = () => {
    if (!hasBackup) return;
    setOtaStatus('rolling_back');
    setOtaLog(prev => [
      ...prev,
      '[ROLLBACK] Memulai pemulihan cadangan resource sebelumnya...',
      '[ROLLBACK] Menghapus direktori aktif yang bermasalah...',
      '[ROLLBACK] Mengembalikan snapshot cadangan (bundle-2026.11.01)...',
      '[ROLLBACK] Resource berhasil dipulihkan ke versi stabil.'
    ]);

    setTimeout(() => {
      setActiveBundleVersion('bundle-2026.11.01');
      setOtaStatus('rolled_back');
    }, 800);
  };

  // Play In-App Updates simulation
  const jalankanPlaySimulasi = () => {
    setPlayStatus('checking');
    setPlayProgress(10);

    setTimeout(() => {
      setPlayStatus('available');
      setPlayProgress(25);
    }, 500);

    setTimeout(() => {
      setPlayStatus('downloading');
      setPlayProgress(60);
    }, 1000);

    setTimeout(() => {
      setPlayProgress(100);
      setPlayStatus(playFlowType === 'flexible' ? 'downloaded' : 'installing');
    }, 1600);

    if (playFlowType === 'immediate') {
      setTimeout(() => {
        setPlayStatus('installed');
      }, 2300);
    }
  };

  const konfirmasiInstallPlayFlexible = () => {
    setPlayStatus('installing');
    setTimeout(() => {
      setPlayStatus('installed');
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xl shadow-inner">
              <RefreshCw className="w-6 h-6 animate-[spin_6s_linear_infinite]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Mobile App Update System &amp; Over-the-Air Updates (OTA)
                </h2>
                <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  v0.42.0 Phase 42
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Sistem pembaruan mobile dua jalur yang aman: Pembaruan Biner Asli via Google Play &amp; Apple App Store, serta Pembaruan Resource &amp; Konten OTA (Tema, Lokalisasi, Konfigurasi) dengan Tanda Tangan Digital &amp; Rollback Otomatis.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-mono font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Kepatuhan Google Play &amp; App Store 100%</span>
            </span>
            <div className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/80 text-cyan-300 text-xs font-mono font-medium flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>nusantara mobile update</span>
            </div>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          {[
            { id: 'ringkasan', label: 'Ringkasan & Status', icon: Activity },
            { id: 'semver', label: 'Pemeriksa SemVer & Kebijakan', icon: Sliders },
            { id: 'saluran', label: 'Saluran Rilis & Peluncuran', icon: Radio },
            { id: 'manifest', label: 'Manifest & Tanda Tangan', icon: Lock },
            { id: 'ota', label: 'Pembaruan Resource OTA', icon: Download },
            { id: 'store', label: 'Toko Aplikasi (Play/Apple)', icon: Smartphone },
            { id: 'rollback', label: 'Rollback & Pemulihan', icon: RotateCcw },
            { id: 'laporan', label: 'Laporan Audit & CLI', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Sub-Tab Content */}

      {/* SUB-TAB 1: RINGKASAN & STATUS */}
      {activeSubTab === 'ringkasan' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Versi Aktif Klien</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div>
              <div className="text-2xl font-black text-white font-mono">v0.41.0</div>
              <div className="text-xs text-slate-400 mt-1">Build #41 • Saluran: Stable</div>
            </div>
            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Target SDK Android:</span>
                <span className="text-slate-200 font-mono">API 34 (Android 14)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Target Minimum iOS:</span>
                <span className="text-slate-200 font-mono">iOS 15.0+</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Resource OTA Aktif:</span>
                <span className="text-cyan-300 font-mono">{activeBundleVersion}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Versi Terbaru di Server</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono">Tersedia</span>
            </div>
            <div>
              <div className="text-2xl font-black text-cyan-400 font-mono">v0.42.0</div>
              <div className="text-xs text-slate-400 mt-1">Build #42 • Kebijakan: Recommended</div>
            </div>
            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Batas Min. Didukung:</span>
                <span className="text-amber-300 font-mono">v0.40.0</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Ukuran Biner Native:</span>
                <span className="text-slate-200 font-mono">18.5 MB</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Ukuran Bundle OTA:</span>
                <span className="text-emerald-300 font-mono">1.42 MB</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Integritas &amp; Keamanan</span>
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">Ed25519</div>
              <div className="text-xs text-slate-400 mt-1">Kriptografi Asimetris Digital Signature</div>
            </div>
            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Protokol Transfer:</span>
                <span className="text-emerald-300 font-mono">HTTPS Wajib (TLS 1.3)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Algoritma Hash:</span>
                <span className="text-slate-200 font-mono">FIPS 180-4 SHA-256</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Anti-Zip Slip:</span>
                <span className="text-emerald-400 font-bold">Aktif &amp; Teruji</span>
              </div>
            </div>
          </div>

          {/* Arsitektur Dua Jalur */}
          <div className="md:col-span-3 bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Arsitektur Pembaruan Dua Jalur (Strict Boundary Architecture)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <Smartphone className="w-4 h-4" />
                  Jalur 1: Pembaruan Biner Asli (Native App Binary)
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Digunakan untuk perubahan kode eksekutabel, bytecode runtime, native bridge Kotlin/Swift, atau kenaikan versi minor/mayor biner.
                </p>
                <ul className="list-disc list-inside text-slate-400 space-y-1">
                  <li><strong>Android:</strong> Google Play In-App Updates (Immediate / Flexible)</li>
                  <li><strong>iOS:</strong> Apple App Store Deep-link via StoreKit (SKAppUpdate)</li>
                  <li><strong>Kepatuhan:</strong> Mematuhi penuh aturan Apple Guidelines 2.5.2 &amp; Google Play Device and Network Abuse</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-cyan-400">
                  <Download className="w-4 h-4" />
                  Jalur 2: Pembaruan Resource &amp; Konten OTA (Over-the-Air)
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Pembaruan instan tanpa peluncuran ulang toko aplikasi khusus untuk aset non-eksekutabel yang aman.
                </p>
                <ul className="list-disc list-inside text-slate-400 space-y-1">
                  <li><strong>Diizinkan:</strong> File tema UI (.json), paket lokalisasi, konfigurasi, gambar, font, template</li>
                  <li><strong>DILARANG KERAS:</strong> .apk, .aab, .dex, .so, .dylib, .ipa, executable binary</li>
                  <li><strong>Jaminan:</strong> Verifikasi SHA-256 per file, atomic staging swap, rollback instan</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PEMERIKSA SEMVER & KEBIJAKAN */}
      {activeSubTab === 'semver' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Simulasi Evaluasi SemVer &amp; Kebijakan Pembaruan (UpdatePolicy)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Uji bagaimana NUSANTARA Mobile mengevaluasi versi SemVer klien vs remote, batas minimum, dan menentukan kebijakan tindakan (opsional, disarankan, wajib, darurat).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Versi Klien Terpasang</label>
              <input
                type="text"
                value={currentVerInput}
                onChange={e => setCurrentVerInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
                placeholder="0.41.0"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Versi Remote di Server</label>
              <input
                type="text"
                value={remoteVerInput}
                onChange={e => setRemoteVerInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
                placeholder="0.42.0"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Batas Versi Minimum</label>
              <input
                type="text"
                value={minVerInput}
                onChange={e => setMinVerInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
                placeholder="0.40.0"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs font-semibold text-slate-300">Pilih Kebijakan Server:</span>
            {(['opsional', 'disarankan', 'wajib', 'keamanan', 'resource_saja'] as KebijakanPembaruan[]).map(pol => (
              <label key={pol} className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="kebijakan"
                  checked={selectedPolicy === pol}
                  onChange={() => setSelectedPolicy(pol)}
                  className="accent-cyan-500"
                />
                <span className="capitalize">{pol.replace('_', ' ')}</span>
              </label>
            ))}
          </div>

          {/* Hasil Evaluasi */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block">
              Hasil Analisis Mesin VersionChecker NUSANTARA:
            </span>
            {'error' in semverResult ? (
              <div className="text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {semverResult.error}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-slate-400">Status Pembaruan:</div>
                  <div className={`font-bold mt-1 ${semverResult.needsUpdate ? 'text-cyan-400' : 'text-emerald-400'}`}>
                    {semverResult.needsUpdate ? 'Pembaruan Tersedia' : 'Aplikasi Sudah Versi Terkini'}
                  </div>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-slate-400">Tipe Perubahan SemVer:</div>
                  <div className="font-mono font-bold text-white mt-1 uppercase">
                    {semverResult.diffType || 'Identik'}
                  </div>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-slate-400">Batas Minimum:</div>
                  <div className={`font-bold mt-1 ${semverResult.isBelowMin ? 'text-red-400' : 'text-emerald-400'}`}>
                    {semverResult.isBelowMin ? 'DI BAWAH BATAS (Blokir)' : 'Memenuhi Syarat'}
                  </div>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-slate-400">Keputusan Kebijakan:</div>
                  <div className="font-mono font-bold text-amber-300 mt-1 capitalize">
                    {semverResult.policyEval}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SALURAN RILIS & PELUNCURAN */}
      {activeSubTab === 'saluran' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              Pengelolaan Saluran Rilis &amp; Staged Rollout
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              NUSANTARA Mobile mendukung 5 saluran rilis terpisah untuk memastikan pengujian bertahap sebelum pembaruan disebarkan ke publik luas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { id: 'development', label: 'Development', desc: 'Pengembangan lokal harian', color: 'border-slate-700' },
              { id: 'alpha', label: 'Alpha', desc: 'Internal QA & Tim Inti', color: 'border-rose-900/80' },
              { id: 'beta', label: 'Beta', desc: 'Penguji publik terdaftar', color: 'border-amber-900/80' },
              { id: 'testing', label: 'Testing / Staging', desc: 'Uji simulasi pra-rilis toko', color: 'border-purple-900/80' },
              { id: 'stable', label: 'Stable (Produksi)', desc: 'Distribusi publik resmi', color: 'border-emerald-900/80' }
            ].map(ch => {
              const isSel = selectedChannel === ch.id;
              return (
                <div
                  key={ch.id}
                  onClick={() => setSelectedChannel(ch.id as SaluranPembaruan)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSel
                      ? 'bg-cyan-950/40 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                      : `bg-slate-950/60 ${ch.color} hover:border-slate-600`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{ch.label}</span>
                    {isSel && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{ch.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Simulasi Peluncuran Bertahap (Staged Rollout):</span>
              <span className="text-xs font-mono font-bold text-cyan-400">100% Pengguna</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full w-full"></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Fase 1: 5% (Canary)</span>
              <span>Fase 2: 20%</span>
              <span>Fase 3: 50%</span>
              <span>Fase 4: 100% (Penuh)</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: MANIFEST & TANDA TANGAN */}
      {activeSubTab === 'manifest' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                Validasi Manifest &amp; Tanda Tangan Digital Kriptografis
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Manifest resmi NUSANTARA ditandatangani secara kanonikal untuk mencegah modifikasi di perjalanan (anti-tamper / MITM).
              </p>
            </div>
            <button
              onClick={() => handleCopy(manifestPayload, 'manifest')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs flex items-center gap-1.5"
            >
              {copiedKey === 'manifest' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'manifest' ? 'Tersalin' : 'Salin JSON'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Isi update-manifest.json Resmi</label>
              <textarea
                value={manifestPayload}
                onChange={e => setManifestPayload(e.target.value)}
                rows={14}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 leading-relaxed"
              />
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-slate-300 block">Status Verifikasi Kriptografi:</span>
                <div className={`p-3 rounded-lg border flex items-start gap-2.5 text-xs ${
                  signatureStatus.valid
                    ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                    : 'bg-red-950/40 border-red-800/80 text-red-300'
                }`}>
                  {signatureStatus.valid ? <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" /> : <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />}
                  <div>
                    <div className="font-bold">{signatureStatus.valid ? 'Tanda Tangan Valid' : 'Tanda Tangan Ditolak'}</div>
                    <div className="text-slate-400 mt-0.5">{signatureStatus.pesan}</div>
                  </div>
                </div>

                <div className="text-xs space-y-2 pt-2">
                  <div className="text-slate-400">Canonical SHA-256 Digest:</div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 break-all">
                    {signatureStatus.digest}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="font-semibold text-slate-300 block">Daftar Kunci Publik Terpercaya (TrustManager):</span>
                <div className="space-y-2">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-mono text-emerald-400 font-bold">nusantara-root-release-2026</div>
                      <div className="text-slate-500 text-[10px]">Root Key • Aktif • Algoritma Ed25519</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] border border-emerald-800">Dipercaya</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-mono text-cyan-400 font-bold">nusantara-backup-release-2026</div>
                      <div className="text-slate-500 text-[10px]">Cadangan • Aktif • Algoritma Ed25519</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[10px] border border-cyan-800">Cadangan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: PEMBARUAN RESOURCE OTA */}
      {activeSubTab === 'ota' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                Siklus Pembaruan Resource &amp; Konten OTA (Over-the-Air)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Simulasikan unduhan paket aset non-eksekutabel (tema, bahasa, konfigurasi) dengan penegakan integritas SHA-256 dan atomic activation swap.
              </p>
            </div>
            <button
              onClick={jalankanSimulasiOTA}
              disabled={otaStatus === 'downloading' || otaStatus === 'verifying' || otaStatus === 'staging'}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Jalankan Siklus OTA</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400">Resource Bundle Aktif</span>
              <div className="text-sm font-bold text-white font-mono">{activeBundleVersion}</div>
              <div className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Terverifikasi &amp; Terpementaskan</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400">Tema Aktif Saat Ini</span>
              <div className="text-sm font-bold text-cyan-300 font-mono">{otaTheme}</div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setOtaTheme('nusantara-garuda-dark')}
                  className={`px-2 py-1 rounded text-[10px] ${otaTheme === 'nusantara-garuda-dark' ? 'bg-cyan-900 text-cyan-200' : 'bg-slate-900 text-slate-400'}`}
                >
                  Garuda Dark
                </button>
                <button
                  onClick={() => setOtaTheme('nusantara-candi-light')}
                  className={`px-2 py-1 rounded text-[10px] ${otaTheme === 'nusantara-candi-light' ? 'bg-cyan-900 text-cyan-200' : 'bg-slate-900 text-slate-400'}`}
                >
                  Candi Light
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400">Bahasa / Lokalisasi OTA</span>
              <div className="text-sm font-bold text-purple-300 font-mono">{otaLang}</div>
              <div className="flex gap-2 pt-1">
                {['id-ID', 'en-US', 'jv-ID', 'su-ID'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setOtaLang(lang)}
                    className={`px-2 py-1 rounded text-[10px] ${otaLang === lang ? 'bg-purple-900 text-purple-200' : 'bg-slate-900 text-slate-400'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Log Aktivitas OTA */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block">
              Log Eksekusi OTA Runtime:
            </span>
            <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 space-y-1.5 min-h-[120px] max-h-[220px] overflow-y-auto">
              {otaLog.length === 0 ? (
                <div className="text-slate-500 italic">Tekan &quot;Jalankan Siklus OTA&quot; untuk memulai simulasi pengunduhan paket...</div>
              ) : (
                otaLog.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{log}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: TOKO APLIKASI (GOOGLE PLAY & APPLE APP STORE) */}
      {activeSubTab === 'store' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Google Play In-App Updates */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
                <Smartphone className="w-4 h-4" />
                Google Play In-App Updates Simulator (Android)
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Mendukung mode Fleksibel (background) dan Segera (Immediate / blocking) menggunakan API resmi AppUpdateManager.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">Pilih Mode Pembaruan:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="playmode"
                    checked={playFlowType === 'flexible'}
                    onChange={() => setPlayFlowType('flexible')}
                    className="accent-emerald-500"
                  />
                  <span>Flexible (Latar Belakang)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="playmode"
                    checked={playFlowType === 'immediate'}
                    onChange={() => setPlayFlowType('immediate')}
                    className="accent-emerald-500"
                  />
                  <span>Immediate (Wajib &amp; Memblokir)</span>
                </label>
              </div>

              <button
                onClick={jalankanPlaySimulasi}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Mulai Simulasi Play In-App Update</span>
              </button>
            </div>

            {/* Status dan Progress Play */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status Alur:</span>
                <span className="font-mono font-bold text-emerald-400 uppercase">{playStatus}</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${playProgress}%` }}
                ></div>
              </div>

              {playStatus === 'downloaded' && playFlowType === 'flexible' && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-lg space-y-2">
                  <div className="text-emerald-300 font-bold">Pembaruan siap dipasang!</div>
                  <p className="text-[11px] text-slate-300">
                    Unduhan di latar belakang selesai. Pengguna dapat mengonfirmasi pemasangan sekarang.
                  </p>
                  <button
                    onClick={konfirmasiInstallPlayFlexible}
                    className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs"
                  >
                    Pasang Sekarang &amp; Mulai Ulang Aplikasi
                  </button>
                </div>
              )}

              {playStatus === 'installed' && (
                <div className="text-emerald-400 font-bold flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aplikasi Android berhasil diperbarui ke v0.42.0!</span>
                </div>
              )}
            </div>
          </div>

          {/* Apple App Store Update */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-bold text-sky-400 text-sm">
                <Smartphone className="w-4 h-4" />
                Apple App Store &amp; StoreKit Update Bridge (iOS)
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Kepatuhan ketat terhadap aturan Apple: pengalihan resmi ke App Store via StoreKit atau deep link https://apps.apple.com/app/id...
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Bundle ID:</span>
                <span className="font-mono text-white">org.nusantara.app</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>App Store ID:</span>
                <span className="font-mono text-white">1234567890</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Tautan Toko:</span>
                <span className="font-mono text-sky-300 truncate max-w-[220px]">
                  https://apps.apple.com/app/id1234567890
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="text-slate-300 font-semibold">Kebijakan Kepatuhan Apple App Review:</div>
                <div className="p-3 bg-slate-900 rounded-lg text-slate-400 text-[11px] leading-relaxed">
                  NUSANTARA Mobile secara ketat melarang bypass biner iOS. Perubahan kode biner wajib diarahkan ke App Store. Fitur OTA hanya mengubah file data/resource yang terisolasi di direktori Documents/Library aplikasi.
                </div>
              </div>

              <a
                href="https://apps.apple.com/app/id1234567890"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Halaman Toko Resmi (Simulasi)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: ROLLBACK & PEMULIHAN */}
      {activeSubTab === 'rollback' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-cyan-400" />
                Mekanisme Rollback Resource &amp; Safe Mode Recovery
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Jika pembaruan resource OTA menyebabkan kegagalan rendering atau validasi integritas rusak, sistem otomatis mengembalikan snapshot cadangan terakhir.
              </p>
            </div>
            <button
              onClick={jalankanRollback}
              disabled={!hasBackup}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kembalikan ke Cadangan (Rollback)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400">Snapshot Cadangan Tersedia:</span>
              <div className="font-mono font-bold text-emerald-400">bundle-2026.11.01</div>
              <div className="text-slate-500 text-[11px]">Dibuat otomatis sebelum aktivasi bundle terbaru</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400">Crash Threshold (Batas Kerusakan):</span>
              <div className="font-mono font-bold text-amber-400">Maks. 3 Kerusakan Berturut-turut</div>
              <div className="text-slate-500 text-[11px]">Memicu auto-rollback ke Safe Mode</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400">Batas Rollback Biner Asli:</span>
              <div className="font-mono font-bold text-red-400">Tidak Diizinkan di Sisi Klien</div>
              <div className="text-slate-500 text-[11px]">Biner native hanya bisa dikelola via Play Console / App Store</div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 8: LAPORAN AUDIT & CLI */}
      {activeSubTab === 'laporan' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Laporan Audit Pembaruan &amp; Referensi CLI
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Laporan status pembaruan lengkap untuk kepatuhan tim DevOps dan daftar perintah CLI resmi nusantara mobile update.
              </p>
            </div>
            <button
              onClick={() => handleCopy(UpdateReportGenerator.formatKeMarkdown(manager.buatLaporan()), 'laporan')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs flex items-center gap-1.5"
            >
              {copiedKey === 'laporan' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'laporan' ? 'Tersalin' : 'Salin Laporan Markdown'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs font-mono">
            {/* Laporan Markdown Preview */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-sans font-semibold block">Pratinjau Laporan Markdown Resmi:</span>
              <pre className="p-3 bg-slate-900 rounded-lg text-slate-300 text-[11px] overflow-x-auto whitespace-pre leading-relaxed max-h-[320px]">
{UpdateReportGenerator.formatKeMarkdown(manager.buatLaporan())}
              </pre>
            </div>

            {/* CLI Reference */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-sans">
              <span className="text-slate-400 font-semibold block text-xs">Perintah CLI Resmi (nusantara mobile update):</span>
              <div className="space-y-2 font-mono text-xs">
                {[
                  { cmd: 'nusantara mobile update periksa', desc: 'Periksa ketersediaan pembaruan di server' },
                  { cmd: 'nusantara mobile update versi', desc: 'Tampilkan perbandingan SemVer klien vs server' },
                  { cmd: 'nusantara mobile update channel <nama>', desc: 'Ganti saluran rilis (stable/beta/alpha/testing)' },
                  { cmd: 'nusantara mobile update manifest <berkas>', desc: 'Validasi skema dan tanda tangan manifest' },
                  { cmd: 'nusantara mobile update resource unduh', desc: 'Unduh paket resource OTA yang diizinkan' },
                  { cmd: 'nusantara mobile update store status', desc: 'Periksa status Google Play / App Store update' },
                  { cmd: 'nusantara mobile update history', desc: 'Tampilkan riwayat pembaruan yang tersimpan' },
                  { cmd: 'nusantara mobile update laporan', desc: 'Buat laporan audit markdown lengkap' }
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-cyan-300 font-bold">{item.cmd}</div>
                    <div className="text-slate-400 font-sans text-[11px] mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
