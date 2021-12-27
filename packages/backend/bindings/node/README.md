# Node.js binding

This is the Node.js binding to the wallet backend. It's written using [neon](https://neon-bindings.com/).

## Installation

### macOS

The development dependencies for macOS are:

- Python 2.7
- Xcode
- Install the Command Line Tools via Xcode under the menu Xcode → Preferences → Downloads.

### Windows

- Install all the required tools and configurations using Microsoft's `windows-build-tools` package (from an elevated terminal):
`$ npm install --global windows-build-tools`
- Set the python path:
`$ npm config set python python2.7`
- Download Visual Studio with the `Desktop development with C++` workload or Visual Studio Build Tools for C++.
- Define the msvs_version variable so node-gyp can find Visual Studio:
`$ npm config set msvs_version 2019` # `2019` is the year of the installed Microsoft Visual Studio

### Unix

- Python 2.7 (Python 3 is not supported)
- make
- A proper C/C++ compiler toolchain, like GCC
