# Firefly Desktop

This is the directory for the desktop application of Firefly - IOTA's new official wallet.

## Setup

The following __must__ be installed on all platforms:

-   [Node.js](https://nodejs.org/en/) 12+ (NOTE: There may be issues with Node.js 15 on Windows)
-   [Yarn](https://classic.yarnpkg.com/en/docs/install)
-   [Rust](https://www.rust-lang.org/tools/install)

### MacOS

-   Xcode Command Line Tools

### Windows

-   [`windows-build-tools`](https://www.npmjs.com/package/windows-build-tools)

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
```
## in the root directory
yarn

## in packages/backend/bindings/node
yarn
```

Build desktop app:
```
## in packages/desktop
yarn build
```

### Development

```
# in packages/desktop
yarn start
```

### Production 

```
# in packages/desktop
yarn compile:<platform>
```

Change `<platform>` as necessary (`win`, `mac`, and `linux`). 
MacOS users __must__ `return true` in the notarization script in `packages/desktop/notarization`.

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
