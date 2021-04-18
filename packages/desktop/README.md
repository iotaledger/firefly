# IOTA Firefly Desktop Wallet

This is the repository for the IOTA Firefly Desktop Wallet.

## Required Dependencies

For all platforms, the following are required:

-   [Node.js](https://nodejs.org/en/) 12+ (note: there may be issues with Node.js 15 on Windows)
-   [Yarn](https://classic.yarnpkg.com/en/docs/install)
-   [Rust](https://www.rust-lang.org/tools/install)

### macOS

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

## Building Firefly 

```
## in the root folder
yarn

## in packages/backend/bindings/node
yarn

## in packages/desktop
yarn build
```
### Dev Mode

```
# in packages/desktop
yarn start
```
### Production 

```
# in packages/desktop
yarn compile:win
```
Change win to your operating system - mac, win or linux.

Mac users need to `return true` in the notarization script in `packages/desktop/notarization`.

## Running the Firefly Snap

To run the Firefly snap properly on Linux, you may need to run the following commands:

To install the snap when built locally:

```bash
snap install --dangerous path/to/firefly-desktop-0.0.1.snap
```

To connect the `password-manager-service` interface:

```bash
snap connect firefly-wallet:password-manager-service
```
