# API Sensor Perangkat (Sensors API)

API untuk mengakses sensor gerak dan lingkungan smartphone: Accelerometer, Gyroscope, Magnetometer, Proximity, dan Ambient Light Sensor.

## Nama API
- `sensor.akselerometer`: Membaca percepatan 3-axis ($x, y, z$) dalam $m/s^2$.
- `sensor.giroskop`: Membaca rotasi sudut perangkat ($alpha, beta, gamma$) dalam $rad/s$.
- `sensor.magnetometer`: Membaca medan geomagnetik dalam $\mu T$.
- `sensor.kedekatan`: Membaca jarak objek ke layar ponsel ($cm$).
- `sensor.cahaya`: Membaca intensitas cahaya sekitar dalam $lux$.

## Izin Diperlukan
- `sensor` (Tergantung kebijakan platform; sensor gerak umumnya tidak memerlukan persetujuan dialog runtime namun frekuensinya dibatasi untuk menghemat daya baterai).

## Contoh Kode NUSANTARA
```nusantara
gunakan "std:mobile" sebagai seluler

program BacaAkselerometer
mulai
  hasil : peta = seluler.panggilNative("sensor.akselerometer")
  jika hasil["sukses"] == benar maka
    sensor : peta = hasil["data"]
    tampilkan("Akselerasi X: " + sensor["x"])
    tampilkan("Akselerasi Y: " + sensor["y"])
    tampilkan("Akselerasi Z: " + sensor["z"])
  selesai
selesai
```
