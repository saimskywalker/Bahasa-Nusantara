# Pemrograman Asinkron & Structured Concurrency (Fase 46)

## 1. Structured Concurrency

Nusantara mengimplementasikan prinsip *structured concurrency* di mana masa hidup komputasi konkuren dibatasi secara hierarkis:
- Operasi cabang (sub-tugas) selalu terikat pada grup induk (`TaskGroup`).
- Jika grup induk dibatalkan atau mengalami kegagalan, seluruh sub-tugas yang belum selesai akan dibatalkan secara berantai (*cancellation cascade*).
- Induk tidak akan selesai sebelum seluruh sub-tugas anak selesai atau dihentikan secara tertib.

## 2. Abstraksi Task<T>

`Task<T>` mewakili hasil komputasi asynchronous masa depan:
- Status: `PENDING` -> `RUNNING` -> `COMPLETED` | `CANCELLED` | `FAILED`.
- Terintegrasi penuh dengan mekanisme `CancellationToken`.

## 3. Pembatalan Terkelola (Cancellation Token)

Operasi panjang memeriksa pembatalan melalui `CancellationToken`:
```typescript
const cts = new CancellationTokenSource();
const token = cts.token;

task.run(async () => {
  if (token.isCancellationRequested) {
    throw new TaskCancelledError();
  }
});

cts.cancel(); // Memicu pembatalan terkoordinasi
```

## 4. Agregasi TaskGroup

- `joinAll()`: Menunggu hingga seluruh tugas dalam grup selesai dieksekusi.
- `joinAny()`: Menyelesaikan segera setelah salah satu tugas tercepat memberikan hasil, membatalkan tugas lainnya secara otomatis.
