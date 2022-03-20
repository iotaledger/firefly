# IOTA Firefly Mobile Wallet

This is the directory for the mobile application of Firefly - IOTA's new official wallet.

## Setup

The following __must__ be installed on all platforms:

- [Node.js](https://nodejs.org/en/) 16+
- [Yarn](https://classic.yarnpkg.com/en/docs/install)
- [Rust](https://www.rust-lang.org/tools/install)

### Linux, Windows

- [Android Studio and SDK Tools](https://developer.android.com/studio)
- [MacOS virtual machine with XCode](https://github.com/kholia/OSX-KVM)
### MacOS

- [Xcode](https://developer.apple.com/xcode/)
- [Android Studio and SDK Tools](https://developer.android.com/studio)

## Building

### Setup
Install yarn dependencies:
```bash
$ cd packages/mobile
packages/mobile $ yarn
```

Generate assets:
```bash
# Choose `prod`, `beta` or `alpha` option
packages/mobile $ yarn assets:prod
```

Update Capacitor plugins on `android` / `ios` project folders and open Android Studio or XCode IDE:
```bash
packages/mobile $ yarn android:update
packages/mobile $ yarn ios:update
```

### Development

Capacitor Live Reload setup:
```bash
packages/mobile $ cp capacitor-sample.config.ts capacitor.config.ts 
# modify the url field "XXX.XXX.XXX.XXX" with your local IP

# or hide "Server" block to build directly on device in next step
```

Run development server, or instead build for device:
```bash
# Run development server with HMR to test on simulators, emulators and phones
packages/mobile $ yarn dev

# Build the app in development mode to get logs and copy files to "./ios" and "./android" project folders
packages/mobile $ yarn dev:device
# It is needed to be executed with every change
```

### Production 

Optimized production ready build:
```bash
packages/mobile $ yarn build
packages/mobile $ yarn ios
packages/mobile $ yarn android
```
Finally build / run in Android Studio or XCode IDE.

