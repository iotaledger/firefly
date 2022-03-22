---
icon: cpu
---

# Ledger

## Hardware
Most of the time, the Ledger hardware devices work quite smoothly when connecting them to your computer. 

### Setup
For MacOS and Windows systems, the Ledger hardware devices should work smoothly out of the box. If not refer to the [troubleshooting](#troubleshooting) section just below.

If you are using a Linux-based system, please be sure that the `udev` rules are setup properly:
```bash
wget -q -O - https://raw.githubusercontent.com/LedgerHQ/udev-rules/master/add_udev_rules.sh | sudo bash
```

### Troubleshooting
If you are experiencing connection problems with the Ledger device, it is worth trying a few things:
- Run the application as administrator (Windows)
- Enable full disk access (MacOS)
- Try a different USB cable or USB port (the originally packaged cable is best)
- Turn off any Anti-virus software or VPNs

## Simulator
The public repository for the IOTA Ledger app lives [here](https://github.com/iotaledger/ledger-iota-app). This can be used for...
- Running a Ledger Nano S or X hardware simulator
- Compiling and loading the app onto a Ledger Nano S

### Installing
It is first necessary to install Docker (please see [instructions](https://docs.docker.com/get-docker/)). Alternatively, you can use these commands:
```bash
# MacOS
brew install docker

# Linux
sudo apt install docker docker.io
```

### Cloning
Next, clone the IOTA Ledger app repository:
```bash
git clone https://github.com/iotaledger/ledger-iota-app.git
```

### Building
Once cloned, change directories, initialize Git submodules, and run the build script.
```bash
# initialize Git submodules
git submodule init
git submodule update --recursive

# run build script
sudo ./docker/build_docker.sh
```

### Running
After the Docker container is built, the simulator can be run with the following command:
```bash
sudo ./run_simulator.sh [-m (nanos|nanox)]
```

The `-m` argument is used to specify between the Ledger Nano S and Nano X (default is `nanos`).

After running, the simulator listens on port 9999 and can be used without restrictions with the `ledger-iota.rs` library.

### Loading
To compile and load the IOTA app on a real Ledger Nano S device, please use the following command:
```bash
sudo ./load_nanos.sh
```
