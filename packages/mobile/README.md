# IOTA Firefly Mobile Wallet

This is the directory for the mobile application of Firefly - IOTA's new official wallet.

## Requirements

The following __must__ be installed on all platforms:

- [Node.js](https://nodejs.org/) 18+
- [Yarn](https://classic.yarnpkg.com/en/docs/install)
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
## in the root directory
$ yarn
$ cd packages/mobile
packages/mobile $ yarn
```

### Development

Capacitor development local IP setup

Use `ifconfig` / `ipconfig` to get `YOUR_LOCAL_LAN_IP`
``` js
Define environmnet variable: CAP_IP=YOUR_LOCAL_LAN_IP on .bashrc / .zchrc
```

Generate assets, open Android Studio / XCode, run development server:

```bash
# Choose stage `prod`, `beta` or `alpha` option
# Choose platform `android` or `ios` option
# yarn start [platform] [stage]
packages/mobile $ yarn start android beta
```

Debug
- For Android, open a Chromium browser and type `chrome://inspect` to see the attached emulator / phone, finally click on `Inspect` to get DevTools window of the emulator webview.
- For iOS, open Safari and go to menu `Develop`, next choose the attached simulator or Iphone.


### Production 

Optimized production ready build:
```bash
# yarn build [platform] [stage]
packages/mobile $ yarn build ios beta
```
Finally build / run in Android Studio / XCode IDE to install the app on emulators / simulators or mobile phones.
