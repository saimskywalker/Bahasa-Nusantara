# API Umpan Balik Haptik & Getaran (Haptic Feedback API)

API untuk memicu respons motorik getaran dan haptic feedback pada smartphone.

## Nama API
- `haptik.getar`: Memvalidasi dan memicu getaran fisik perangkat selama durasi milidetik tertentu.
- `haptik.pola`: Memicu pola umpan balik haptik sistem (`"sukses"`, `"peringatan"`, `"gagal"`, `"ringan"`, `"sedang"`, `"berat"`).

## Contoh Kode NUSANTARA
```nusantara
gunakan "std:mobile" sebagai seluler

program GetarPonsel
mulai
  seluler.panggilNative("haptik.pola", { "pola": "sukses" })
  seluler.panggilNative("haptik.getar", { "durasiMs": 150 })
selesai
```
