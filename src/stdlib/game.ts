/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA Programming Language - Game Development Kit (SDK) (Phase 47)
 * Modul Standar: game (alias: permainan, engine)
 */

import {
  NilaiRuntime,
  JenisNilaiRuntime,
  buatBilangan,
  buatLogika,
  buatTeks,
  buatKosong,
  buatPeta,
  NilaiFungsiBawaan,
} from '../interpreter/nilai';
import { InfoSimbolModul } from '../modul/jenisModul';
import {
  GameApp,
  Vector2,
  Vector3,
  Color,
  Rect,
  Entity,
  World,
  Camera2D,
  Camera3D,
  SaveManager,
} from '../runtime/game';

function buatFungsi(nama: string, eksekusi: (argumen: NilaiRuntime[]) => NilaiRuntime): NilaiFungsiBawaan {
  return {
    jenis: JenisNilaiRuntime.FUNGSI_BAWAAN,
    nama,
    eksekusi,
  };
}

export const simbolEksporGame: Map<string, InfoSimbolModul> = new Map([
  ['buatAplikasiGame', { nama: 'buatAplikasiGame', kategori: 'fungsi', parameter: [{ nama: 'judul', tipe: 'teks' }, { nama: 'lebar', tipe: 'bilangan' }, { nama: 'tinggi', tipe: 'bilangan' }], tipeKembalian: 'peta', minParameter: 0, variadik: true }],
  ['buatGame', { nama: 'buatGame', kategori: 'fungsi', parameter: [{ nama: 'judul', tipe: 'teks' }], tipeKembalian: 'peta', minParameter: 0, variadik: true }],
  ['vektor2', { nama: 'vektor2', kategori: 'fungsi', parameter: [{ nama: 'x', tipe: 'bilangan' }, { nama: 'y', tipe: 'bilangan' }], tipeKembalian: 'peta', minParameter: 0, variadik: true }],
  ['vektor3', { nama: 'vektor3', kategori: 'fungsi', parameter: [{ nama: 'x', tipe: 'bilangan' }, { nama: 'y', tipe: 'bilangan' }, { nama: 'z', tipe: 'bilangan' }], tipeKembalian: 'peta', minParameter: 0, variadik: true }],
  ['warna', { nama: 'warna', kategori: 'fungsi', parameter: [{ nama: 'r', tipe: 'bilangan' }, { nama: 'g', tipe: 'bilangan' }, { nama: 'b', tipe: 'bilangan' }, { nama: 'a', tipe: 'bilangan' }], tipeKembalian: 'peta', minParameter: 3, variadik: true }],
  ['kotak', { nama: 'kotak', kategori: 'fungsi', parameter: [{ nama: 'x', tipe: 'bilangan' }, { nama: 'y', tipe: 'bilangan' }, { nama: 'l', tipe: 'bilangan' }, { nama: 't', tipe: 'bilangan' }], tipeKembalian: 'peta', minParameter: 4 }],
  ['buatEntitas', { nama: 'buatEntitas', kategori: 'fungsi', parameter: [{ nama: 'nama', tipe: 'teks' }], tipeKembalian: 'peta', minParameter: 0, variadik: true }],
  ['buatDunia', { nama: 'buatDunia', kategori: 'fungsi', parameter: [], tipeKembalian: 'peta', minParameter: 0 }],
  ['buatAdegan', { nama: 'buatAdegan', kategori: 'fungsi', parameter: [{ nama: 'nama', tipe: 'teks' }], tipeKembalian: 'peta', minParameter: 1 }],
  ['kamera2D', { nama: 'kamera2D', kategori: 'fungsi', parameter: [{ nama: 'x', tipe: 'bilangan' }, { nama: 'y', tipe: 'bilangan' }], tipeKembalian: 'peta', minParameter: 0, variadik: true }],
  ['kamera3D', { nama: 'kamera3D', kategori: 'fungsi', parameter: [], tipeKembalian: 'peta', minParameter: 0 }],
  ['buatPartikel', { nama: 'buatPartikel', kategori: 'fungsi', parameter: [{ nama: 'x', tipe: 'bilangan' }, { nama: 'y', tipe: 'bilangan' }], tipeKembalian: 'peta', minParameter: 0, variadik: true }],
  ['buatTombolUI', { nama: 'buatTombolUI', kategori: 'fungsi', parameter: [{ nama: 'id', tipe: 'teks' }, { nama: 'x', tipe: 'bilangan' }, { nama: 'y', tipe: 'bilangan' }, { nama: 'w', tipe: 'bilangan' }, { nama: 'h', tipe: 'bilangan' }, { nama: 'label', tipe: 'teks' }], tipeKembalian: 'peta', minParameter: 6 }],
  ['buatLabelUI', { nama: 'buatLabelUI', kategori: 'fungsi', parameter: [{ nama: 'id', tipe: 'teks' }, { nama: 'x', tipe: 'bilangan' }, { nama: 'y', tipe: 'bilangan' }, { nama: 'teks', tipe: 'teks' }], tipeKembalian: 'peta', minParameter: 4 }],
  ['buatPanelUI', { nama: 'buatPanelUI', kategori: 'fungsi', parameter: [{ nama: 'id', tipe: 'teks' }, { nama: 'x', tipe: 'bilangan' }, { nama: 'y', tipe: 'bilangan' }, { nama: 'w', tipe: 'bilangan' }, { nama: 'h', tipe: 'bilangan' }], tipeKembalian: 'peta', minParameter: 5 }],
  ['buatProgresUI', { nama: 'buatProgresUI', kategori: 'fungsi', parameter: [{ nama: 'id', tipe: 'teks' }, { nama: 'x', tipe: 'bilangan' }, { nama: 'y', tipe: 'bilangan' }, { nama: 'w', tipe: 'bilangan' }, { nama: 'h', tipe: 'bilangan' }, { nama: 'nilai', tipe: 'bilangan' }], tipeKembalian: 'peta', minParameter: 6 }],
  ['buatKlienJaringan', { nama: 'buatKlienJaringan', kategori: 'fungsi', parameter: [{ nama: 'id', tipe: 'teks' }], tipeKembalian: 'peta', minParameter: 0, variadik: true }],
  ['buatServerJaringan', { nama: 'buatServerJaringan', kategori: 'fungsi', parameter: [{ nama: 'id', tipe: 'teks' }], tipeKembalian: 'peta', minParameter: 0, variadik: true }],
  ['buatManajerSimpan', { nama: 'buatManajerSimpan', kategori: 'fungsi', parameter: [{ nama: 'versi', tipe: 'teks' }], tipeKembalian: 'peta', minParameter: 0, variadik: true }],
]);

export function buatEksporGame(): Map<string, NilaiRuntime> {
  const petaEkspor = new Map<string, NilaiRuntime>();

  // buatAplikasiGame(judul?: string, lebar?: number, tinggi?: number)
  const fnBuatAplikasiGame = buatFungsi('buatAplikasiGame', (argumen) => {
    const judul = argumen[0] && argumen[0].jenis === JenisNilaiRuntime.TEKS ? (argumen[0] as any).nilai : 'Game Nusantara';
    const lebar = argumen[1] && (argumen[1].jenis === JenisNilaiRuntime.BILANGAN || argumen[1].jenis === JenisNilaiRuntime.DESIMAL) ? (argumen[1] as any).nilai : 800;
    const tinggi = argumen[2] && (argumen[2].jenis === JenisNilaiRuntime.BILANGAN || argumen[2].jenis === JenisNilaiRuntime.DESIMAL) ? (argumen[2] as any).nilai : 600;

    const app = new GameApp({ title: judul, width: lebar, height: tinggi });

    const petaApp = new Map<string, NilaiRuntime>();
    petaApp.set('judul', buatTeks(judul));
    petaApp.set('lebar', buatBilangan(lebar));
    petaApp.set('tinggi', buatBilangan(tinggi));

    petaApp.set(
      'langkah',
      buatFungsi('langkah', (args) => {
        const dt = args[0] && (args[0].jenis === JenisNilaiRuntime.BILANGAN || args[0].jenis === JenisNilaiRuntime.DESIMAL) ? (args[0] as any).nilai : 1 / 60;
        app.step(dt);
        return buatKosong();
      })
    );

    petaApp.set(
      'mulai',
      buatFungsi('mulai', () => {
        app.start();
        return buatKosong();
      })
    );

    petaApp.set(
      'berhenti',
      buatFungsi('berhenti', () => {
        app.stop();
        return buatKosong();
      })
    );

    petaApp.set(
      'jeda',
      buatFungsi('jeda', () => {
        app.pause();
        return buatKosong();
      })
    );

    petaApp.set(
      'lanjutkan',
      buatFungsi('lanjutkan', () => {
        app.resume();
        return buatKosong();
      })
    );

    petaApp.set(
      'fps',
      buatFungsi('fps', () => buatBilangan(app.time.fps))
    );

    petaApp.set(
      'jumlahEntitas',
      buatFungsi('jumlahEntitas', () => buatBilangan(app.sceneManager.adeganAktif?.dunia.dapatkanJumlahEntitas() || 0))
    );

    // pasang instance asli internal
    (petaApp as any)._app = app;

    return buatPeta(petaApp);
  });

  petaEkspor.set('buatAplikasiGame', fnBuatAplikasiGame);
  petaEkspor.set('buatGame', fnBuatAplikasiGame);

  // vektor2(x, y)
  petaEkspor.set(
    'vektor2',
    buatFungsi('vektor2', (args) => {
      const x = args[0] && (args[0].jenis === JenisNilaiRuntime.BILANGAN || args[0].jenis === JenisNilaiRuntime.DESIMAL) ? (args[0] as any).nilai : 0;
      const y = args[1] && (args[1].jenis === JenisNilaiRuntime.BILANGAN || args[1].jenis === JenisNilaiRuntime.DESIMAL) ? (args[1] as any).nilai : 0;
      const v = new Vector2(x, y);

      const m = new Map<string, NilaiRuntime>();
      m.set('x', buatBilangan(x));
      m.set('y', buatBilangan(y));
      m.set(
        'panjang',
        buatFungsi('panjang', () => buatBilangan(v.length()))
      );
      return buatPeta(m);
    })
  );

  // vektor3(x, y, z)
  petaEkspor.set(
    'vektor3',
    buatFungsi('vektor3', (args) => {
      const x = args[0] && (args[0].jenis === JenisNilaiRuntime.BILANGAN || args[0].jenis === JenisNilaiRuntime.DESIMAL) ? (args[0] as any).nilai : 0;
      const y = args[1] && (args[1].jenis === JenisNilaiRuntime.BILANGAN || args[1].jenis === JenisNilaiRuntime.DESIMAL) ? (args[1] as any).nilai : 0;
      const z = args[2] && (args[2].jenis === JenisNilaiRuntime.BILANGAN || args[2].jenis === JenisNilaiRuntime.DESIMAL) ? (args[2] as any).nilai : 0;
      const v = new Vector3(x, y, z);

      const m = new Map<string, NilaiRuntime>();
      m.set('x', buatBilangan(x));
      m.set('y', buatBilangan(y));
      m.set('z', buatBilangan(z));
      m.set(
        'panjang',
        buatFungsi('panjang', () => buatBilangan(v.length()))
      );
      return buatPeta(m);
    })
  );

  // warna(r, g, b, a)
  petaEkspor.set(
    'warna',
    buatFungsi('warna', (args) => {
      const r = args[0] && (args[0].jenis === JenisNilaiRuntime.BILANGAN || args[0].jenis === JenisNilaiRuntime.DESIMAL) ? (args[0] as any).nilai : 1;
      const g = args[1] && (args[1].jenis === JenisNilaiRuntime.BILANGAN || args[1].jenis === JenisNilaiRuntime.DESIMAL) ? (args[1] as any).nilai : 1;
      const b = args[2] && (args[2].jenis === JenisNilaiRuntime.BILANGAN || args[2].jenis === JenisNilaiRuntime.DESIMAL) ? (args[2] as any).nilai : 1;
      const a = args[3] && (args[3].jenis === JenisNilaiRuntime.BILANGAN || args[3].jenis === JenisNilaiRuntime.DESIMAL) ? (args[3] as any).nilai : 1;
      const c = new Color(r, g, b, a);

      const m = new Map<string, NilaiRuntime>();
      m.set('r', buatBilangan(r));
      m.set('g', buatBilangan(g));
      m.set('b', buatBilangan(b));
      m.set('a', buatBilangan(a));
      m.set('hex', buatTeks(c.toHex()));
      m.set('rgba', buatTeks(c.toRgbaString()));
      return buatPeta(m);
    })
  );

  // kotak(x, y, l, t)
  petaEkspor.set(
    'kotak',
    buatFungsi('kotak', (args) => {
      const x = args[0] && (args[0].jenis === JenisNilaiRuntime.BILANGAN || args[0].jenis === JenisNilaiRuntime.DESIMAL) ? (args[0] as any).nilai : 0;
      const y = args[1] && (args[1].jenis === JenisNilaiRuntime.BILANGAN || args[1].jenis === JenisNilaiRuntime.DESIMAL) ? (args[1] as any).nilai : 0;
      const w = args[2] && (args[2].jenis === JenisNilaiRuntime.BILANGAN || args[2].jenis === JenisNilaiRuntime.DESIMAL) ? (args[2] as any).nilai : 0;
      const h = args[3] && (args[3].jenis === JenisNilaiRuntime.BILANGAN || args[3].jenis === JenisNilaiRuntime.DESIMAL) ? (args[3] as any).nilai : 0;
      const rect = new Rect(x, y, w, h);

      const m = new Map<string, NilaiRuntime>();
      m.set('x', buatBilangan(x));
      m.set('y', buatBilangan(y));
      m.set('lebar', buatBilangan(w));
      m.set('tinggi', buatBilangan(h));
      m.set(
        'berisi',
        buatFungsi('berisi', (p) => {
          const px = p[0] && (p[0].jenis === JenisNilaiRuntime.BILANGAN || p[0].jenis === JenisNilaiRuntime.DESIMAL) ? (p[0] as any).nilai : 0;
          const py = p[1] && (p[1].jenis === JenisNilaiRuntime.BILANGAN || p[1].jenis === JenisNilaiRuntime.DESIMAL) ? (p[1] as any).nilai : 0;
          return buatLogika(rect.contains(px, py));
        })
      );
      return buatPeta(m);
    })
  );

  // buatEntitas(nama?: string)
  petaEkspor.set(
    'buatEntitas',
    buatFungsi('buatEntitas', (args) => {
      const nama = args[0] && args[0].jenis === JenisNilaiRuntime.TEKS ? (args[0] as any).nilai : 'Entitas';
      const entity = new Entity(nama);

      const m = new Map<string, NilaiRuntime>();
      m.set('id', buatTeks(String(entity.id)));
      m.set('nama', buatTeks(entity.name));
      m.set('aktif', buatLogika(entity.active));
      m.set(
        'jumlahKomponen',
        buatFungsi('jumlahKomponen', () => buatBilangan(entity.getAllComponents().length))
      );
      (m as any)._entity = entity;
      return buatPeta(m);
    })
  );

  // buatDunia()
  petaEkspor.set(
    'buatDunia',
    buatFungsi('buatDunia', () => {
      const world = new World();
      const m = new Map<string, NilaiRuntime>();
      m.set(
        'buatEntitas',
        buatFungsi('buatEntitas', (args) => {
          const nama = args[0] && args[0].jenis === JenisNilaiRuntime.TEKS ? (args[0] as any).nilai : 'Entitas';
          const e = world.createEntity(nama);
          return (petaEkspor.get('buatEntitas') as any).eksekusi([buatTeks(e.name)]);
        })
      );
      m.set(
        'jumlahEntitas',
        buatFungsi('jumlahEntitas', () => buatBilangan(world.dapatkanJumlahEntitas()))
      );
      (m as any)._world = world;
      return buatPeta(m);
    })
  );

  // kamera2D
  petaEkspor.set(
    'kamera2D',
    buatFungsi('kamera2D', (args) => {
      const x = args[0] && (args[0].jenis === JenisNilaiRuntime.BILANGAN || args[0].jenis === JenisNilaiRuntime.DESIMAL) ? (args[0] as any).nilai : 0;
      const y = args[1] && (args[1].jenis === JenisNilaiRuntime.BILANGAN || args[1].jenis === JenisNilaiRuntime.DESIMAL) ? (args[1] as any).nilai : 0;
      const cam = new Camera2D(new Vector2(x, y));

      const m = new Map<string, NilaiRuntime>();
      m.set('x', buatBilangan(cam.position.x));
      m.set('y', buatBilangan(cam.position.y));
      m.set('zoom', buatBilangan(cam.zoom));
      (m as any)._camera = cam;
      return buatPeta(m);
    })
  );

  // kamera3D
  petaEkspor.set(
    'kamera3D',
    buatFungsi('kamera3D', () => {
      const cam = new Camera3D();
      const m = new Map<string, NilaiRuntime>();
      m.set('fov', buatBilangan(cam.fov));
      m.set('aspek', buatBilangan(cam.aspect));
      (m as any)._camera = cam;
      return buatPeta(m);
    })
  );

  // buatManajerSimpan
  petaEkspor.set(
    'buatManajerSimpan',
    buatFungsi('buatManajerSimpan', (args) => {
      const v = args[0] && args[0].jenis === JenisNilaiRuntime.TEKS ? (args[0] as any).nilai : '1.0.0';
      const sm = new SaveManager(v);

      const m = new Map<string, NilaiRuntime>();
      m.set(
        'simpan',
        buatFungsi('simpan', (sargs) => {
          const slot = sargs[0] && sargs[0].jenis === JenisNilaiRuntime.TEKS ? (sargs[0] as any).nilai : 'slot1';
          const meta = sm.save(slot, { tersimpan: true });
          return buatTeks(meta.checksum);
        })
      );
      m.set(
        'ada',
        buatFungsi('ada', (sargs) => {
          const slot = sargs[0] && sargs[0].jenis === JenisNilaiRuntime.TEKS ? (sargs[0] as any).nilai : 'slot1';
          return buatLogika(sm.exists(slot));
        })
      );
      return buatPeta(m);
    })
  );

  return petaEkspor;
}
