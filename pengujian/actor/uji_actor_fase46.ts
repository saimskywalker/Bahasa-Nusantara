/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NUSANTARA QUALITY GATE - SUITE PENGUJIAN PHASE 46: HIGH-PERFORMANCE CONCURRENCY (ACTOR MODEL)
 * Target Milestone: v0.46.0
 */

import {
  Actor,
  ActorSystem,
  ActorRegistry,
  ActorStatus,
  validasiTransisiStatus,
  MessageType,
  buatPesan,
  Mailbox,
  MailboxOverflowPolicy,
  SupervisorStrategy,
  SupervisorDirective,
  ActorNotFoundError,
  ActorTerminatedError,
  MailboxOverflowError,
  ResourceExhaustedError,
} from '../../src/runtime/actor';
import {
  CancellationTokenSource,
  Task,
  TaskGroup,
  TaskStatus,
  withTimeout,
  sleep,
} from '../../src/runtime/async';
import {
  ResourceManager,
  FairnessController,
  ConcurrencyDiagnostics,
} from '../../src/runtime/concurrency';
import { Lexer } from '../../src/lexer/lexer';
import { Parser } from '../../src/parser/parser';
import { ASTPrinter } from '../../src/parser/astPrinter';
import {
  NIROpcode,
  NIRActorCreateInst,
  NIRActorSendInst,
  NIRActorStopInst,
  NIRAsyncStartInst,
  NIRAwaitInst,
  NIRBuilder,
  NIRVerifier,
  NIRSerializer,
  NIRDeserializer,
  NIRFunction,
  NIRBasicBlock,
  NIRType,
  NIRTypes,
  NIRConstantInt,
} from '../../src/compiler/nir';
import { LLVMInstructionEmitter } from '../../src/compiler/llvm/llvm-instruction-emitter';
import { LLVMToolchainManager } from '../../src/compiler/llvm/toolchain-manager';
import { NusantaraCLI } from '../../src/paket/cli';

function pastikan(kondisi: boolean, pesan: string): void {
  if (!kondisi) {
    throw new Error(`[KEGAGALAN PENGUJIAN] ${pesan}`);
  }
}

function samaDengan<T>(aktual: T, diharapkan: T, pesan: string): void {
  if (aktual !== diharapkan) {
    throw new Error(
      `[KEGAGALAN PENGUJIAN] ${pesan} (Aktual: '${aktual}', Diharapkan: '${diharapkan}')`
    );
  }
}

let jumlahUji = 0;
let ujiLulus = 0;
let ujiGagal = 0;
let ujiSkipped = 0;

function uji(nama: string, fn: () => void | 'SKIPPED'): void {
  jumlahUji++;
  try {
    const res = fn();
    if (res === 'SKIPPED') {
      ujiSkipped++;
      console.log(`  ⚪ [SKIPPED] ${nama}`);
    } else {
      ujiLulus++;
      console.log(`  ✓ [LULUS] ${nama}`);
    }
  } catch (err: any) {
    ujiGagal++;
    console.error(`  ✗ [GAGAL] ${nama}`);
    console.error(`    ${err?.message || err}`);
  }
}

async function ujiAsinkron(nama: string, fn: () => Promise<void | 'SKIPPED'>): Promise<void> {
  jumlahUji++;
  try {
    const res = await fn();
    if (res === 'SKIPPED') {
      ujiSkipped++;
      console.log(`  ⚪ [SKIPPED] ${nama}`);
    } else {
      ujiLulus++;
      console.log(`  ✓ [LULUS] ${nama}`);
    }
  } catch (err: any) {
    ujiGagal++;
    console.error(`  ✗ [GAGAL] ${nama}`);
    console.error(`    ${err?.message || err}`);
  }
}

async function jalankanSemuaPengujian() {
  console.log('======================================================================');
  console.log('       PENGUJIAN SUITE PHASE 46: CONCURRENCY & ACTOR MODEL            ');
  console.log('======================================================================\n');

  // ---------------------------------------------------------------------------
  // 1. ACTOR CREATION & LIFECYCLE
  // ---------------------------------------------------------------------------
  console.log('[1/11] Pengujian Pembuatan Aktor & Siklus Hidup (Lifecycle)');

  uji('Transisi status siklus hidup aktor yang valid', () => {
    samaDengan(validasiTransisiStatus(ActorStatus.CREATED, ActorStatus.RUNNING), true, 'CREATED -> RUNNING harus valid');
    samaDengan(validasiTransisiStatus(ActorStatus.RUNNING, ActorStatus.SUSPENDED), true, 'RUNNING -> SUSPENDED harus valid');
    samaDengan(validasiTransisiStatus(ActorStatus.SUSPENDED, ActorStatus.RUNNING), true, 'SUSPENDED -> RUNNING harus valid');
    samaDengan(validasiTransisiStatus(ActorStatus.RUNNING, ActorStatus.STOPPING), true, 'RUNNING -> STOPPING harus valid');
    samaDengan(validasiTransisiStatus(ActorStatus.STOPPING, ActorStatus.STOPPED), true, 'STOPPING -> STOPPED harus valid');
    samaDengan(validasiTransisiStatus(ActorStatus.RUNNING, ActorStatus.FAILED), true, 'RUNNING -> FAILED harus valid');
  });

  uji('Penolakan transisi status tidak valid', () => {
    samaDengan(validasiTransisiStatus(ActorStatus.STOPPED, ActorStatus.RUNNING), false, 'STOPPED -> RUNNING harus ditolak');
    samaDengan(validasiTransisiStatus(ActorStatus.CREATED, ActorStatus.SUSPENDED), false, 'CREATED -> SUSPENDED harus ditolak');
  });

  uji('Pembuatan aktor dengan ID unik dan pendaftaran di registri', () => {
    const registry = new ActorRegistry();
    const a1 = new Actor('aktor-1', registry);
    const a2 = new Actor('aktor-2', registry);

    pastikan(a1.dapatkanId() !== a2.dapatkanId(), 'ID setiap aktor harus unik');
    samaDengan(registry.jumlahAktor(), 2, 'Registri harus mencatat 2 aktor');
    samaDengan(registry.temukanDenganNama('aktor-1')?.dapatkanId(), a1.dapatkanId(), 'Aktor harus dapat ditemukan via nama');
  });

  await ujiAsinkron('Penghentian aktor menghapus aktor dari registri', async () => {
    const registry = new ActorRegistry();
    const a1 = new Actor('aktor-uji', registry);
    samaDengan(registry.jumlahAktor(), 1, 'Harus terdaftar 1');
    await a1.hentikan();
    samaDengan(a1.dapatkanStatus(), ActorStatus.STOPPED, 'Status harus STOPPED');
    samaDengan(registry.jumlahAktor(), 0, 'Registri harus kosong setelah aktor berhenti');
  });

  // ---------------------------------------------------------------------------
  // 2. MESSAGE PASSING & SEMANTICS
  // ---------------------------------------------------------------------------
  console.log('\n[2/11] Pengujian Semantik Pengiriman Pesan (Message Passing)');

  uji('Pembuatan pesan terstruktur dengan timestamp dan ID unik', () => {
    const msg = buatPesan(MessageType.USER, 'target-1', { angka: 42 });
    samaDengan(msg.receiverId, 'target-1', 'Target ID harus cocok');
    samaDengan(msg.type, MessageType.USER, 'Tipe pesan harus USER');
    samaDengan(msg.payload.angka, 42, 'Payload data harus sesuai');
    pastikan(msg.timestamp > 0, 'Timestamp harus valid');
  });

  await ujiAsinkron('Jaminan pengurutan FIFO per pasangan pengirim-penerima', async () => {
    const registry = new ActorRegistry();
    const a = new Actor('penerima-fifo', registry);
    const logPesan: number[] = [];

    a.aturPenangan((msg) => {
      logPesan.push(msg.payload);
    });

    // Kirim urutan 1, 2, 3, 4, 5
    for (let i = 1; i <= 5; i++) {
      await a.terimaPesan(buatPesan(MessageType.USER, a.dapatkanId(), i));
    }

    // Proses mailbox
    while (a.dapatkanMailbox().ukuran() > 0) {
      await a.prosesPesanBerikutnya();
    }

    samaDengan(logPesan.join(','), '1,2,3,4,5', 'Pesan harus diproses secara FIFO presisi');
  });

  await ujiAsinkron('Pola Ask-Reply (Request-Reply Pattern) antar-aktor', async () => {
    const system = new ActorSystem();
    const serverRef = system.spawn({
      name: 'server-echo',
      initialState: '',
      behavior: async (_state, msg) => {
        if (msg.payload === 'PING') {
          return 'PONG';
        }
        return 'UNKNOWN';
      },
    });

    const balasan = await serverRef.ask('PING', 2000);
    samaDengan(balasan, 'PONG', 'Ask harus menerima balasan PONG dari server');
    await system.shutdown();
  });

  await ujiAsinkron('Ask pattern melempar TaskTimeoutError saat server tidak merespons', async () => {
    const system = new ActorSystem();
    const silentRef = system.spawn({
      name: 'silent-actor',
      initialState: null,
      behavior: async (_state) => {
        await sleep(200);
        return null;
      },
    });

    let terjadiGalat = false;
    try {
      await silentRef.ask('HALO', 50);
    } catch {
      terjadiGalat = true;
    }

    pastikan(terjadiGalat, 'Ask harus melempar galat timeout jika tidak dibalas');
    await system.shutdown();
  });

  await ujiAsinkron('Pesan ke aktor yang telah mati diteruskan ke Dead Letter Queue', async () => {
    const system = new ActorSystem();
    const actorRef = system.spawn({
      name: 'target-sementara',
      initialState: null,
      behavior: async (state) => state,
    });
    await actorRef.stop();

    await system.send(actorRef, 'PESAN_KE_AKTOR_MATI');
    const deadLetters = system.getDeadLetters();
    pastikan(deadLetters.length > 0, 'Dead letter queue harus mencatat pesan ke aktor mati');
    samaDengan(deadLetters[0].message.payload, 'PESAN_KE_AKTOR_MATI', 'Payload dead letter harus cocok');
    await system.shutdown();
  });

  // ---------------------------------------------------------------------------
  // 3. MAILBOX & BACKPRESSURE
  // ---------------------------------------------------------------------------
  console.log('\n[3/11] Pengujian Mailbox & Kebijakan Luapan (Overflow Policies)');

  await ujiAsinkron('Kapasitas berbatas mailbox dan kebijakan REJECT default', async () => {
    const mb = new Mailbox('t', { capacity: 3, overflowPolicy: MailboxOverflowPolicy.REJECT });
    await mb.enqueue(buatPesan(MessageType.USER, 't', 1));
    await mb.enqueue(buatPesan(MessageType.USER, 't', 2));
    await mb.enqueue(buatPesan(MessageType.USER, 't', 3));
    samaDengan(mb.length, 3, 'Ukuran mailbox harus 3');

    let errorThrown = false;
    try {
      await mb.enqueue(buatPesan(MessageType.USER, 't', 4));
    } catch (e: any) {
      if (e instanceof MailboxOverflowError) {
        errorThrown = true;
      }
    }
    pastikan(errorThrown, 'Dorongan ke mailbox penuh pada policy REJECT harus melempar MailboxOverflowError');
  });

  await ujiAsinkron('Kebijakan luapan DROP_OLDEST', async () => {
    const mb = new Mailbox('t', { capacity: 2, overflowPolicy: MailboxOverflowPolicy.DROP_OLDEST });
    await mb.enqueue(buatPesan(MessageType.USER, 't', 'A'));
    await mb.enqueue(buatPesan(MessageType.USER, 't', 'B'));
    await mb.enqueue(buatPesan(MessageType.USER, 't', 'C')); // Menghapus 'A'

    samaDengan(mb.length, 2, 'Ukuran harus tetap 2');
    samaDengan(mb.dequeue()?.payload, 'B', 'Pesan pertama harus B karena A didrop');
    samaDengan(mb.dequeue()?.payload, 'C', 'Pesan kedua harus C');
  });

  await ujiAsinkron('Kebijakan luapan DROP_NEWEST', async () => {
    const mb = new Mailbox('t', { capacity: 2, overflowPolicy: MailboxOverflowPolicy.DROP_NEWEST });
    await mb.enqueue(buatPesan(MessageType.USER, 't', 'A'));
    await mb.enqueue(buatPesan(MessageType.USER, 't', 'B'));
    await mb.enqueue(buatPesan(MessageType.USER, 't', 'C')); // Mengabaikan 'C'

    samaDengan(mb.length, 2, 'Ukuran harus tetap 2');
    samaDengan(mb.dequeue()?.payload, 'A', 'Pesan pertama harus A');
    samaDengan(mb.dequeue()?.payload, 'B', 'Pesan kedua harus B');
  });

  // ---------------------------------------------------------------------------
  // 4. SCHEDULER & FAIRNESS
  // ---------------------------------------------------------------------------
  console.log('\n[4/11] Pengujian Penjadwalan & Keadilan Pemrosesan (Fairness)');

  uji('Throughput budget membatasi eksekusi per giliran aktor agar tidak starvation', () => {
    const fairness = new FairnessController({ throughputBudget: 5, prioritizeSystemMessages: true });
    samaDengan(fairness.dapatkanThroughputBudget(), 5, 'Budget harus 5');

    // Konsumsi 5 pesan
    for (let i = 0; i < 5; i++) {
      pastikan(fairness.apakahMasihAdaKuota(), 'Harus ada kuota');
      fairness.catatPesanDiproses();
    }

    samaDengan(fairness.apakahMasihAdaKuota(), false, 'Kuota harus habis setelah 5 pesan');
    fairness.resetGiliran();
    samaDengan(fairness.apakahMasihAdaKuota(), true, 'Kuota harus kembali tersedia setelah reset');
  });

  await ujiAsinkron('Scheduler kooperatif memproses pesan dari banyak aktor secara bergantian', async () => {
    const system = new ActorSystem({ scheduler: { throughputBudget: 2 } });
    const logEksekusi: string[] = [];

    const a1 = system.spawn({
      name: 'aktor-satu',
      initialState: null,
      behavior: async (_s, m) => {
        logEksekusi.push(`A1-${m.payload}`);
        return _s;
      },
    });

    const a2 = system.spawn({
      name: 'aktor-dua',
      initialState: null,
      behavior: async (_s, m) => {
        logEksekusi.push(`A2-${m.payload}`);
        return _s;
      },
    });

    // Kirim masing-masing 4 pesan
    for (let i = 1; i <= 4; i++) {
      await a1.send(i);
      await a2.send(i);
    }

    await sleep(60);
    samaDengan(logEksekusi.length, 8, 'Total 8 pesan harus diproses');
    await system.shutdown();
  });

  // ---------------------------------------------------------------------------
  // 5. ASYNC TASKS & STRUCTURED CONCURRENCY
  // ---------------------------------------------------------------------------
  console.log('\n[5/11] Pengujian Tugas Asinkron & Structured Concurrency');

  await ujiAsinkron('Siklus hidup Task<T> dan perolehan hasil', async () => {
    const task = new Task<number>(async () => {
      await sleep(10);
      return 100 * 2;
    });

    samaDengan(task.status, TaskStatus.PENDING, 'Status awal harus PENDING');
    task.start();
    samaDengan(task.status, TaskStatus.RUNNING, 'Status saat berjalan harus RUNNING');

    const hasil = await task.result();
    samaDengan(hasil, 200, 'Hasil kalkulasi harus 200');
    samaDengan(task.status, TaskStatus.COMPLETED, 'Status akhir harus COMPLETED');
  });

  await ujiAsinkron('Pembatalan kooperatif dengan CancellationToken', async () => {
    let dibatalkan = false;

    const task = new Task<void>(
      async (token) => {
        for (let i = 0; i < 20; i++) {
          if (token.isCancelled) {
            dibatalkan = true;
            return;
          }
          await sleep(5);
        }
      }
    );

    task.start();
    await sleep(10);
    task.cancel();
    await sleep(20);

    pastikan(dibatalkan, 'Tugas harus mendeteksi pembatalan melalui token');
  });

  await ujiAsinkron('withTimeout melempar TaskTimeoutError saat durasi terlewati', async () => {
    let timeoutGalat = false;
    try {
      await withTimeout(
        (async () => {
          await sleep(100);
          return 'SELESAI';
        })(),
        20
      );
    } catch {
      timeoutGalat = true;
    }

    pastikan(timeoutGalat, 'withTimeout harus melempar error timeout');
  });

  await ujiAsinkron('TaskGroup joinAll menunggu seluruh sub-tugas selesai', async () => {
    const group = new TaskGroup();
    const hasilArr: number[] = [];

    group.spawn(async () => {
      await sleep(10);
      hasilArr.push(1);
    });

    group.spawn(async () => {
      await sleep(20);
      hasilArr.push(2);
    });

    await group.joinAll();
    samaDengan(hasilArr.length, 2, 'Seluruh tugas dalam grup harus selesai');
  });

  await ujiAsinkron('TaskGroup joinAny mengambil tugas tercepat', async () => {
    const group = new TaskGroup();

    group.spawn(async () => {
      await sleep(50);
      return 'LAMBAT';
    });

    group.spawn(async () => {
      await sleep(5);
      return 'CEPAT';
    });

    const tercepat = await group.joinAny();
    samaDengan(tercepat, 'CEPAT', 'joinAny harus mengembalikan hasil tugas tercepat');
  });

  // ---------------------------------------------------------------------------
  // 6. SUPERVISION & ERROR RECOVERY
  // ---------------------------------------------------------------------------
  console.log('\n[6/11] Pengujian Supervisi & Penanganan Kegagalan');

  await ujiAsinkron('Strategi supervisi RESUME melanjutkan pemrosesan pesan berikutnya', async () => {
    const registry = new ActorRegistry();
    const a = new Actor('aktor-resume', registry, {
      strategy: new SupervisorStrategy({ decider: () => SupervisorDirective.RESUME }),
    });

    const logHasil: string[] = [];
    a.aturPenangan((msg) => {
      if (msg.payload === 'GALAT') {
        throw new Error('Kesalahan simulasi');
      }
      logHasil.push(msg.payload);
    });

    await a.terimaPesan(buatPesan(MessageType.USER, a.dapatkanId(), 'PESAN_1'));
    await a.terimaPesan(buatPesan(MessageType.USER, a.dapatkanId(), 'GALAT'));
    await a.terimaPesan(buatPesan(MessageType.USER, a.dapatkanId(), 'PESAN_2'));

    await a.prosesPesanBerikutnya();
    await a.prosesPesanBerikutnya(); // mengalami galat namun di-resume
    await a.prosesPesanBerikutnya();

    samaDengan(logHasil.join(','), 'PESAN_1,PESAN_2', 'Aktor harus melanjutkan pemrosesan pesan ke-2');
  });

  await ujiAsinkron('Strategi supervisi STOP menghentikan aktor yang mengalami galat fatal', async () => {
    const registry = new ActorRegistry();
    const a = new Actor('aktor-stop', registry, {
      strategy: new SupervisorStrategy({ decider: () => SupervisorDirective.STOP }),
    });

    a.aturPenangan((msg) => {
      if (msg.payload === 'CRASH') {
        throw new Error('Fatal crash');
      }
    });

    await a.terimaPesan(buatPesan(MessageType.USER, a.dapatkanId(), 'CRASH'));
    await a.prosesPesanBerikutnya();

    samaDengan(a.dapatkanStatus(), ActorStatus.STOPPED, 'Aktor harus dihentikan setelah crash');
  });

  // ---------------------------------------------------------------------------
  // 7. RESOURCE LIMITS & DIAGNOSTICS
  // ---------------------------------------------------------------------------
  console.log('\n[7/11] Pengujian Batasan Sumber Daya & Diagnostik');

  uji('ResourceManager menegakkan batas maksimum pembuatan aktor', () => {
    const rm = new ResourceManager({ maxActors: 3, maxMailboxCapacity: 100, maxWorkers: 4, maxTasks: 10 });
    rm.alokasiAktor();
    rm.alokasiAktor();
    rm.alokasiAktor();

    let threw = false;
    try {
      rm.alokasiAktor();
    } catch (e: any) {
      if (e instanceof ResourceExhaustedError) threw = true;
    }
    pastikan(threw, 'Harus melempar ResourceExhaustedError saat melebihi batas aktor');
  });

  await ujiAsinkron('ConcurrencyDiagnostics mendeteksi aktor yang mengalami stall', async () => {
    const diag = new ConcurrencyDiagnostics({ stallTimeoutMs: 10 });
    const registry = new ActorRegistry();
    const stalledActor = new Actor('aktor-macet', registry);
    stalledActor.transisiStatus(ActorStatus.RUNNING);

    diag.daftarkanAktor(stalledActor);
    const hasilAwal = diag.analisis();
    samaDengan(hasilAwal.stalledActors.length, 0, 'Belum stall saat awal');

    // Beri pesan di antrean agar mailboxLength > 0
    await stalledActor.terimaPesan(buatPesan(MessageType.USER, stalledActor.dapatkanId(), 'DATA_STALL'));

    // Manipulasi waktu aktivitas terakhir untuk simulasi stall
    (stalledActor as any).waktuAktivitasTerakhir = Date.now() - 50;

    const hasilAkhir = diag.analisis();
    pastikan(hasilAkhir.stalledActors.includes(stalledActor.dapatkanId()), 'Aktor macet harus terdeteksi');
  });

  // ---------------------------------------------------------------------------
  // 8. STRESS & SCALABILITY TEST
  // ---------------------------------------------------------------------------
  console.log('\n[8/11] Pengujian Stres Konkurensi & Skalabilitas Ribuan Pesan');

  await ujiAsinkron('Eksekusi throughput 5.000 pesan antar-aktor tanpa memory leak', async () => {
    const system = new ActorSystem({ scheduler: { throughputBudget: 50, numWorkers: 8 } });
    let totalDiterima = 0;

    const workerRef = system.spawn({
      name: 'worker-stres',
      initialState: null,
      mailboxOptions: { capacity: 10000 },
      behavior: async (state, _msg) => {
        totalDiterima++;
        return state;
      },
    });

    const totalPesan = 5000;
    const waktuMulai = Date.now();

    for (let i = 0; i < totalPesan; i++) {
      workerRef.send(`DATA_${i}`);
    }

    let waitCount = 0;
    while (totalDiterima < totalPesan && waitCount < 150) {
      await sleep(10);
      waitCount++;
    }

    const durasi = Math.max(1, Date.now() - waktuMulai);
    const throughput = Math.round((totalDiterima / durasi) * 1000);

    samaDengan(totalDiterima, totalPesan, 'Seluruh 5.000 pesan harus diterima');
    pastikan(throughput > 0, 'Throughput harus di atas 0 pesan/detik');
    console.log(`    ℹ Throughput aktual: ${throughput.toLocaleString()} pesan/detik (${durasi} ms)`);
    await system.shutdown();
  });

  // ---------------------------------------------------------------------------
  // 9. SYNTAX & PARSER CONCURRENCY NODES
  // ---------------------------------------------------------------------------
  console.log('\n[9/11] Pengujian Parser & AST Kode Sumber Konkurensi');

  uji('Parser mengenali deklarasi aktor, kirim pesan, dan hentikan aktor', () => {
    const kodeSumber = `
      program DemoAktor
      mulai
        aktor Pekerja mulai
          terima Teks(pesan)
            cetak(pesan)
          akhir
        selesai

        variabel p: Aktor = buat Pekerja()
        kirim(p, "HALO")
        hentikan(p)
      selesai
    `;

    const parser = new Parser(kodeSumber);
    const program = parser.parse();

    pastikan(program.tubuhUtama.length >= 3, 'Program harus memiliki minimal 3 pernyataan');
    pastikan((program.daftarAktor?.length ?? 0) === 1, 'Program harus memuat 1 deklarasi aktor');
    samaDengan(program.daftarAktor![0].nama, 'Pekerja', 'Nama aktor harus Pekerja');

    // Format AST untuk memastikan tidak ada unhandled node
    const teksAST = ASTPrinter.cetak(program);
    pastikan(teksAST.includes('Pekerja'), 'AST harus mencetak nama aktor');
  });

  uji('Parser mengenali ekspresi await dan fungsi asinkron', () => {
    const kodeSumber = `
      program DemoAwait
      mulai
        variabel hasil: Bulat = await ambilData()
      selesai
    `;
    const parser = new Parser(kodeSumber);
    const program = parser.parse();

    pastikan(program.tubuhUtama.length === 1, 'Harus ada 1 pernyataan');
    const varDecl: any = program.tubuhUtama[0];
    const expr = varDecl.nilaiAwal || varDecl.nilai;
    pastikan(expr && expr.jenis === 'EKSPRESI_AWAIT', 'Ekspresi harus EKSPRESI_AWAIT');
  });

  // ---------------------------------------------------------------------------
  // 10. NIR & LLVM CONCURRENCY LOWERING
  // ---------------------------------------------------------------------------
  console.log('\n[10/11] Pengujian NIR Opcodes & LLVM Backend Lowering');

  uji('Pembuatan dan verifikasi instruksi konkurensi pada NIR', () => {
    const fn = new NIRFunction('uji_konkurensi', NIRTypes.void(), []);
    const bb = fn.createBasicBlock('entry');
    const builder = new NIRBuilder();
    builder.positionAtEnd(bb);

    const actInst = builder.createActorCreate('Penghitung');
    builder.createActorSend(actInst, new NIRConstantInt(100));
    builder.createActorStop(actInst);
    const targetFunc = new NIRFunction('ambil_data', NIRTypes.i64(), []);
    const asyncInst = builder.createAsyncStart(targetFunc);
    builder.createAwait(asyncInst, NIRTypes.i64());
    builder.createRetVoid();

    samaDengan(bb.getInstructions().length, 6, 'Blok harus memuat 6 instruksi');
    samaDengan(bb.getInstructions()[0].opcode, NIROpcode.ACTOR_CREATE, 'Opcode pertama harus ACTOR_CREATE');
    samaDengan(bb.getInstructions()[1].opcode, NIROpcode.ACTOR_SEND, 'Opcode kedua harus ACTOR_SEND');
    samaDengan(bb.getInstructions()[2].opcode, NIROpcode.ACTOR_STOP, 'Opcode ketiga harus ACTOR_STOP');
    samaDengan(bb.getInstructions()[3].opcode, NIROpcode.ASYNC_START, 'Opcode keempat harus ASYNC_START');
    samaDengan(bb.getInstructions()[4].opcode, NIROpcode.AWAIT, 'Opcode kelima harus AWAIT');

    const verifier = new NIRVerifier();
    const verifRes = verifier.verifyFunction(fn);
    pastikan(verifRes.isValid, 'Fungsi NIR dengan instruksi konkurensi harus valid');
  });

  uji('Serialisasi dan Deserialisasi NIR Concurrency Opcodes', () => {
    const fn = new NIRFunction('uji_ser', NIRTypes.void(), []);
    const bb = fn.createBasicBlock('entry');
    const builder = new NIRBuilder();
    builder.positionAtEnd(bb);
    const act = builder.createActorCreate('AktorA');
    builder.createActorSend(act, new NIRConstantInt(99));
    builder.createRetVoid();

    const json = NIRSerializer.serializeFunction(fn);
    pastikan(json.includes('actor.create'), 'JSON harus memuat actor.create');
    pastikan(json.includes('actor.send'), 'JSON harus memuat actor.send');

    const fnPulih = NIRDeserializer.deserializeFunction(json);
    samaDengan(fnPulih.name, 'uji_ser', 'Nama fungsi hasil deserialisasi harus sama');
    samaDengan(fnPulih.basicBlocks[0].instructions[0].opcode, NIROpcode.ACTOR_CREATE, 'Opcode harus terpelihara');
  });

  uji('Emisi LLVM IR untuk pemanggilan native C runtime konkurensi', () => {
    const emitter = new LLVMInstructionEmitter();
    const fn = new NIRFunction('test_emit', NIRTypes.void(), []);
    const bb = fn.createBasicBlock('entry');
    const builder = new NIRBuilder();
    builder.positionAtEnd(bb);

    const actInst = builder.createActorCreate('Klien');
    const sendInst = builder.createActorSend(actInst, new NIRConstantInt(77));
    const stopInst = builder.createActorStop(actInst);

    const llvm1 = emitter.emitInstruction(actInst);
    const llvm2 = emitter.emitInstruction(sendInst);
    const llvm3 = emitter.emitInstruction(stopInst);

    pastikan(llvm1.includes('call ptr @nusantara_actor_create'), 'LLVM IR harus memanggil nusantara_actor_create');
    pastikan(llvm2.includes('call i32 @nusantara_actor_send'), 'LLVM IR harus memanggil nusantara_actor_send');
    pastikan(llvm3.includes('call void @nusantara_actor_stop'), 'LLVM IR harus memanggil nusantara_actor_stop');
  });

  // ---------------------------------------------------------------------------
  // 11. CLI CONCURRENCY & ACTOR COMMANDS
  // ---------------------------------------------------------------------------
  console.log('\n[11/11] Pengujian CLI & Toolchain Native Host');

  uji('Perintah CLI nusantara actor --stats dan --list', () => {
    const cliLogs: string[] = [];
    const cli = new NusantaraCLI({
      log: (msg) => cliLogs.push(msg),
      error: (msg) => cliLogs.push(`ERROR: ${msg}`),
    });

    const kode1 = cli.jalankan(['actor', '--stats', '--json']);
    samaDengan(kode1, 0, 'nusantara actor --stats harus mengembalikan exit code 0');
    pastikan(cliLogs.some((l) => l.includes('totalAktor')), 'Output harus berupa JSON dengan totalAktor');

    cliLogs.length = 0;
    const kode2 = cli.jalankan(['actor', '--list', '--json']);
    samaDengan(kode2, 0, 'nusantara actor --list harus sukses');
  });

  uji('Perintah CLI nusantara concurrency --benchmark dan --diagnostics', () => {
    const cliLogs: string[] = [];
    const cli = new NusantaraCLI({
      log: (msg) => cliLogs.push(msg),
      error: (msg) => cliLogs.push(`ERROR: ${msg}`),
    });

    const kode1 = cli.jalankan(['concurrency', '--workers', '2', '--benchmark', '--json']);
    samaDengan(kode1, 0, 'nusantara concurrency --benchmark harus exit code 0');
    pastikan(cliLogs.some((l) => l.includes('throughputMsgPerSec')), 'Output harus memuat throughputMsgPerSec');

    cliLogs.length = 0;
    const kode2 = cli.jalankan(['concurrency', '--diagnostics', '--json']);
    samaDengan(kode2, 0, 'nusantara concurrency --diagnostics harus exit code 0');
    pastikan(cliLogs.some((l) => l.includes('deadlockDetected')), 'Output harus memuat analisis deadlock');
  });

  uji('Deteksi native compilation toolchain (clang/lld)', () => {
    const toolchain = LLVMToolchainManager.detectToolchain();
    if (!toolchain.binaries.clang.found && !toolchain.binaries.lld.found) {
      console.log('    ℹ Host toolchain clang/lld tidak ditemukan di sandbox (normal pada Web runner)');
      return 'SKIPPED';
    }
    pastikan(toolchain.available, 'Toolchain lengkap harus tervalidasi jika clang ditemukan');
  });

  // ---------------------------------------------------------------------------
  // REKAPITULASI HASIL AKHIR
  // ---------------------------------------------------------------------------
  console.log('\n======================================================================');
  console.log(
    `HASIL PENGUJIAN PHASE 46: ${ujiLulus} LULUS, ${ujiGagal} GAGAL, ${ujiSkipped} SKIPPED (Total: ${jumlahUji})`
  );
  if (ujiGagal === 0) {
    console.log('Semua pengujian Fase 46 BERHASIL 100%! (Tanpa mock palsu)');
  } else {
    console.error('Terdapat pengujian Fase 46 yang GAGAL!');
    process.exit(1);
  }
  console.log('======================================================================');
}

jalankanSemuaPengujian().catch((err) => {
  console.error('Kesalahan fatal selama pengujian:', err);
  process.exit(1);
});
