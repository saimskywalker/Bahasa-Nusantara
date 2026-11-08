/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA QUALITY GATE - SUITE PENGUJIAN PHASE 47: NUSANTARA GAME DEVELOPMENT KIT (GAME SDK)
 * Target Milestone: v0.47.0
 */

import {
  Vector2,
  Vector3,
  Color,
  Rect,
  Time,
  GameEventBus,
  GameLoop,
  GameApp,
  Canvas2DRenderer,
  Camera2D,
  Camera3D,
  Mesh,
  Material,
  MaterialManager,
  Texture,
  TextureManager,
  Shader,
  ShaderManager,
  Light,
  LightType,
  Entity,
  World,
  Scene,
  SceneManager,
  Transform2D,
  Transform3D,
  Sprite,
  MeshRenderer,
  RigidBody2D,
  BoxCollider2D,
  CircleCollider2D,
  AudioSourceComponent,
  AnimationComponent,
  ActorComponent,
  PhysicsWorld2D,
  InputManager,
  AudioManager,
  AudioClip,
  SpriteAnimationController,
  ParticleEmitter2D,
  GameUI,
  UIPanel,
  UIButton,
  UILabel,
  UIProgressBar,
  UISlider,
  AssetManager,
  PacketType,
  PacketSerializer,
  GameNetworkClient,
  GameNetworkServer,
  SaveManager,
  GameProfiler,
  GameProjectGenerator,
} from '../../src/runtime/game';

import { ActorSystem } from '../../src/runtime/actor';
import { NusantaraCLI } from '../../src/paket/cli';
import { PembacaBerkasMemori } from '../../src/modul';
import { Parser } from '../../src/parser/parser';
import { PemeriksaTipe } from '../../src/tipe/pemeriksaTipe';
import { Interpreter } from '../../src/interpreter/interpreter';
import { PenulisOutputBuffer } from '../../src/interpreter/outputWriter';
import { ResolverModul, PemuatModul } from '../../src/modul';
import { apakahModulStandar, normalisasiNamaModulStandar } from '../../src/stdlib';

async function jalankanSemuaPengujian() {
  console.log('======================================================================');
  console.log('  NUSANTARA QUALITY GATE — SUITE 43: GAME DEVELOPMENT KIT (PHASE 47)  ');
  console.log('======================================================================\n');

  let jumlahUji = 0;
  let ujiLulus = 0;
  let ujiGagal = 0;
  let ujiSkipped = 0;

  async function uji(nama: string, fn: () => void | 'SKIPPED' | Promise<void | 'SKIPPED'>) {
    jumlahUji++;
    try {
      const hasil = await fn();
      if (hasil === 'SKIPPED') {
        ujiSkipped++;
        console.log(`  [SKIPPED] ${jumlahUji}. ${nama}`);
      } else {
        ujiLulus++;
        console.log(`  [✓ LULUS] ${jumlahUji}. ${nama}`);
      }
    } catch (err: any) {
      ujiGagal++;
      console.error(`  [✗ GAGAL] ${jumlahUji}. ${nama}`);
      console.error(`      -> ${err.message}`);
    }
  }

  function pastikan(kondisi: boolean, pesan: string) {
    if (!kondisi) {
      throw new Error(`Asersi Gagal: ${pesan}`);
    }
  }

  function samaDengan(aktual: any, diharapkan: any, pesan: string) {
    if (aktual !== diharapkan) {
      throw new Error(`Asersi Gagal: ${pesan} (Aktual: ${aktual}, Diharapkan: ${diharapkan})`);
    }
  }

  // ---------------------------------------------------------------------------
  // 1. GEOMETRI & MATEMATIKA DASAR (Vector2, Vector3, Color, Rect)
  // ---------------------------------------------------------------------------
  await uji('Geometri 2D: Vector2 operasi penjumlahan, skala, jarak, dan normalisasi', () => {
    const v1 = new Vector2(3, 4);
    samaDengan(v1.length(), 5, 'Panjang vektor (3,4) harus 5');
    const v2 = v1.normalized();
    samaDengan(Math.round(v2.length()), 1, 'Panjang vektor normalisasi harus 1');

    const v3 = new Vector2(1, 2).add(new Vector2(2, 3));
    samaDengan(v3.x, 3, 'X harus 3');
    samaDengan(v3.y, 5, 'Y harus 5');
    samaDengan(v1.distanceTo(new Vector2(3, 8)), 4, 'Jarak vertikal harus 4');
  });

  await uji('Geometri 3D: Vector3 dot product, cross product, dan panjang', () => {
    const vA = new Vector3(1, 0, 0);
    const vB = new Vector3(0, 1, 0);
    const vCross = vA.cross(vB);
    samaDengan(vCross.x, 0, 'Cross X harus 0');
    samaDengan(vCross.y, 0, 'Cross Y harus 0');
    samaDengan(vCross.z, 1, 'Cross Z harus 1 (vektor normal sumbu Z)');
    samaDengan(vA.dot(vB), 0, 'Dot product vektor tegak lurus harus 0');
  });

  await uji('Warna: Color heksadesimal, string RGBA, dan konstanta bawaan', () => {
    const c = new Color(1, 0, 0, 1);
    samaDengan(c.toHex().toUpperCase(), '#FF0000', 'Hex merah harus #FF0000');
    samaDengan(c.toRgbaString(), 'rgba(255, 0, 0, 1)', 'String RGBA harus valid');
    const hitam = Color.hitam();
    samaDengan(hitam.r, 0, 'Hitam r harus 0');
    const putih = Color.putih();
    samaDengan(putih.r, 1, 'Putih r harus 1');
  });

  await uji('Batas Geometris: Rect hit test, overlap, dan ekspansi', () => {
    const r1 = new Rect(10, 10, 50, 50);
    pastikan(r1.contains(20, 20), 'Titik (20,20) harus berada dalam kotak');
    pastikan(!r1.contains(5, 5), 'Titik (5,5) harus berada di luar kotak');

    const r2 = new Rect(40, 40, 50, 50);
    pastikan(r1.intersects(r2), 'r1 dan r2 harus saling beririsan (overlap)');
    const r3 = new Rect(100, 100, 10, 10);
    pastikan(!r1.intersects(r3), 'r1 dan r3 tidak boleh beririsan');
  });

  // ---------------------------------------------------------------------------
  // 2. CORE ENGINE & GAME LOOP
  // ---------------------------------------------------------------------------
  await uji('Time: delta time, unscaled delta time, time scale, dan FPS kalkulasi', () => {
    const t = new Time();
    t.update(0.01667);
    samaDengan(t.frameCount, 1, 'Frame count harus 1');
    samaDengan(t.fps, 60, 'FPS harus 60');

    t.timeScale = 0.5;
    t.update(0.02);
    samaDengan(t.unscaledDeltaTime, 0.02, 'Unscaled dt harus 0.02');
    samaDengan(t.deltaTime, 0.01, 'Scaled dt harus 0.01 saat timeScale=0.5');
    t.timeScale = 1.0;
  });

  await uji('Event Bus: pendaftaran langganan, pengiriman peristiwa, dan sekali jalan (once)', () => {
    const bus = new GameEventBus();
    let counter = 0;
    const unsub = bus.on('skor_naik', (data: any) => {
      counter += data.poin;
    });

    bus.emit('skor_naik', { poin: 10 });
    samaDengan(counter, 10, 'Counter skor harus 10');

    unsub();
    bus.emit('skor_naik', { poin: 5 });
    samaDengan(counter, 10, 'Setelah unsub, counter tidak boleh bertambah');

    let sekali = 0;
    bus.once('level_selesai', () => {
      sekali++;
    });
    bus.emit('level_selesai');
    bus.emit('level_selesai');
    samaDengan(sekali, 1, 'Peristiwa once hanya boleh dieksekusi 1 kali');
  });

  await uji('GameLoop: fixed timestep accumulator memproses sub-step secara deterministik', () => {
    let fixedTicks = 0;
    let varTicks = 0;
    let renders = 0;

    const loop = new GameLoop(
      {
        targetFps: 60,
        fixedTimestep: 1 / 60,
      },
      {
        onUpdate: () => varTicks++,
        onFixedUpdate: () => fixedTicks++,
        onRender: () => renders++,
      }
    );

    // Langkah dengan 1/30 detik (33.33ms) -> harus memicu tepat 2 fixed updates
    loop.step(1 / 30);
    samaDengan(varTicks, 1, 'Harus ada 1 variable update');
    samaDengan(fixedTicks, 2, 'Harus ada tepat 2 fixed update sub-steps');
    samaDengan(renders, 1, 'Harus ada 1 render call');
  });

  await uji('GameApp: inisialisasi aplikasi lengkap, pause, resume, dan deterministik step', () => {
    const app = new GameApp({ title: 'UjiApp', width: 640, height: 480 });
    samaDengan(app.config.width, 640, 'Lebar harus 640');
    samaDengan(app.config.height, 480, 'Tinggi harus 480');

    app.init();
    const fAwal = app.time.frameCount;
    app.step(1 / 60);

    samaDengan(app.time.frameCount, fAwal + 1, 'Satu langkah step harus menambah frame count');
    const stats = app.renderer.getStats();
    pastikan(stats.drawCalls >= 0, 'Draw call renderer harus tercatat');
  });

  // ---------------------------------------------------------------------------
  // 3. MESIN GRAFIKA & KAMERA
  // ---------------------------------------------------------------------------
  await uji('Canvas2DRenderer: virtual rasterizer command buffer dan statistik gambar', () => {
    const renderer = new Canvas2DRenderer(800, 600);
    renderer.clear(Color.hitam());
    renderer.drawRect(10, 10, 100, 50, Color.merah());
    renderer.drawCircle(200, 200, 30, Color.hijau());
    renderer.drawLine(0, 0, 100, 100, Color.biru());
    renderer.drawText('Nusantara', 50, 50, Color.putih());
    renderer.flush();

    const stats = renderer.getStats();
    samaDengan(stats.drawCalls, 5, 'Harus ada 5 panggilan gambar (clear, rect, circle, line, text)');
    pastikan(stats.triangles >= 2, 'Persegi panjang minimal harus menghasilkan 2 segitiga');
  });

  await uji('Kamera 2D: transformasi screenToWorld, worldToScreen, zoom, dan bounds clamp', () => {
    const cam = new Camera2D(new Vector2(0, 0), 2.0); // zoom 2x
    cam.viewportSize = new Vector2(800, 600);

    const worldPoint = cam.screenToWorld(400, 300); // titik tengah layar
    samaDengan(worldPoint.x, 0, 'Titik tengah layar harus memetakan ke pusat kamera (0,0)');
    samaDengan(worldPoint.y, 0, 'Titik tengah layar harus memetakan ke pusat kamera (0,0)');

    const screenPoint = cam.worldToScreen(0, 0);
    samaDengan(screenPoint.x, 400, 'Pusat kamera harus memetakan ke (400,300) layar');
    samaDengan(screenPoint.y, 300, 'Pusat kamera harus memetakan ke (400,300) layar');

    cam.bounds = new Rect(-100, -100, 200, 200);
    cam.position = new Vector2(500, 500);
    cam.update(0.016);
    pastikan(cam.position.x <= 100, 'Posisi X kamera harus dibatasi oleh bounds');
  });

  await uji('Kamera 3D & Primitif Mesh: pembuatan kubus, bola, dan bidang datar', () => {
    const cam3D = new Camera3D();
    samaDengan(cam3D.fov, 60, 'Default FOV harus 60 derajat');
    samaDengan(cam3D.aspect, 800 / 600, 'Default aspect ratio harus 800/600');

    const kubus = Mesh.createCube('kubus_uji', 2);
    samaDengan(kubus.vertexCount, 24, 'Kubus harus memiliki 24 verteks (4 x 6 sisi)');
    samaDengan(kubus.indices.length, 36, 'Kubus harus memiliki 36 indeks (12 segitiga)');
    samaDengan(kubus.getTriangleCount(), 12, 'Jumlah segitiga harus 12');

    const plane = Mesh.createPlane('bidang_uji', 10, 10);
    samaDengan(plane.getTriangleCount(), 2, 'Bidang datar harus memiliki 2 segitiga');
  });

  await uji('Material, Tekstur, Shader, dan Pencahayaan', () => {
    const matMgr = new MaterialManager();
    const mat = matMgr.create('mat_dasar', { diffuseColor: Color.merah(), shininess: 32 });
    samaDengan(mat.diffuseColor.toHex().toUpperCase(), '#FF0000', 'Warna diffuse harus merah');

    const texMgr = new TextureManager();
    const tex = texMgr.createSolidTexture('tex_putih', 16, 16, Color.putih());
    samaDengan(tex.width, 16, 'Lebar tekstur harus 16');
    samaDengan(tex.isLoaded, true, 'Tekstur solid harus berstatus loaded');

    const shaderMgr = new ShaderManager();
    const shader = shaderMgr.createDefaultShader();
    samaDengan(shader.compiled, true, 'Shader default harus berstatus terkompilasi');

    const light = new Light('lampu_matahari', LightType.DIRECTIONAL, Color.putih(), 1.0);
    samaDengan(light.type, LightType.DIRECTIONAL, 'Tipe lampu harus directional');
  });

  // ---------------------------------------------------------------------------
  // 4. ENTITY COMPONENT SYSTEM (ECS) & SCENE
  // ---------------------------------------------------------------------------
  await uji('ECS: Entity, penambahan komponen, kueri sparse, dan hirarki parent/children', () => {
    const world = new World();
    const pahlawan = world.createEntity('Pahlawan');
    pahlawan.addComponent(new Transform2D(100, 200));
    pahlawan.addComponent(new Sprite('tex_pahlawan', 32, 32));

    const monster = world.createEntity('Monster');
    monster.addComponent(new Transform2D(300, 200));

    const hasilKueri = world.query([Transform2D, Sprite]);
    samaDengan(hasilKueri.length, 1, 'Hanya Pahlawan yang memiliki Transform2D DAN Sprite');
    samaDengan(hasilKueri[0].id, pahlawan.id, 'Entitas yang ditemukan harus Pahlawan');

    // Hirarki
    const senjata = world.createEntity('Pedang');
    pahlawan.addChild(senjata);
    samaDengan(senjata.parent?.id, pahlawan.id, 'Parent senjata harus pahlawan');
    samaDengan(pahlawan.children.length, 1, 'Anak pahlawan harus ada 1');
  });

  await uji('ECS: Serialisasi dan Deserialisasi Dunia (Save/Load ECS State)', () => {
    const world = new World();
    const e = world.createEntity('PemainSimpan');
    e.addComponent(new Transform2D(50, 75, Math.PI / 4));
    e.addComponent(new Sprite('tex1', 64, 64, Color.merah()));

    const json = world.serialize();
    const world2 = new World();
    world2.deserialize(json);

    samaDengan(world2.dapatkanJumlahEntitas(), 1, 'Dunia baru harus memiliki 1 entitas');
    const pemulihan = world2.findEntityByName('PemainSimpan');
    pastikan(pemulihan !== undefined, 'Entitas PemainSimpan harus ditemukan');
    const t = pemulihan!.getComponent(Transform2D)!;
    samaDengan(t.x, 50, 'Koordinat X harus 50');
    samaDengan(t.y, 75, 'Koordinat Y harus 75');
  });

  await uji('Scene & SceneManager: pendaftaran, transisi adegan, dan siklus hidup', () => {
    const sm = new SceneManager();
    let mulaiA = false;
    let berhentiA = false;
    let mulaiB = false;

    class AdeganA extends Scene {
      constructor() {
        super('MenuUtama');
      }
      public saatMulai(): void {
        mulaiA = true;
      }
      public saatBerhenti(): void {
        berhentiA = true;
      }
    }

    class AdeganB extends Scene {
      constructor() {
        super('Level1');
      }
      public saatMulai(): void {
        mulaiB = true;
      }
    }

    sm.daftarAdegan(new AdeganA());
    sm.daftarAdegan(new AdeganB());

    sm.gantiAdegan('MenuUtama');
    samaDengan(mulaiA, true, 'Adegan A harus menjalankan saatMulai');
    samaDengan(sm.adeganAktif?.nama, 'MenuUtama', 'Adegan aktif harus MenuUtama');

    sm.gantiAdegan('Level1');
    samaDengan(berhentiA, true, 'Adegan A harus menjalankan saatBerhenti sebelum berganti');
    samaDengan(mulaiB, true, 'Adegan B harus menjalankan saatMulai');
    samaDengan(sm.adeganAktif?.nama, 'Level1', 'Adegan aktif harus Level1');
  });

  // ---------------------------------------------------------------------------
  // 5. FISIKA 2D
  // ---------------------------------------------------------------------------
  await uji('Fisika 2D: Integrasi gravitasi, deteksi tabrakan AABB, dan resolusi benturan', () => {
    const physics = new PhysicsWorld2D(new Vector2(0, 100)); // Gravitasi 100 px/s2
    const body1 = new RigidBody2D(1, 0.5); // Dinamik massa 1
    const col1 = new BoxCollider2D(20, 20);
    const trans1 = new Transform2D(100, 100);

    const body2 = new RigidBody2D(0, 0.5); // Statis (massa 0 = dinding/tanah)
    body2.isStatic = true;
    const col2 = new BoxCollider2D(200, 20);
    const trans2 = new Transform2D(100, 115); // Tanah menopang tepat di bawah body1

    physics.addBody(body1, col1, trans1);
    physics.addBody(body2, col2, trans2);

    samaDengan(physics.getBodyCount(), 2, 'Jumlah tubuh fisika harus 2');

    // Simulasikan 1 sub-step fisika
    physics.step(0.016);
    // Tabrakan harus terdeteksi dan diselesaikan (kecepatan vertikal terhenti/memantul)
    pastikan(trans1.y <= 100, 'Penetrasi ke dalam tanah harus dibatalkan oleh solver');
  });

  await uji('Fisika 2D: Raycasting deteksi halangan garis pandang', () => {
    const physics = new PhysicsWorld2D();
    const body = new RigidBody2D(0);
    body.isStatic = true;
    const col = new BoxCollider2D(40, 40);
    const trans = new Transform2D(100, 100);
    physics.addBody(body, col, trans);

    // Tembakkan sinar dari (0, 100) ke arah kanan (1, 0)
    const hit = physics.raycast(new Vector2(0, 100), new Vector2(1, 0), 200);
    pastikan(hit !== null, 'Sinar harus menabrak kotak di (100,100)');
    samaDengan(Math.round(hit!.distance), 80, 'Jarak tabrakan harus 80 px (100 - setengah lebar 20)');
  });

  // ---------------------------------------------------------------------------
  // 6. SISTEM INPUT
  // ---------------------------------------------------------------------------
  await uji('Input: Penekanan tombol keyboard, status baru ditekan, dan aksi abstrak', () => {
    const input = new InputManager();
    input.petakanAksi('lompat', ['Space', 'KeyW']);

    input.simulasikanTekanTombol('Space');
    samaDengan(input.apakahTombolDitekan('Space'), true, 'Tombol Space harus aktif');
    samaDengan(input.apakahTombolBaruDitekan('Space'), true, 'Tombol Space harus berstatus baru ditekan');
    samaDengan(input.apakahAksiAktif('lompat'), true, 'Aksi lompat harus aktif');

    // Setelah akhir frame, status baru ditekan harus false tapi tombol tetap ditekan
    input.akhirFrame();
    samaDengan(input.apakahTombolDitekan('Space'), true, 'Tombol Space tetap ditekan');
    samaDengan(input.apakahTombolBaruDitekan('Space'), false, 'Status baru ditekan harus false');

    input.simulasikanLepasTombol('Space');
    samaDengan(input.apakahTombolDilepas('Space'), true, 'Status tombol dilepas harus true');
    samaDengan(input.apakahAksiAktif('lompat'), false, 'Aksi lompat harus nonaktif');
  });

  await uji('Input: Posisi mouse dan penekanan tombol klik mouse', () => {
    const input = new InputManager();
    input.simulasikanGerakMouse(250, 350);
    samaDengan(input.posisiMouse().x, 250, 'Posisi X mouse harus 250');
    samaDengan(input.posisiMouse().y, 350, 'Posisi Y mouse harus 350');

    input.simulasikanTekanMouse(0);
    samaDengan(input.apakahTombolMouseDitekan(0), true, 'Tombol kiri mouse harus ditekan');
    input.simulasikanLepasMouse(0);
    samaDengan(input.apakahTombolMouseDitekan(0), false, 'Tombol kiri mouse harus dilepas');
  });

  // ---------------------------------------------------------------------------
  // 7. MESIN AUDIO
  // ---------------------------------------------------------------------------
  await uji('Audio: Registrasi klip suara, pemutaran, jeda, dan hierarki kategori volume', () => {
    const audio = new AudioManager();
    audio.registerClip({ id: 'sfx_ledakan', path: 'audio/boom.wav', duration: 1.5, isLoaded: true });

    samaDengan(audio.hasClip('sfx_ledakan'), true, 'Klip ledakan harus terdaftar');

    const soundId = audio.play('sfx_ledakan', { category: 'sfx', volume: 0.8 });
    pastikan(soundId !== null, 'Pemutaran klip harus menghasilkan ID suara aktif');

    audio.setMasterVolume(0.5);
    audio.setSfxVolume(0.5);
    samaDengan(audio.getMasterVolume(), 0.5, 'Master volume harus 0.5');
    samaDengan(audio.getEffectiveVolume('sfx', 1.0), 0.25, 'Volume efektif SFX (0.5 master x 0.5 sfx) harus 0.25');

    audio.pause(soundId!);
    samaDengan(audio.isPlaying(soundId!), false, 'Setelah jeda, suara tidak boleh playing');
    audio.resume(soundId!);
    samaDengan(audio.isPlaying(soundId!), true, 'Setelah resume, suara harus playing');
    audio.stop(soundId!);
    samaDengan(audio.isPlaying(soundId!), false, 'Setelah stop, suara tidak boleh playing');
  });

  // ---------------------------------------------------------------------------
  // 8. ANIMASI SPRITE & SISTEM PARTIKEL
  // ---------------------------------------------------------------------------
  await uji('Animasi Sprite: Spritesheet slicing, update frame timeline, dan callback selesai', () => {
    const controller = new SpriteAnimationController();
    const clip = SpriteAnimationController.createFromSpritesheet('lari', 128, 32, 32, 32, 0.1, false);
    samaDengan(clip.frames.length, 4, 'Gambar 128x32 dengan petak 32x32 harus menghasilkan 4 frame');

    controller.addClip(clip);
    controller.play('lari');

    samaDengan(controller.getCurrentFrameIndex(), 0, 'Frame awal harus 0');
    controller.update(0.15); // melewati durasi frame 0 (0.1s)
    samaDengan(controller.getCurrentFrameIndex(), 1, 'Frame berikutnya harus 1');

    let animasiSelesai = false;
    controller.onComplete = () => {
      animasiSelesai = true;
    };
    controller.update(0.5); // memajukan sampai habis
    samaDengan(animasiSelesai, true, 'Callback onComplete harus dipanggil');
  });

  await uji('Sistem Partikel: Emisi partikel, penuaan lifetime, dan pergerakan gravitasi', () => {
    const emitter = new ParticleEmitter2D({
      rate: 10,
      maxParticles: 50,
      gravity: new Vector2(0, 100),
      lifetimeMin: 1.0,
      lifetimeMax: 1.0,
      speedMin: 50,
      speedMax: 50,
    });

    emitter.burst(5);
    samaDengan(emitter.getActiveCount(), 5, 'Setelah burst 5 partikel, jumlah partikel harus 5');

    emitter.update(0.1);
    const p = emitter.particles[0];
    pastikan(p.position.y > 0 || p.position.x !== 0, 'Partikel harus bergerak setelah pembaruan');

    emitter.update(1.0); // Melebihi lifetime 1.0s
    samaDengan(emitter.getActiveCount(), 0, 'Partikel harus musnah setelah lifetime habis');
  });

  // ---------------------------------------------------------------------------
  // 9. GAME UI (Antarmuka Pengguna)
  // ---------------------------------------------------------------------------
  await uji('Game UI: UIPanel, UIButton, UILabel, UIProgressBar, dan hit testing input', () => {
    const ui = new GameUI();
    const panel = new UIPanel('panel_utama', 50, 50, 300, 200);

    let tombolDiklik = false;
    const tombol = new UIButton('tombol_mulai', 10, 10, 100, 30, 'Mulai', () => {
      tombolDiklik = true;
    });
    panel.addChild(tombol);

    const progress = new UIProgressBar('darah', 10, 60, 150, 15, 75);
    panel.addChild(progress);

    ui.add(panel);

    samaDengan(progress.getNormalized(), 0.75, 'Nilai normalisasi 75/100 harus 0.75');

    // Uji hit-testing tombol pada posisi global (50 + 10 = 60, 50 + 10 = 60)
    const input = new InputManager();
    input.simulasikanGerakMouse(65, 65);
    input.simulasikanTekanMouse(0);
    ui.processInput(input);

    input.simulasikanLepasMouse(0);
    ui.processInput(input);

    samaDengan(tombolDiklik, true, 'Klik mouse pada tombol harus memicu callback onClick');
  });

  await uji('Game UI: UISlider penggeser nilai dan pembatasan batas', () => {
    let sliderVal = 0;
    const slider = new UISlider('volume_slider', 0, 0, 100, 20, 50, (v) => {
      sliderVal = v;
    });

    slider.setNormalizedValue(0.8);
    samaDengan(slider.value, 80, 'Nilai slider 0.8 harus 80');
    samaDengan(sliderVal, 80, 'Callback onChange harus menerima nilai 80');
  });

  // ---------------------------------------------------------------------------
  // 10. MANAJEMEN ASET & KEAMANAN
  // ---------------------------------------------------------------------------
  await uji('Manajemen Aset: Perlindungan anti path-traversal dan format whitelist', () => {
    const assets = new AssetManager();

    // Jalur legal
    assets.loadTexture('pemain_tex', 'textures/pemain.png');
    pastikan(assets.has('pemain_tex'), 'Tekstur legal harus tersimpan di cache');

    // Penolakan path traversal (../../)
    let tertolakTraversal = false;
    try {
      assets.validatePath('../rahasia.png', 'texture');
    } catch {
      tertolakTraversal = true;
    }
    samaDengan(tertolakTraversal, true, 'Path traversal ../rahasia.png harus ditolak');

    // Penolakan ekstensi tidak sah
    let tertolakEkstensi = false;
    try {
      assets.validatePath('skrip.exe', 'texture');
    } catch {
      tertolakEkstensi = true;
    }
    samaDengan(tertolakEkstensi, true, 'Ekstensi skrip.exe harus ditolak untuk tipe tekstur');
  });

  // ---------------------------------------------------------------------------
  // 11. JARINGAN & MULTIPLAYER
  // ---------------------------------------------------------------------------
  await uji('Jaringan: Serialisasi paket dan pertukaran pesan Client-Server', () => {
    const server = new GameNetworkServer('server_nusantara');
    server.start();

    const klien1 = new GameNetworkClient('klien_arya');
    const klien2 = new GameNetworkClient('klien_bima');

    klien1.connect(server);
    klien2.connect(server);

    samaDengan(server.getConnectedClientCount(), 2, 'Server harus mendeteksi 2 klien');

    let pesanDiterima = '';
    klien2.on(PacketType.STATE_UPDATE, (pkt) => {
      pesanDiterima = (pkt.payload as any).pesan;
    });

    const paket = klien1.createPacket(PacketType.STATE_UPDATE, { pesan: 'Halo Nusantara!' });
    // Broadcast dari server ke seluruh klien selain pengirim
    server.broadcast(paket, klien1.clientId);

    samaDengan(pesanDiterima, 'Halo Nusantara!', 'Klien 2 harus menerima paket broadcast dari Klien 1');

    server.stop();
    samaDengan(server.isRunning, false, 'Server harus berstatus berhenti');
  });

  // ---------------------------------------------------------------------------
  // 12. SISTEM SIMPANAN (SAVE SYSTEM)
  // ---------------------------------------------------------------------------
  await uji('Sistem Simpanan: Checksum integritas, manipulasi data, dan migrasi versi', () => {
    const saveMgr = new SaveManager('1.0.0', 1);

    const meta = saveMgr.save('slot_utama', { level: 5, skor: 1250, nama: 'Pahlawan' });
    pastikan(meta.checksum.length > 0, 'Metadata simpanan harus memiliki checksum hash');

    const loaded = saveMgr.load('slot_utama');
    pastikan(loaded !== null, 'Data tersimpan harus berhasil dimuat');
    samaDengan(loaded!.state.level, 5, 'Level yang dimuat harus 5');

    // Uji proteksi manipulasi: jika state diubah secara ilegal, load harus melempar galat
    (loaded as any).state.level = 999;
    let terdeteksiKorupsi = false;
    try {
      saveMgr.importSlotFromJson(
        JSON.stringify({
          metadata: { ...meta, slotId: 'slot_palsu' },
          state: { level: 9999, skor: 9999 }, // tidak cocok dengan hash checksum asli
        })
      );
    } catch {
      terdeteksiKorupsi = true;
    }
    samaDengan(terdeteksiKorupsi, true, 'Manipulasi data yang tidak cocok dengan checksum harus ditolak');
  });

  // ---------------------------------------------------------------------------
  // 13. INTEGRASI DENGAN ACTOR MODEL (PHASE 46)
  // ---------------------------------------------------------------------------
  await uji('Integrasi Actor Model: ActorComponent mengirim dan menerima pesan via ActorSystem', async () => {
    const actorSystem = new ActorSystem({ maxActors: 50 });
    let responDiterima = '';

    const actorRef = actorSystem.spawn({
      name: 'aktor_entitas_game',
      initialState: { skor: 0 },
      behavior: async (state, msg) => {
        const p = (msg as any)?.payload ?? msg;
        if (p?.aksi === 'HIT') {
          state.skor += 100;
          responDiterima = `SKOR_AKHIR_${state.skor}`;
        }
        return state;
      },
    });

    const entitas = new Entity('EntitasBeraktor');
    const actorComp = new ActorComponent(actorRef);
    entitas.addComponent(actorComp);

    samaDengan(entitas.hasComponent(ActorComponent), true, 'Entitas harus memiliki ActorComponent');

    await actorComp.actorRef.send({ aksi: 'HIT' });

    await new Promise((r) => setTimeout(r, 60));
    samaDengan(responDiterima, 'SKOR_AKHIR_100', 'Aktor harus memproses pesan payload dari ActorComponent');
    await actorSystem.hentikanSemua();
  });

  // ---------------------------------------------------------------------------
  // 14. PERKAKAS & GENERATOR PROYEK GAME
  // ---------------------------------------------------------------------------
  await uji('Project Generator: nusantara game new menghasilkan struktur berkas proyek', () => {
    const files = GameProjectGenerator.generate({ name: 'ProyekUjiGame', template: '2d' });
    pastikan(files.length >= 5, 'Minimal harus ada 5 berkas proyek yang dihasilkan');
    pastikan(files.some((f) => f.path === 'project.nusantara.toml'), 'project.nusantara.toml harus ada');
    pastikan(files.some((f) => f.path === 'src/utama.nusantara'), 'src/utama.nusantara harus ada');
    pastikan(files.some((f) => f.path.includes('adegan_utama.json')), 'adegan_utama.json harus ada');
  });

  await uji('Profiler Game: Pencatatan waktu frame, throughput, dan laporan metrik', () => {
    const profiler = new GameProfiler();
    profiler.startFrame();
    profiler.recordUpdate(2.5);
    profiler.recordPhysics(1.2);
    profiler.recordRender(3.1, 15);
    profiler.endFrame(60, 6.8, 50);

    const summary = profiler.getSummary();
    pastikan(summary.includes('FPS'), 'Ringkasan harus memuat FPS');
    pastikan(summary.includes('Waktu Frame'), 'Ringkasan harus memuat Waktu Frame');
    samaDengan(profiler.getAverageFps(), 60, 'Rata-rata FPS harus 60');
  });

  // ---------------------------------------------------------------------------
  // 15. CLI: PERINTAH 'nusantara game'
  // ---------------------------------------------------------------------------
  await uji('CLI Game: nusantara game inspect, benchmark, dan assets validation', () => {
    const cliLogs: string[] = [];
    const cli = new NusantaraCLI({
      log: (msg) => cliLogs.push(msg),
      error: (msg) => cliLogs.push(`ERROR: ${msg}`),
    });

    // 1. inspect
    const codeInspect = cli.jalankan(['game', 'inspect', '--json']);
    samaDengan(codeInspect, 0, 'nusantara game inspect harus exit code 0');
    pastikan(cliLogs.some((l) => l.includes('Nusantara Game Development Kit')), 'Output inspect harus memuat nama engine');

    // 2. assets
    cliLogs.length = 0;
    const codeAssets = cli.jalankan(['game', 'assets', '--json']);
    samaDengan(codeAssets, 0, 'nusantara game assets harus exit code 0');
    pastikan(cliLogs.some((l) => l.includes('pathTraversalShield')), 'Output assets harus memuat pathTraversalShield');

    // 3. benchmark
    cliLogs.length = 0;
    const codeBench = cli.jalankan(['game', 'benchmark', '--json']);
    samaDengan(codeBench, 0, 'nusantara game benchmark harus exit code 0');
    pastikan(cliLogs.some((l) => l.includes('simulationThroughputFps')), 'Output benchmark harus memuat simulationThroughputFps');
  });

  // ---------------------------------------------------------------------------
  // 16. STANDARD LIBRARY: std:game / permainan
  // ---------------------------------------------------------------------------
  await uji('Standard Library: Verifikasi modul std:game, permainan, dan engine', () => {
    pastikan(apakahModulStandar('std:game'), 'std:game harus diakui sebagai modul standar');
    pastikan(apakahModulStandar('permainan'), 'permainan harus diakui sebagai modul standar');
    pastikan(apakahModulStandar('engine'), 'engine harus diakui sebagai modul standar');
    samaDengan(normalisasiNamaModulStandar('std:game'), 'game', 'Normalisasi std:game harus game');
  });

  // ---------------------------------------------------------------------------
  // 17. EKSEKUSI PROGRAM CONTOH GAME NUSANTARA
  // ---------------------------------------------------------------------------
  await uji('Eksekusi Program Contoh: contoh/game/2d/game_pertama.nusantara', () => {
    const kodeSumber = `
program GamePertama
gunakan "std:game" sebagai game
mulai
    app : peta = game.buatAplikasiGame("Uji Game Pertama", 800, 600)
    pos : peta = game.vektor2(100, 200)
    w : peta = game.warna(1, 0, 0, 1)
    k : peta = game.kotak(100, 200, 32, 32)
    app.langkah(1 / 60)
    tampilkan("Game pertama sukses dijalankan pada: ", app["judul"])
selesai
`;

    const parser = new Parser(kodeSumber);
    const ast = parser.parse();
    const galatParser = parser.dapatkanDaftarGalat();
    samaDengan(galatParser.length, 0, 'Parser tidak boleh menghasilkan galat');

    const pembaca = new PembacaBerkasMemori();
    const resolver = new ResolverModul(pembaca, { direktoriAkarProyek: '.' });
    const pemuat = new PemuatModul(resolver, pembaca);

    const pemeriksaTipe = new PemeriksaTipe(pemuat);
    const galatTipe = pemeriksaTipe.periksa(ast, '.');
    samaDengan(galatTipe.length, 0, 'Typechecker tidak boleh menghasilkan galat');

    const penulis = new PenulisOutputBuffer();
    const interpreter = new Interpreter(penulis, {
      pemuatModul: pemuat,
      resolverModul: resolver,
      pembacaBerkas: pembaca,
      direktoriBasis: '.',
    });

    interpreter.interpretasikan(ast);
    const output = penulis.dapatkanSeluruhTeks().join('\n');
    pastikan(output.includes('Game pertama sukses dijalankan'), 'Program harus mencetak konfirmasi sukses');
  });

  // ---------------------------------------------------------------------------
  // REKAPITULASI HASIL AKHIR
  // ---------------------------------------------------------------------------
  console.log('\n======================================================================');
  console.log(
    `HASIL PENGUJIAN PHASE 47: ${ujiLulus} LULUS, ${ujiGagal} GAGAL, ${ujiSkipped} SKIPPED (Total: ${jumlahUji})`
  );
  if (ujiGagal === 0) {
    console.log('Semua pengujian Fase 47 (Game SDK) BERHASIL 100%! (Tanpa mock palsu)');
  } else {
    console.error('Terdapat pengujian Fase 47 yang GAGAL!');
    process.exit(1);
  }
  console.log('======================================================================');
}

jalankanSemuaPengujian().catch((err) => {
  console.error('Kesalahan fatal selama pengujian:', err);
  process.exit(1);
});
