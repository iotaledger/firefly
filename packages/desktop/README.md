# IOTA Firefly Desktop Wallet

This is the repository for the IOTA Firefly Desktop Wallet. 

## Required Dependencies
For all platforms, the following are required:

* [Node.js](https://nodejs.org/en/) 12+ (note: there may be issues with Node.js 15 on Windows)
* [Yarn](https://classic.yarnpkg.com/en/docs/install)
* [Rust](https://www.rust-lang.org/tools/install)

### macOS
* Xcode Command Line Tools
* CMake (`brew install cmake`)
* OpenSSL (`brew install openssl`)

### Windows
* [`windows-build-tools`](https://www.npmjs.com/package/windows-build-tools)
* OpenSSL (can be installed with [vcpkg](https://github.com/microsoft/vcpkg) or [Chocolatey](https://chocolatey.org/packages/openssl))

### Linux
* [Snapcraft](https://snapcraft.io/) (`sudo snap install snapcraft --classic`)
* [Multipass](https://multipass.run/) (`sudo snap install multipass`) or [LXD](https://linuxcontainers.org/lxd/introduction/) (`snap install lxd`) are necessary for Snap compilation
* `clang` (on some older distros, you may need to [add LLVM APT repos](https://apt.llvm.org/))
* `cmake`
* `libsecret` (Debian/Ubuntu: `libsecret-1-dev`, Red Hat: `libsecret-devel`, Arch Linux: `libsecret`)
* `libssl` (Debian/Ubuntu: `libssl-dev`, Red Hat: `openssl-devel`, Arch Linux: `openssl`)
* `libusb` (Debian/Ubuntu: `libusb-1.0-0-dev`)
* `libudev` (Debian/Ubuntu: `libudev-dev`)
