# Wallet Runtime C binding

Provides C bindings to the Rust Wallet Runtime.

## Compiling
```bash
$ make
```

## Compiling for Android

Following [this guide](https://mozilla.github.io/firefox-browser-architecture/experiments/2017-09-21-rust-on-android.html):

- Download the Android SDK and the Android NDK
- Setup the ANDROID_HOME and NDK_HOME environment variables, for example:
  ```
    export ANDROID_HOME=$HOME/Android/Sdk
    export NDK_HOME=$ANDROID_HOME/ndk/21.2.6472646
  ```
- Create the standalone NDK:
  ```bash
  $ cd /some/path/to/install
  $ mkdir NDK
  $ ${NDK_HOME}/build/tools/make_standalone_toolchain.py --api 26 --arch x86 --install-dir NDK/x86
  ```
- Configure Cargo to use the NDK ar and linker:
  ```bash
  $ cd /path/to/actor-runtime/bindings/c
  $ mkdir .cargo
  $ echo -e "[target.i686-linux-android]\nar = \"/some/path/to/install/NDK/x86/bin/i686-linux-android-ar\"\nlinker = \"/some/path/to/install/NDK/x86/bin/i686-linux-android-clang\"" > .cargo/config
  ```
- Building
  ```bash
  $ cargo build --target i686-linux-android
  ```
- Using the library on Android
  $ mv target/i686-linux-android/debug/libwallet.so ../capacitor/demo/android/app/src/main/jniLibs/x86/
