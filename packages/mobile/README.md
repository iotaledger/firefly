# Firefly - Mobile

Be sure to follow the base environment setup [here](https://iotaledger.github.io/firefly/guides/environment-setup/)!

## Dependencies

In addition to that, it is also necessary to install the following:

- [ImageMagick](https://imagemagick.org/script/download.php)

### iOS

If working on a Mac, it is necessary to install [Xcode](https://apps.apple.com/us/app/xcode/id497799835?mt=12)

If working on the iOS build on a Linux- or Windows-based machine, it is necessary to install a [MacOS virtual machine (VM) with Xcode](https://github.com/kholia/OSX-KVM).

### Android

If working on the Android build, it is necessary for all desktop platforms to have [Android Studio](https://developer.android.com/studio/install)) installed.

## Build

Install yarn dependencies:

```bash
# in the root directory
yarn
```

Build the mobile app:

```bash
# in packages/mobile
yarn build
```

## Development

Start the development server (alternatively, build for device to copy "./ios" and "./android" project folders):

```bash
# in packages/mobile
yarn dev

OR

yarn dev:device
```

In a new terminal (while the development server is running):

```bash
# in packages/mobile
cp capacitor-sample.config.ts capacitor.config.ts
```

Modify the URL field in the newly copied file, replacing `XXX.XXX.XXX.XXX` with your local IP (will likely start with `192.168.1.XXX`, see step below for help):

```typescript
const config: CapacitorConfig = {
    ...
    server: {
        url: 'http://XXX.XXX.XXX.XXX:8080',
        cleartext: true,
    },
    ...
}
```

To view your device's network information:

```bash
# MacOS / Linux
ifconfig

# Windows (via Command Prompt or PowerShell)
ipconfig
```

Run the mobile simulator:

```bash
# iOS
yarn ios:update

# Android
yarn android:update
```

### Debugging

#### iOS

Open Safari, go to the "Develop" menu, and choose the attached iPhone emulator.

#### Android

Open a Chromium-based browser and navigate to `chrome://inspect` to see the attached emulator / phone. Click on "Inspect" to get the developer tools window of the emulator webview.

## Production

Build the mobile app:

```bash
# in packages/mobile
yarn build
```

Package the mobile app:

```bash
# iOS
yarn ios

# Android
yarn android
```

Finally, run the build in either Xcode or Android Studio.
