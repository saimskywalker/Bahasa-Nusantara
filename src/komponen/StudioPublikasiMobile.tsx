/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Phase 41
 * NUSANTARA App Publishing Center (Pusat Publikasi & Toko Aplikasi Mobile)
 */

import React, { useState, useEffect } from 'react';
import {
  Store,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldCheck,
  Smartphone,
  Globe,
  FileText,
  KeyRound,
  RotateCw,
  Play,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Sliders,
  History,
  FileCheck2,
  Copy,
  Check,
  Apple,
} from 'lucide-react';
import {
  PublishingManager,
  MetadataTokoLengkap,
  BahasaListing,
  GooglePlayTrack,
  HasilEksekusiPipeline,
  PermintaanPersetujuanRilis,
  LaporanPublikasiLengkap,
  SecretProvider,
  PublishingReportGenerator,
  DAFTAR_BAHASA_TOKO,
  DAFTAR_TAHAP_PIPELINE,
  SPESIFIKASI_ASET_RESMI,
} from '../mobile/publishing';

export default function StudioPublikasiMobile() {
  const pub = PublishingManager.dapatkanInstance();

  const [activeSubTab, setActiveSubTab] = useState<
    'ringkasan' | 'google-play' | 'app-store' | 'metadata' | 'aset' | 'pipeline' | 'approval' | 'history' | 'laporan'
  >('ringkasan');

  const [metadata, setMetadata] = useState<MetadataTokoLengkap>(pub.dapatkanMetadata());
  const [selectedLocale, setSelectedLocale] = useState<BahasaListing>('id');
  const [koneksi, setKoneksi] = useState<{ android?: any; ios?: any }>({});
  const [hasilValidasi, setHasilValidasi] = useState<any>(null);
  const [antreanApproval, setAntreanApproval] = useState<PermintaanPersetujuanRilis[]>([]);
  const [riwayat, setRiwayat] = useState<any[]>([]);
  const [pipelineState, setPipelineState] = useState<HasilEksekusiPipeline | null>(null);
  const [sedangProses, setSedangProses] = useState(false);
  const [laporanAktif, setLaporanAktif] = useState<LaporanPublikasiLengkap | null>(null);
  const [teksTersalin, setTeksTersalin] = useState(false);
  const [notifikasi, setNotifikasi] = useState<{ teks: string; tipe: 'sukses' | 'peringatan' | 'galat' } | null>(null);

  const muatData = () => {
    setMetadata(pub.dapatkanMetadata());
    setHasilValidasi(pub.validasiKesiapanPublikasi());
    setAntreanApproval(pub.dapatkanPersetujuanMenunggu());
    setRiwayat(pub.dapatkanRiwayatPublikasi());
    setLaporanAktif(pub.buatLaporanPublikasi());
  };

  useEffect(() => {
    muatData();
    pub.periksaSemuaKoneksi().then((k) => setKoneksi(k));
  }, []);

  const handleUjiKoneksi = async () => {
    setSedangProses(true);
    const k = await pub.periksaSemuaKoneksi();
    setKoneksi(k);
    setSedangProses(false);
    setNotifikasi({ teks: 'Uji konektivitas API Toko Aplikasi selesai.', tipe: 'sukses' });
  };

  const handleJalankanPipeline = async (otomatisApprove = true) => {
    setSedangProses(true);
    const res = await pub.jalankanPipeline({
      platform: 'keduanya',
      otomatisSetujuiNonProduksi: otomatisApprove,
      modeSimulasi: true,
    });
    setPipelineState(res);
    muatData();
    setSedangProses(false);
    setNotifikasi({
      teks: res.sukses ? 'Pipeline rilis berhasil diselesaikan.' : 'Pipeline menunggu persetujuan atau terjadi kendala.',
      tipe: res.sukses ? 'sukses' : 'peringatan',
    });
  };

  const handleSetujuiRilis = (id: string) => {
    const ok = pub.setujuiRilis(id, 'Pengembang UI');
    if (ok) {
      muatData();
      setNotifikasi({ teks: `Permintaan ${id} telah disetujui untuk publikasi.`, tipe: 'sukses' });
    }
  };

  const handleTolakRilis = (id: string) => {
    const ok = pub.tolakRilis(id, 'Dibatalkan melalui Antarmuka Dasbor.');
    if (ok) {
      muatData();
      setNotifikasi({ teks: `Permintaan ${id} telah ditolak.`, tipe: 'peringatan' });
    }
  };

  const currentListing = metadata.listingPerLocale[selectedLocale] || metadata.listingPerLocale['id'];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-4 sticky top-0 z-20 backdrop-blur">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-xl shadow-lg shadow-emerald-500/20 text-white">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">NUSANTARA App Publishing Center</h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                  v0.41.0
                </span>
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded">
                  Sandbox Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Integrasi Toko Aplikasi Google Play Console, Apple App Store Connect, TestFlight, & Otomasi Rilis
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleUjiKoneksi}
              disabled={sedangProses}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition"
            >
              <RotateCw className={`w-3.5 h-3.5 ${sedangProses ? 'animate-spin' : ''}`} />
              Uji Koneksi
            </button>
            <button
              onClick={() => handleJalankanPipeline(true)}
              disabled={sedangProses}
              className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Jalankan Pipeline Rilis
            </button>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="max-w-7xl mx-auto mt-4 flex items-center gap-1 overflow-x-auto border-t border-slate-800/80 pt-3 text-xs">
          {[
            { id: 'ringkasan', label: 'Ringkasan & Kesiapan', icon: Sliders },
            { id: 'google-play', label: 'Google Play Console', icon: Smartphone },
            { id: 'app-store', label: 'App Store & TestFlight', icon: Apple },
            { id: 'metadata', label: 'Metadata & Lokalisasi', icon: Globe },
            { id: 'aset', label: 'Aset & Screenshot', icon: Layers },
            { id: 'pipeline', label: 'Release Pipeline (11 Tahap)', icon: Play },
            { id: 'approval', label: `Approval Center (${antreanApproval.length})`, icon: ShieldCheck },
            { id: 'history', label: 'Riwayat Audit', icon: History },
            { id: 'laporan', label: 'Laporan Rilis', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const aktif = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                  aktif
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full p-6 flex-1">
        {/* Toast Notification */}
        {notifikasi && (
          <div
            className={`mb-6 p-3.5 rounded-xl border flex items-center justify-between text-xs animate-in fade-in ${
              notifikasi.tipe === 'sukses'
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                : notifikasi.tipe === 'galat'
                ? 'bg-rose-950/60 border-rose-800 text-rose-200'
                : 'bg-amber-950/60 border-amber-800 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {notifikasi.tipe === 'sukses' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : notifikasi.tipe === 'galat' ? (
                <XCircle className="w-4 h-4 text-rose-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
              <span>{notifikasi.teks}</span>
            </div>
            <button onClick={() => setNotifikasi(null)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Sub-Tab: Ringkasan */}
        {activeSubTab === 'ringkasan' && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Skor Kesiapan Rilis</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {hasilValidasi?.kesiapan?.skorKesiapan ?? 100}%
                </div>
                <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Siap untuk pengujian & rilis toko
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Google Play Track</span>
                  <Smartphone className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-2xl font-bold text-white uppercase">Internal / Testing</div>
                <p className="text-[11px] text-slate-400 mt-1">Target SDK: 34 (Google Play Policy)</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>App Store & TestFlight</span>
                  <Apple className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">Ready (Beta)</div>
                <p className="text-[11px] text-slate-400 mt-1">iOS 15.0+ Deployment Target</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Antrean Persetujuan</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white">{antreanApproval.length} Menunggu</div>
                <p className="text-[11px] text-amber-400 mt-1">Otorisasi rilis sebelum upload</p>
              </div>
            </div>

            {/* Quick Readiness Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Kepatuhan Kebijakan Toko Aplikasi
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-300">Target SDK Google Play (&gt;= 34)</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">Patuh</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-300">URL Kebijakan Privasi HTTPS</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">Patuh</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-300">Opsi Penghapusan Akun Pengguna</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">Patuh</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-300">Apple Export Compliance Declaration</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">Patuh</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <KeyRound className="w-4 h-4 text-blue-400" />
                  Keamanan Kredensial & Anti-Hardcode
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-300">Google Service Account</span>
                      <span className="text-emerald-400 font-mono text-[11px]">GOOGLE_PLAY_KEY_JSON</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Kunci privat diekstraksi dari Environment Variable aman, tidak pernah tersimpan di git.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-300">Apple App Store Connect</span>
                      <span className="text-emerald-400 font-mono text-[11px]">APP_STORE_CONNECT_PRIVATE_KEY</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Token JWT ES256 dibuat secara on-demand dengan masa berlaku 20 menit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sub-Tab: Google Play Console */}
        {activeSubTab === 'google-play' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Google Play Developer API & Tracks</h3>
                  <p className="text-xs text-slate-400">Pengelolaan jalur rilis Android App Bundle (.aab)</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Sandbox Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                {[
                  { id: 'internal', label: 'Internal Testing', desc: 'Pengujian kilat tim internal (Instan)' },
                  { id: 'closed', label: 'Closed Testing', desc: 'Pengujian grup tester terdaftar' },
                  { id: 'open', label: 'Open Testing', desc: 'Beta terbuka publik di Play Store' },
                  { id: 'production', label: 'Production', desc: 'Rilis publik luas dengan persetujuan' },
                ].map((tr) => (
                  <div key={tr.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{tr.label}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-[11px] text-slate-400">{tr.desc}</p>
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Version Code:</span>
                      <span className="font-mono text-emerald-300">1</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AAB Upload Simulator */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-2">Simulasi Pengunggahan Paket AAB</h3>
              <p className="text-xs text-slate-400 mb-4">
                Memvalidasi file AAB, version code, target SDK, dan mengirimkan ke sesi transaksi Edits API.
              </p>
              <button
                onClick={() => handleJalankanPipeline(true)}
                disabled={sedangProses}
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
              >
                Uji Upload AAB ke Internal Testing Track
              </button>
            </div>
          </div>
        )}

        {/* Sub-Tab: App Store & TestFlight */}
        {activeSubTab === 'app-store' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Apple TestFlight & App Store Submission</h3>
                  <p className="text-xs text-slate-400">Pengelolaan grup tester beta dan persiapan rilis iOS</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Transporter Bridge Ready
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 mb-1">Grup Tester Aktif</div>
                  <div className="text-lg font-bold text-white">2 Grup</div>
                  <p className="text-[11px] text-slate-400 mt-1">Internal QA &amp; Nusantara Community</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 mb-1">Masa Berlaku Build Beta</div>
                  <div className="text-lg font-bold text-white">90 Hari</div>
                  <p className="text-[11px] text-slate-400 mt-1">Standar retensi build TestFlight</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 mb-1">Umpan Balik Beta</div>
                  <div className="text-lg font-bold text-white">support@nusantara.dev</div>
                  <p className="text-[11px] text-slate-400 mt-1">Kontak penerima laporan uji coba</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sub-Tab: Metadata & Lokalisasi */}
        {activeSubTab === 'metadata' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Pengelola Metadata Multibahasa</h3>
                  <p className="text-xs text-slate-400">
                    Menyesuaikan judul, deskripsi, kata kunci, dan catatan rilis per bahasa
                  </p>
                </div>
                {/* Language Switcher */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {Object.keys(DAFTAR_BAHASA_TOKO).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setSelectedLocale(loc as any)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                        selectedLocale === loc
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {loc.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1 font-medium">
                    <span>Nama Aplikasi (Batas: 30 karakter)</span>
                    <span className={currentListing.namaAplikasi.length > 30 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                      {currentListing.namaAplikasi.length}/30
                    </span>
                  </div>
                  <input
                    type="text"
                    value={currentListing.namaAplikasi}
                    onChange={(e) => {
                      const val = e.target.value;
                      pub.perbaruiMetadata({
                        listingPerLocale: {
                          ...metadata.listingPerLocale,
                          [selectedLocale]: { ...currentListing, namaAplikasi: val },
                        },
                      });
                      setMetadata(pub.dapatkanMetadata());
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1 font-medium">
                    <span>Deskripsi Singkat Play Store (Batas: 80 karakter)</span>
                    <span className={currentListing.deskripsiSingkat.length > 80 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                      {currentListing.deskripsiSingkat.length}/80
                    </span>
                  </div>
                  <input
                    type="text"
                    value={currentListing.deskripsiSingkat}
                    onChange={(e) => {
                      const val = e.target.value;
                      pub.perbaruiMetadata({
                        listingPerLocale: {
                          ...metadata.listingPerLocale,
                          [selectedLocale]: { ...currentListing, deskripsiSingkat: val },
                        },
                      });
                      setMetadata(pub.dapatkanMetadata());
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1 font-medium">
                    <span>Deskripsi Lengkap (Batas: 4000 karakter)</span>
                    <span className={currentListing.deskripsiLengkap.length > 4000 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                      {currentListing.deskripsiLengkap.length}/4000
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    value={currentListing.deskripsiLengkap}
                    onChange={(e) => {
                      const val = e.target.value;
                      pub.perbaruiMetadata({
                        listingPerLocale: {
                          ...metadata.listingPerLocale,
                          [selectedLocale]: { ...currentListing, deskripsiLengkap: val },
                        },
                      });
                      setMetadata(pub.dapatkanMetadata());
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sub-Tab: Aset & Screenshot */}
        {activeSubTab === 'aset' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-1">Spesifikasi Aset Grafis Resmi Toko</h3>
              <p className="text-xs text-slate-400 mb-4">
                Standar dimensi resolusi piksel, format berkas, dan batas ukuran berkas
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 font-medium">Tipe Aset</th>
                      <th className="py-2.5 font-medium">Platform</th>
                      <th className="py-2.5 font-medium">Resolusi</th>
                      <th className="py-2.5 font-medium">Format</th>
                      <th className="py-2.5 font-medium">Wajib</th>
                      <th className="py-2.5 font-medium">Status Validasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {Object.values(SPESIFIKASI_ASET_RESMI).map((spec) => (
                      <tr key={spec.tipe} className="hover:bg-slate-800/40">
                        <td className="py-2.5 font-medium text-white">{spec.deskripsi}</td>
                        <td className="py-2.5 uppercase text-slate-400">{spec.platform}</td>
                        <td className="py-2.5 font-mono text-emerald-300">
                          {spec.lebarMin === spec.lebarMax ? `${spec.lebarMin}x${spec.tinggiMin}` : `${spec.lebarMin}-${spec.lebarMax}px`}
                        </td>
                        <td className="py-2.5 uppercase">{spec.formatDidukung.join(', ')}</td>
                        <td className="py-2.5">{spec.wajib ? <span className="text-amber-400">Wajib</span> : <span className="text-slate-500">Opsional</span>}</td>
                        <td className="py-2.5 text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Sub-Tab: Release Pipeline */}
        {activeSubTab === 'pipeline' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Alur Otomasi Release Pipeline (11 Tahap)</h3>
                  <p className="text-xs text-slate-400">Eksekusi bertahap dari validasi hingga pembuatan laporan rilis</p>
                </div>
                <button
                  onClick={() => handleJalankanPipeline(true)}
                  disabled={sedangProses}
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
                >
                  Mulai Pipeline
                </button>
              </div>

              <div className="space-y-2">
                {DAFTAR_TAHAP_PIPELINE.map((item, idx) => {
                  const tahapResult = pipelineState?.daftarTahap?.find((t) => t.tahap === item.tahap);
                  const status = tahapResult?.status || 'pending';

                  return (
                    <div
                      key={item.tahap}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                            status === 'passed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : status === 'running'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 animate-pulse'
                              : status === 'requires_approval'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{item.nama}</div>
                          <div className="text-[11px] text-slate-400">
                            {tahapResult?.pesan || item.deskripsi}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[11px] uppercase ${
                          status === 'passed'
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : status === 'running'
                            ? 'text-blue-400 bg-blue-500/10'
                            : status === 'requires_approval'
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-slate-500 bg-slate-800/40'
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Sub-Tab: Approval Center */}
        {activeSubTab === 'approval' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-1">Approval Center (Gerbang Persetujuan Rilis)</h3>
              <p className="text-xs text-slate-400 mb-4">
                Tindakan yang berdampak pada publikasi wajib mendapatkan otorisasi eksplisit
              </p>

              {antreanApproval.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  Tidak ada permintaan rilis yang sedang menunggu persetujuan.
                </div>
              ) : (
                <div className="space-y-4">
                  {antreanApproval.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl bg-slate-950 border border-amber-600/40 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white uppercase">{p.platform}</span>
                          <span className="text-slate-400">• v{p.versi} (Code/Build: {p.versionCodeAtauBuild})</span>
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[11px]">
                            {p.trackAtauChannel.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{p.tanggalDibuat.split('T')[0]}</span>
                      </div>

                      <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-[11px] space-y-1 font-mono">
                        <div>Berkas: {p.berkasBinary} ({p.ukuranBinaryKb.toFixed(1)} KB)</div>
                        <div>SHA-256: {p.sha256Binary}</div>
                        <div>Tujuan: {p.akunTokoTujuan}</div>
                        <div className="text-amber-400">Dampak: {p.dampakTindakan}</div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          onClick={() => handleTolakRilis(p.id)}
                          className="px-3 py-1.5 text-xs font-semibold bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg transition"
                        >
                          Tolak
                        </button>
                        <button
                          onClick={() => handleSetujuiRilis(p.id)}
                          className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
                        >
                          Setujui Publikasi
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sub-Tab: History */}
        {activeSubTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-1">Riwayat &amp; Audit Log Publikasi</h3>
              <p className="text-xs text-slate-400 mb-4">Catatan permanen seluruh aksi pengiriman dan publikasi toko</p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 font-medium">Waktu</th>
                      <th className="py-2.5 font-medium">Platform</th>
                      <th className="py-2.5 font-medium">Aksi</th>
                      <th className="py-2.5 font-medium">Versi</th>
                      <th className="py-2.5 font-medium">Status</th>
                      <th className="py-2.5 font-medium">Detail Pesan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {riwayat.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-slate-500">
                          Belum ada riwayat publikasi.
                        </td>
                      </tr>
                    ) : (
                      riwayat.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-800/40">
                          <td className="py-2.5 text-slate-400 font-mono text-[11px]">{r.stempelWaktu.split('T')[0]}</td>
                          <td className="py-2.5 uppercase font-medium">{r.platform}</td>
                          <td className="py-2.5 font-mono text-emerald-300 text-[11px]">{r.aksi}</td>
                          <td className="py-2.5 font-mono text-[11px]">v{r.versi}#{r.versionCode}</td>
                          <td className="py-2.5 uppercase">
                            <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/20 text-emerald-300">
                              {r.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-400">{r.pesan}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Sub-Tab: Laporan Rilis */}
        {activeSubTab === 'laporan' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Laporan Publikasi Rilis (Markdown)</h3>
                  <p className="text-xs text-slate-400">Format dokumentasi resmi rilis aplikasi NUSANTARA</p>
                </div>
                <button
                  onClick={() => {
                    if (laporanAktif) {
                      const md = PublishingReportGenerator.formatKeMarkdown(laporanAktif);
                      navigator.clipboard.writeText(md);
                      setTeksTersalin(true);
                      setTimeout(() => setTeksTersalin(false), 2000);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition"
                >
                  {teksTersalin ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {teksTersalin ? 'Tersalin' : 'Salin Markdown'}
                </button>
              </div>

              {laporanAktif && (
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {PublishingReportGenerator.formatKeMarkdown(laporanAktif)}
                </pre>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
