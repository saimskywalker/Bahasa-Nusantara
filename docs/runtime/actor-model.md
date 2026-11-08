# Arsitektur Actor Model Nusantara (Fase 46)

## 1. Pendahuluan

Actor Model pada Bahasa Pemrograman Nusantara mengadopsi paradigma komputasi konkruen berbasis isolasi penuh (*share-nothing architecture*). Dalam model ini:
- Setiap aktor adalah entitas otonom yang mengkapsulasi status (*state*), antrean pesan (*mailbox*), dan perilaku pemrosesan (*behavior*).
- Status internal aktor tidak dapat diakses atau dimutasi langsung oleh aktor lain atau thread eksternal.
- Interaksi antar-aktor hanya diizinkan melalui pengiriman pesan (*message passing*) yang asynchronous.

## 2. Siklus Hidup Aktor (Lifecycle)

Setiap aktor bertransisi melalui status yang tervalidasi secara deterministik:
- `CREATED`: Aktor diinstansiasi dan didaftarkan pada `ActorRegistry`.
- `RUNNING`: Aktor aktif dan siap menerima serta memproses pesan dari mailbox.
- `SUSPENDED`: Pemrosesan pesan dihentikan sementara (misalnya saat proses pengawasan / supervisi).
- `STOPPING`: Aktor menerima sinyal penghentian dan menyelesaikan pesan yang sedang berjalan.
- `STOPPED`: Mailbox dikosongkan dan referensi dihapus dari registri.
- `FAILED`: Aktor mengalami kesalahan fatal yang membutuhkan intervensi strategi supervisi.

## 3. Struktur Referensi Opaque (ActorRef)

Untuk menjaga isolasi state secara ketat, dunia luar hanya berinteraksi melalui handle `ActorRef`.
Antarmuka `ActorRef` mencakup:
```typescript
interface ActorRef {
  readonly id: string;
  readonly name: string;
  send(payload: any, replyTo?: ActorRef): void;
  ask<T>(payload: any, timeoutMs?: number): Promise<T>;
  stop(): void;
}
```
Tidak ada akses langsung ke properti, metode internal, atau memori aktor.

## 4. Pengawasan dan Pemulihan (Supervision Strategy)

Aktor anak diawasi oleh aktor induk atau sistem melalui strategi:
1. `RESUME`: Mengabaikan galat dan melanjutkan pemrosesan pesan berikutnya.
2. `RESTART`: Mengosongkan state sementara, merestart aktor, dan melanjutkan pesan sisa dalam batas toleransi kegagalan (`maxFailures`).
3. `STOP`: Menghentikan aktor secara permanen.
4. `ESCALATE`: Melemparkan kegagalan ke pengawas tingkat lebih tinggi.
