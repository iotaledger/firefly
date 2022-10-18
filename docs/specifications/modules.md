---
icon: stack
---

# Library Modules

The library modules are divided into three categories (detailed below), each indicating the purpose, responsibility, and scope of the modules inside.

## Core

Core modules contain the baseline logic and functionality to build and run the application.

### Modules

- `account` - Manages the accounts of a profile
- `app` - Application configuration, setup, settings, etc.
- `error` - Generic code for building domain-specific errors
- `i18n` - Logic related to internationalization, languages, locales, etc.
- `ledger` - Code related to Ledger Nano profiles and devices
- `network` - Client options and node configuration, protocol settings, etc.
- `nft` - Managing NFTs, e.g. claiming, burning, transferring
- `profile` - General application logic to support profiles
- `profile-manager` - Library-related logic for managing and interacting with profiles
- `router` - Manage application views and flows
- `stronghold` - Code for Stronghold operations, utils, constants, etc. for software profiles
- `token` - Deals with tokens, metadata, conversion rates, registry, etc.
- `utils` - Useful and generic functions, e.g. formatting strings, converting units

### Rules

- **MAY** import code from other core modules
- **MAY NOT** import code from context or auxiliary modules

## Contexts

Context modules contain the logic specific to an area of the application.

### Modules

- `collectibles` - managing or viewing an account's NFTs
- `developer` - using developer tools to make lives easier
- `onboarding` - creating or restoring a profile or initial app setup
- `settings` - changing configuration of the app, profile, network, etc.
- `staking` - staking tokens to receive more tokens
- `governance` - using tokens to cast votes for community proposals
- `wallet` - sending or receiving coins and tokens, i.e. asset management

### Rules

- **MAY** import code from core and auxiliary modules
- **SHOULD NOT** import code from other context modules

## Auxiliary

Auxiliary modules are non-essential pieces of code that help support the application.

### Modules

- `deep-link` - parsing of deep links
- `notification` - managing notifications (both toast and system)
- `popup` - facilitates opening and closing of a popup
- `wordlists` - lists of the 2,048 words allowed in BIP39 (currently only English)

### Rules

- **MAY NOT** import code from context modules
- **SHOULD NOT** import code from other auxiliary modules
