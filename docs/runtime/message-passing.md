# Semantik Pengiriman Pesan Nusantara (Fase 46)

## 1. Jaminan Pengurutan (Ordering Guarantee)

Bahasa Pemrograman Nusantara menjamin semantik pengurutan pesan **FIFO (First-In, First-Out)** untuk setiap pasangan pengirim (*sender*) dan penerima (*receiver*):
- Jika aktor $A$ mengirimkan pesan $M_1$ lalu $M_2$ ke aktor $B$, maka $M_1$ dijamin tiba dan diproses di mailbox $B$ sebelum $M_2$.
- Pesan dari pengirim yang berbeda ($A$ dan $C$) dapat berinterleave secara wajar berdasarkan giliran penjadwalan.

## 2. Jaminan Pengiriman (Delivery Semantics)

Secara default pada in-process runtime, Nusantara mengadopsi semantik **at-most-once delivery**:
- Pesan yang dikirimkan ke aktor yang sudah berhenti (`STOPPED`) atau tidak ditemukan akan diteruskan ke antrean `deadLetters` sistem untuk audit diagnostik.
- Pola *Ask* (`ask()`) menyediakan abstraksi request-reply dengan timeout otomatis dan penanganan pembatalan.

## 3. Tipe Pesan Terstruktur

Setiap pesan dibungkus dalam amplop terstruktur:
```typescript
interface ActorMessage<T = any> {
  id: string;
  type: MessageType; // USER | SYSTEM | STOP | RESTART | FAILURE | TIMEOUT
  senderId?: string;
  targetId: string;
  payload: T;
  timestamp: number;
  correlationId?: string;
  replyTo?: ActorRef;
}
```

## 4. Pola Interaksi

1. **Fire-and-Forget (`send`)**:
   Pengirim mendepositokan pesan ke mailbox penerima tanpa memblokir alur eksekusi saat ini.
2. **Request-Reply (`ask`)**:
   Pengirim mengirimkan pesan dengan *correlation ID* dan menunggu balasan hingga batas waktu *timeout* (default: 5.000 ms).
3. **Penerusan (`forward`)**:
   Aktor meneruskan pesan asli ke aktor lain dengan mempertahankan informasi pengirim asli (`senderId`).
