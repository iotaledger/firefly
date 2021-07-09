# IOTA Wallet Backend

Firefly uses [wallet.rs](https://github.com/iotaledger/wallet.rs) in the backend.
Look at the [readme](https://github.com/iotaledger/wallet.rs#dependencies) for the required dependencies.

To test another branch of wallet.rs you have to change the dependency in `firefly\packages\backend\Cargo.toml`.

Then to test this change or just to update to the latest commit you then need to write `cargo update` in `firefly\packages\backend` **and** in `firefly\packages\backend\bindings\node\native`.

After that write `yarn` in `firefly\packages\backend\bindings\node`.
