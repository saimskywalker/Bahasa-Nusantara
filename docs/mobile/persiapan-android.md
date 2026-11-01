# Persiapan Lingkungan Android

Panduan penyiapan Android SDK, JDK, dan perangkat uji untuk kompilasi binary native Android dengan Nusantara Mobile.

---

## 1. Instalasi Java Development Kit (JDK)

Nusantara Mobile menargetkan bytecode Java 17. Pastikan JDK 17 atau OpenJDK 17 telah terpasang:

```bash
# Ubuntu/Debian
sudo apt install openjdk-17-jdk

# macOS (Homebrew)
brew install openjdk@17

# Verifikasi
java -version
```

Atur variabel lingkungan `JAVA_HOME`:
```bash
export JAVA_HOME=/path/to/jdk-17
export PATH=$JAVA_HOME/bin:$PATH
```

---

## 2. Instalasi Android Studio & SDK Command-line Tools

1. Unduh dan pasang **Android Studio** (atau Android Command Line Tools).
2. Pasang paket SDK:
   - Android SDK Platform 34 (Android 14)
   - Android SDK Build-Tools 34.0.0
   - Android SDK Platform-Tools (`adb`)
3. Tambahkan ke konfigurasi shell (`~/.bashrc` atau `~/.zshrc`):
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

---

## 3. Menghubungkan Perangkat Fisik (USB Debugging)

1. Aktifkan **Opsi Pengembang** (*Developer Options*) pada perangkat Android Anda (ketuk *Nomor Bentukan* 7 kali).
2. Aktifkan **Debugging USB**.
3. Hubungkan perangkat ke komputer dan verifikasi deteksi:
```bash
adb devices
```
