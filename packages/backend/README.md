# Firefly Backend

Firefly uses [wallet.rs](https://github.com/iotaledger/wallet.rs) in the backend to handle functionality around value-based transfers.
See its [REAMDE](https://github.com/iotaledger/wallet.rs#dependencies) for the required dependencies.

## Building

This directory contains various bindings for the original wallet.rs library (written in Rust) - each can be built and purposed as needed.

To include most recent commits, run `cargo update` in both `firefly/packages/backend` __AND__ `firefly/packages/backend/bindings/node/native`.

### Node.js

Run `yarn` in `firefly/packages/backend/bindings/node` to bundle and build the Javascript bindings for a Node app.

### Capacitor

TODO

### C

TODO

## Other Branches

The default branch of wallet.rs is `dev`, however to test another branch one follow these steps:

- Change the dependency in `firefly/packages/backend/Cargo.toml`
- Run `cargo update` in both `firefly/packages/backend` __AND__ `firefly/packages/backend/bindings/node/native`
- Build desired bindings 
