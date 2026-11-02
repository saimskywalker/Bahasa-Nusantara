# Panduan Integrasi Platform Android (Android Integration)

Panduan teknis penghubung runtime Nusantara Mobile dengan Android SDK.

## Persyaratan Lingkungan
- Android SDK Build-Tools >= 34.0.0
- Minimum SDK (minSdkVersion): API 24 (Android 7.0 Nougat)
- Target SDK (targetSdkVersion): API 34 (Android 14)
- Java Development Kit: JDK 17 atau OpenJDK 17 LTS

## Pemetaan API Native Android
1. **Kamera**: `androidx.activity.result.contract.ActivityResultContracts.TakePicture` dengan `FileProvider`.
2. **Pemilih Media**: `ActivityResultContracts.PickVisualMedia` (Android Photo Picker bawaan).
3. **Lokasi**: Google Play Services `FusedLocationProviderClient`.
4. **Penyimpanan Aman**: Android Jetpack Security `EncryptedSharedPreferences` dengan `MasterKey` hardware-backed.
5. **Notifikasi**: `NotificationManagerCompat` dan channel notifikasi default.
