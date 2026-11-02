# Panduan Integrasi Platform iOS (iOS Integration)

Panduan teknis penghubung runtime Nusantara Mobile dengan iOS SDK dan Cocoa Touch Framework.

## Persyaratan Lingkungan
- Sistem Operasi: macOS Sonoma / Sequoia
- Xcode: Xcode 15+ dengan Xcode Command Line Tools
- iOS Deployment Target: iOS 14.0+
- CocoaPods / Swift Package Manager

## Pemetaan Framework iOS
1. **Kamera**: `AVFoundation` (`AVCaptureSession` / `AVCapturePhotoOutput`)
2. **Pemilih Media**: `PhotosUI` (`PHPickerViewController`)
3. **Lokasi**: `CoreLocation` (`CLLocationManager`)
4. **Penyimpanan Aman**: `Security.framework` (`Keychain Services`)
5. **Notifikasi**: `UserNotifications` (`UNUserNotificationCenter`)
6. **Sensor**: `CoreMotion` (`CMMotionManager`)
7. **Bluetooth**: `CoreBluetooth` (`CBCentralManager`)
