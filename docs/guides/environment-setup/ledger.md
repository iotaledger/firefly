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

Additionally, there is a legacy app, which is useful to test migrations. It lives [here](https://github.com/shufps/app-iota-legacy/tree/tmp_backport_docker).

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

#### Legacy App

In case of the Legacy app clone the following repository and check out the correct branch:

``` bash
git clone https://github.com/shufps/app-iota-legacy.git
git checkout tmp_backport_docker
```

information_source: Pick a mnemonic from [this spreadsheet](https://docs.google.com/spreadsheets/d/1Z4DoHByYa1b5IoFH-qJz647bie6jA_ZJ3MAI9KHS-WU/edit#gid=701925826) and replace in app-iota-legacy/run_simulator.sh#64 after --seed (note the account index corresponds to the ledger index).
Write your used seeds and ledger indexes here: https://hackmd.io/5MQxPS1jT6Cymtmpe6Sq_g?view
If we run out of seeds, we have to ping Thomas to restart the network (and the used seeds should be cleaned up in the hackmd)

### Update & Run Firefly

Change the following lines to use the simulator:

1) [Under desktop/electron/lib/Ledger.js](https://github.com/iotaledger/firefly/blob/2b2f9db7a4ce6d713a8aa9ed40b719422f4ac722/packages/desktop/electron/lib/Ledger.js#L97) to ```await this.iota.setActiveSeed(`44'/4218'/${508396330 + index}'/${page}'`, security || 2)```
2) [Under desktop/electron/lib/Ledger.js](https://github.com/iotaledger/firefly/blob/2b2f9db7a4ce6d713a8aa9ed40b719422f4ac722/packages/desktop/electron/lib/Ledger.js#L5) to `const USE_SIMULATOR = true`

For using the simulator with migrations, change the following lines as well.

4) [Under shared/lib/migration.ts](https://github.com/iotaledger/firefly/blob/2b2f9db7a4ce6d713a8aa9ed40b719422f4ac722/packages/shared/lib/migration.ts#L35) to `export const MIGRATION_NODES = ['https://api-legacy.migrator.h.potonet.if4testing.rocks']`
5) [Under shared/lib/migration.ts](https://github.com/iotaledger/firefly/blob/2b2f9db7a4ce6d713a8aa9ed40b719422f4ac722/packages/shared/lib/network.ts#L89) to `return ['https://api.migrator.h.potonet.if4testing.rocks'])`
6) [Under shared/lib/migration.ts](https://github.com/iotaledger/firefly/blob/2b2f9db7a4ce6d713a8aa9ed40b719422f4ac722/packages/shared/lib/ledger.ts#L25) to `export const ledgerSimulator = true`

Rebuild desktop to apply the changes `yarn build && yarn start`

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

:information_source: When needing to change the mnemonic phrase used for the simulator, please adjust the line [here](https://github.com/iotaledger/ledger-iota-app/blob/develop/docker/run_simulator.sh#L64) after the `--seed` argument.

:information_source: Only one simulator can be run at a time.

### Loading

To compile and load the IOTA app on a real Ledger Nano S device, please use the following command:

```bash
sudo ./load_nanos.sh
```
