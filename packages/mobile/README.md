# IOTA Firefly Mobile Wallet

This is the directory for the mobile application of Firefly - IOTA's new official wallet.

## Requirements

The following __must__ be installed on all platforms:

- [Node.js](https://nodejs.org/en/) 16+
- [Yarn](https://classic.yarnpkg.com/en/docs/install)
- [Rust](https://www.rust-lang.org/tools/install)
- [ImageMagick](https://imagemagick.org/script/download.php)

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

Update Capacitor plugins on `android` / `ios` project folders and open Android Studio / XCode IDE:
```bash
packages/mobile $ yarn android:update
packages/mobile $ yarn ios:update
```


### Development

Capacitor Live Reload setup:

To run Firefly in development mode on a physical device, set an environment variable with your computer's local IP (`CAP_IP=<your local ip>`). Otherwise, `localhost` will be used by default for simulators and emulators.
```bash
packages/mobile $ export CAP_IP=192.168.X.X
```
Then, copy the Capacitor config to platform you're targeting:
```bash
packages/mobile $ yarn cap copy ios
packages/mobile $ yarn cap copy android
```

Run a development server, or instead build for device:
```bash
# Run development server with HMR to test on simulators, emulators and phones
packages/mobile $ yarn dev

# Build the app in development mode to get logs and copy files to "./ios" and "./android" project folders
packages/mobile $ yarn dev:device
# It is needed to be executed with every change
```
Next run on Android Studio / XCode IDE.

Debug
- For Android, open a Chromium browser and type `chrome://inspect` to see the attached emulator / phone, finally click on `Inspect` to get DevTools window of the emulator webview.
- For iOS, open Safari and go to menu `Develop`, next choose the attached simulator or Iphone.


### Production 

Optimized production ready build:
```bash
packages/mobile $ yarn build
packages/mobile $ NODE_ENV=production yarn cap copy
packages/mobile $ yarn ios
packages/mobile $ yarn android
```
Finally build / run in Android Studio / XCode IDE.
