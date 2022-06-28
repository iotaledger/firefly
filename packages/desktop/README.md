# Firefly - Desktop

This is the directory for the desktop application of Firefly - IOTA's new official wallet.

## Setup

The following **must** be installed on all platforms:

-   [Node.js](https://nodejs.org/en/) 14+ (NOTE: There may be issues with Node.js 15 on Windows)
-   [Yarn](https://classic.yarnpkg.com/en/docs/install)
-   [Rust](https://www.rust-lang.org/tools/install)

### MacOS

-   Xcode Command Line Tools

### Windows

It is highly recommended to use [Chocolatey](https://chocolatey.org/) as a package manager for Windows.
There are a few dependencies that Chocolatey handles smoothly, which otherwise are often troublesome
to install and configure. Read installation steps [here](https://chocolatey.org/install).

PowerShell in **administrator mode** is recommended for the following steps.

-   Install dependencies for [`wallet.rs`](https://github.com/iotaledger/wallet.rs):

```bash
choco install cmake llvm openssl
```

_NOTE: `llvm` can also be downloaded and installed with [snapshot builds](https://llvm.org/builds/)._

-   Install and configure dependencies for Windows:

```bash
choco install python visualstudio2019-workload-vctools -y
npm config set msvs_version 2019
```

_NOTE: Alternatively, you can download [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/).
You must check boxes for "Node.js development" and "Desktop development with C++" within the Visual Studio Installer
(use the 2019 version)_.

-   Add environment variable definitions in `~/.bash_profile` or `~/.bashrc`:

```bash
## wallet.rs sub-dependencies
export OPENSSL_DIR="C:\Program Files\OpenSSL-Win64"

## ensure SODIUM_LIB_DIR points to folder with .lib file (and not .dll)
export SODIUM_LIB_DIR="$HOME\.cargo\registry\src\github.com-1ecc6299db9ec823\libsodium-sys-0.2.7\msvc\x64\Release\v142"
## tell rustc to link library dynamically (use .dll - "dynamic-link library")
export SODIUM_SHARED=1

## path to clang binaries (*.dll/*.lib files)
export LIBCLANG_PATH="C:\Program Files\LLVM\bin"
```

### Linux

-   [Snapcraft](https://snapcraft.io/) (`sudo snap install snapcraft --classic`)
-   [Multipass](https://multipass.run/) (`sudo snap install multipass`) or [LXD](https://linuxcontainers.org/lxd/introduction/) (`snap install lxd`) are necessary for Snap compilation (to bypass this requirement and build on the host, set `SNAP_DESTRUCTIVE_MODE="true"`)
-   `clang` (on some older distros, you may need to [add LLVM APT repos](https://apt.llvm.org/))
-   `libsecret` (Debian/Ubuntu: `libsecret-1-dev`, Red Hat: `libsecret-devel`, Arch Linux: `libsecret`)
-   `libssl` (Debian/Ubuntu: `libssl-dev`, Red Hat: `openssl-devel`, Arch Linux: `openssl`)
-   `libusb` (Debian/Ubuntu: `libusb-1.0-0-dev`)
-   `libudev` (Debian/Ubuntu: `libudev-dev`)
-   `gnome-keyring`, `keepassxc`, or another secrets manager that implements the [freedesktop.org Secrets API](https://www.freedesktop.org/wiki/Specifications/secret-storage-spec/)

## Building

Install yarn dependencies:

```bash
## in the root directory
yarn
```

Build desktop app:

```bash
## in packages/desktop
yarn build
```

### Development

```bash
# in packages/desktop
yarn start
```

### Production

```bash
# in packages/desktop
yarn compile:<platform>
```

Change `<platform>` as necessary (`win`, `mac`, and `linux`).
MacOS users **must** set an environment variable in order to skip notarization (`MACOS_SKIP_NOTARIZATION=true`).

## Running the Firefly Snap

To run the Firefly snap properly on Linux, you may need to run the following commands:

Install the snap when built locally:

```bash
snap install --dangerous path/to/firefly-desktop-0.0.1.snap
```

Connect the `password-manager-service` interface:

```bash
snap connect firefly-wallet:password-manager-service
```
