# API Bluetooth & BLE (Bluetooth API)

API untuk memeriksa status perangkat keras Bluetooth dan memindai beacon/perangkat Bluetooth Low Energy sekitar secara efisien.

## Nama API
- `bluetooth.status`: Memeriksa apakah adaptor Bluetooth aktif dan mendukung BLE.
- `bluetooth.pindai`: Memindai perangkat sekitar dalam batas durasi tertentu.

## Izin Diperlukan
- `bluetooth`: BLUETOOTH_SCAN, BLUETOOTH_CONNECT pada Android 12+, dan CoreBluetooth privacy permission pada iOS.
- `lokasi`: Diperlukan pada sistem operasi tertentu untuk pemindaian sinyal beacon.

## Parameter `bluetooth.pindai`
- `durasiMs` (bilangan, opsional): Batas durasi pemindaian dalam milidetik (bawaan: 3000). Pemindaian tanpa henti dilarang demi efisiensi baterai.

## Contoh Kode NUSANTARA
```nusantara
gunakan "std:mobile" sebagai seluler

program PindaiBLE
mulai
  opsi : peta = { "durasiMs": 3000 }
  hasil : peta = seluler.panggilNative("bluetooth.pindai", opsi)

  jika hasil["sukses"] == benar maka
    tampilkan("Pemindaian Bluetooth berhasil.")
  selesai
selesai
```
