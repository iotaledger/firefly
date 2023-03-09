---
icon: info
order: 996
---

# Glossary

## 🖇️ Bitcoin Improvement Proposals (BIPs)

Similar to an IOTA TIP ("Tangle Improvement Proposal"), a BIP is a proposed plan for improving or adding functionality to a specific part of the protocol. They are important because they define and iterate on mechanisms, rules, and standards for a compatible DLT's (distributed ledger technology) implementation.

### BIP32 - Hierarchical deterministic (HD) wallet

This proposal acts as a definition for how a wallet should derive encryption keys from any given seed. The hierarchy is described by a BIP32 path, which looks like:

```
m / purpose' / coin_type' / account' / change / address
```

:warning: Sometimes these values are in hexadecimal format (Ledger users will see this when prompted to confirm newly generated addresses).

- `m` - the binary representation of a seed (e.g. 24-word mnemonic)
- `purpose'`* - a fixed value indicating that (usu. `44'` representing [BIP44](#bip44---Multi-account-hierarchy)) should be used as a standard
- `coin_type'`* - the particular number of a cryptocurrency token (IOTA is `4218'` - see [SLIP44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md#registered-coin-types))
- `account'`* - the index for an account, of which there are 2,147,483,648 possible values (in Firefly these are the individual "wallets" in a single profile)
- `change` - `0'` or `1'` depending on if the address was generated for moving a transaction's remainder funds (`1`) or is an external address for receiving funds (`0`)
- `address` - the index for an address, of which there are 2,147,483,648 possible values (in Firefly these are the individual addresses per each wallet in a single profile)

\* _The added apostrophe indicates a hardened derivation at that level, which means that it is not possible to link a public key with its parent or child public keys via the public keys alone. With this mechanism being used at least the `account` level, the case of an accidental leak of account-specific keys does __NOT__ compromise other accounts or the master (`m`)._

BIP32 is important as without it, you may not necessarily be able to gain access to your funds - you __must__ know which indices the funds reside on to gain access (i.e. you can know which private / public key-pair to generate from the seed). Do not worry though as Firefly sequentially generates new accounts and addresses, which is what allows the balance finder in the settings to more easily find your funds should they be "lost".

### BIP39 - Mnemonic code key derivation

This BIP proposes the usage of a generated 12-24 word mnemonic phrase that can be securely converted into a binary seed intended for generating deterministic wallets using BIP32. The major improvement here is that humans can much more easily handle a series of words rather than 0s and 1s, making the storage and recovery of seeds much more friendly.

It consists of two parts: the generation of the mnemonic itself and the conversion into a binary seed. English words are selected from a specially curated list of 2,048 words with an optional passphrase for added security (an empty string `""` is used if empty). The keys are derived through algorithms [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) and [HMAC](https://en.wikipedia.org/wiki/HMAC)-[SHA512](https://en.wikipedia.org/wiki/SHA-2) with a length of 512 bits or 64 bytes.

### BIP44 - Multi-account hierarchy

This BIP proposes a definition for the logical hierarchy of deterministic wallets. It allows a user to handle multiple tokens from varying cryptocurrencies with each one having possibilities for millions of accounts each with millions of addresses.

To help understand the technical definition, please read the above description about [BIP32 paths](#bip32---hierarchical-deterministic-hd-wallet). However it's also important to understand how this structure is translated into Firefly:

- A __profile__ is at the top-most level of the hierarchy as with Firefly there is _one mnemonic per profile_
- __Wallets__, also known as "Accounts", are three levels lower than the profile / seed (past `purpose` and `coin_type`) therefore can _only be belonging to a single profile_
- __Addresses__ are formed on chains from values `0` and `1` on the `change` level, putting them two levels lower than the `account` level, however in Firefly we typically only see the receive addresses from the chain when `change = 0`

## 🌐 IOTA Networks

The IOTA ecosystem contains a variety of networks each with different purposes and use cases.

### Mainnet

The `mainnet` is the primary network within the IOTA ecosystem where tokens holding __real__ value are transferred to and from participants and data is broadcasted across a public network.

### Devnet

The `devnet`, refers to the secondary network within the IOTA ecosystem where tokens of __fake__ value are transacted with, and data is broadcasted publicly across the network.

### Testnet

Similar to the `devnet`, the `testnet` is a network that until recently was the secondary network for the Chrysalis upgrade. The network still exists and is still being used for testing transactions and data message broadcasting.

### Private Tangles

Private tangles are networks that can be setup for use by an individual or even a smart city. The tokens do __NOT__ hold real-world value, and the data messages are broadcasted onto the configured private network.

## 🔐 Stronghold

Stronghold is an open-source software library developed and maintained by the IOTA Foundation (see [`stronghold.rs`](https://github.com/iotaledger/stronghold.rs)). It deals with the protection of important secrets like the seed of a Firefly profile or the public-private key pairs for accounts (or wallets) within a Firefly profile.

It is designed to be used within other libraries, such as [`wallet.rs`](https://github.com/iotaledger/wallet.rs), or even within the provided  peer-to-peer (p2p) communication layer for when higher security is needed.
