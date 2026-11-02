# Panduan Pengujian Native API (Testing Guide)

Panduan menjalankan pengujian otomatis unit dan integrasi untuk modul native device API Nusantara Mobile.

## Menjalankan Suite Pengujian
Untuk menjalankan pengujian otomatis khusus Fase 38:
```bash
npx tsx pengujian/mobile/uji_native_api_fase38.ts
```
Atau melalui npm script terdaftar:
```bash
npm run test:native-api-v38
```

## Pengujian Regresi Lengkap
Untuk memastikan integrasi Phase 38 tidak merusak fitur-fitur Phase 1 hingga Phase 37:
```bash
npm test
```

## Cakupan Pengujian
1. **Registri & Metadata API**: Validasi seluruh API terdaftar, parameter, tipe data, dan kemungkinan error.
2. **Device Capabilities**: Deteksi kemampuan hardware dan batas platform.
3. **Permission Enforcement**: Penegakan validasi izin sebelum eksekusi API sensitif.
4. **Platform Adapters**: Verifikasi perilaku Android, iOS, dan Simulator adapter.
5. **Standard Result & Error Types**: Struktur peta hasil konsisten dan kode error tepat.
6. **Eksekusi Nyata Program .nusantara**: Menjalankan skrip `contoh/mobile/device_explorer/device_explorer.nusantara`.
