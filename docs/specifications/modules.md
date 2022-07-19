---
icon: stack
---

# Library Modules

The library modules are divided into three categories (detailed below), each indicating the purpose, responsibility, and scope of the modules inside.

## Core

Core modules contain the baseline logic and functionality to build and run the application.

### Modules

- `account`
- `app`
- `error`
- `i18n`
- `network`
- `nft`
- `profile`
- `profile-manager`
- `router`
- `token`
- `utils`
- `wallet`

### Rules

- **MAY NOT** import code from any module outside of the core directory

## Contexts

Context modules contain the logic specific to an area of the application.

### Modules

- `collectibles`
- `onboarding`
- `settings`
- `staking`
- `voting`
- `wallet`

### Rules

_TBD_

## Auxiliary

Auxiliary modules are non-essential pieces of code that help support the application.

### Modules

- `deep-link`
- `notification`
- `popup`
- `wordlists`

### Rules

_TBD_
