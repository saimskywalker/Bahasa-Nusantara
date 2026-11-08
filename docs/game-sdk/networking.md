# Jaringan & Multiplayer (Networking & Multiplayer)

**NUSANTARA Programming Language — Game Development Kit (v0.47.0)**

---

## 1. Paket & Protokol Jaringan

Game SDK menyediakan `PacketSerializer`, `GameNetworkClient`, dan `GameNetworkServer`:
- Header paket mencakup `id`, `type`, `senderId`, `targetId`, `timestamp`, `seqNumber`, dan `payload`.
- Tipe paket bawaan: `CONNECT`, `CONNECT_ACK`, `DISCONNECT`, `STATE_UPDATE`, `INPUT_EVENT`, `RPC`, `PING`, `PONG`.

---

## 2. Integrasi Model Aktor (Phase 46)

Komponen `ActorComponent` memungkinkan entitas game dihubungkan secara langsung ke `ActorRef` dari subsistem Model Aktor Nusantara Phase 46 untuk pemrosesan status game konkuren tanpa *race condition*.
