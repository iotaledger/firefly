---
icon: typography
---

# Naming

Naming is perhaps one of the most important skills for writing clean code. Upon first read, a name __should__ indicate to developers the following things:

- __Why the code exists?__
- __What is the purpose of the code?__
- __How is the code used?__

## General

The following are some general rules about code naming that we follow:

- __They must be meaningful__

    __Bad__

    ```typescript
    function isBetween(a1: number, a2: number, a3: number): boolean {
                       ^-          ^-          ^- 
        return a2 <= a1 && a1 <= a3
    }
    ```

    __Good__

    ```typescript
    function isNumberBetween(value: number, lowerBound: number, upperBound: number): boolean {
               ^-----        ^----          ^---------          ^---------
        return lowerBounds <= value && value <= upperBound
    }
    ```

- __They must be pronounceable__

    __Bad__

    ```typescript
    export type NetworkSts = {
        mps?: number
        health?: number
        healthTxt?: NetworkStsHealthTxt
        curSlot?: number
    }
    ```

    __Good__

    ```typescript
    export type NetworkStatus = {
        messagesPerSecond?: number
        health?: number
        healthText?: NetworkStatusHealthText
        currentSlot?: number
    }
    ```

- __They must NOT be mental mappings__

    __Bad__

    ```typescript
    const ns = getNetworkStatus()
    const nht = getTextForNetworkHealth(ns)
    ```

    __Good__

    ```typescript
    const networkStatus = getNetworkStatus()
    const networkHealthText = getTextForNetworkHealth(networkStatus)
    ```

- __They must NOT add unneeded context__

    __Bad__

    ```typescript
    type Profile {
        profileName: string
        profileType: ProfileType
        profileStorageDirectory: string
    }
    ```

    __Good__

    ```typescript
    type Profile {
        name: string
        type: ProfileType
        storageDirectory: string
    }
    ```

## Files

### TypeScript

All TypeScript filenames are in `kebab-case`, e.g. `deep-link-handler.ts`. Some filenames may include an optional file type specifier, e.g. `deep-link.store.ts`.

### Svelte

Svelte component names / filenames use the following conventions:
- **Must** be written in `PascalCase`
- **Must** be suffixed with the component's type, e.g. `LedgerTransactionPopup` since it is a popup component (this applies to all component types, i.e. routers, views, inputs, buttons, modals, etc.)

## Acronyms

When a variable name contains an acronym, the first letter __must__ be uppercase and the rest lowercase. This convention creates more readable names particularly in the circumstances where another word follows the acronym.

__Bad__

```typescript
type UTXOInput {
   // ... 
}
```

__Good__

```typescript
type UtxoInput {
    // ...
}
```

## Code

### Booleans

- All objects, functions, stores, i.e. code components of `boolean` type must be prefixed with being verbs (e.g. "is", "are", "has", "will", "can", "should", "must")

    __Bad__

    ```typescript
    const enabled = false
    ```

    __Good__

    ```typescript
    const isEnabled = false
    ```

    :information_source: This also pertains to any functions that are of `boolean` type; `isStrongholdLocked()` is more self-documenting than `strongholdLocked()`.

- All booleans must use _positive_ names

    __Bad__

    ```typescript
    const isNotEnabled = false
    ```

    __Good__

    ```typescript
    const isEnabled = false
    ```

### Constants

- All constants __must__ be in `SCREAMING_SNAKE_CASE`

    __Bad__

    ```typescript
    const maxNumIotas = 2_779_530_283_277_761
    ```

    __Good__

    ```typescript
    const MAX_NUM_IOTAS = 2_779_530_283_277_761
    ```

### Enumerations

- All enum _and_ enum variant names __must__ be in `PascalCase`

    __Bad__

    ```typescript
    enum profileType {
        stronghold,
        ledger,
    }
    ```

    __Good__

    ```typescript
    enum ProfileType {
         ^      ^
        Stronghold,
        ^ 
        Ledger,
        ^
    }
    ```

- All enum names __must__ be singular

    __Bad__

    ```typescript
    enum ProfileTypes {
        Stronghold,
        Ledger,
    }
    ```

    __Good__

    ```typescript
    enum ProfileType {
                    ^
        Stronghold,
        Ledger,
    }
    ```

### Functions

- All function names __must__ be in `camelCase`

    __Bad__

    ```typescript
    function Some_Function(): void {
        // ...
    }
    ```

    __Good__

    ```typescript
    function someFunction(): void {
             ^
    }
    ```

- User action handlers **must** start with `on` and **should** end in `Click`. They **mustn’t** end in `Click` when the user action can be triggered by pressing *enter button* as well.
    
    .**Bad**
    
    ```tsx
    function handleCreateProfileClick(): void {
        // ...
    }
    ```
    
    **Good**
    
    ```tsx
    function onCreateProfileClick(): void {
        // ...
    }
    ```
    
- Handlers that aren’t directly triggered by user actions **must** start with `handle`
    
    **Bad**
    
    ```tsx
    function onTransactionInclusionEvent(): void {
        // ...
    }
    ```
    
    **Good**
    
    ```tsx
    function handleTransactionInclusionEvent(): void {
        // ...
    }
    ```

### Interfaces

- All interface names __must__ be in `PascalCase` preceded with an `I`

    __Bad__

    ```typescript
    interface strongholdApi {
        // ...
    }
    ```

    __Bad__

    ```typescript
    interface StrongholdApi {
        // ...
    }
    ```

    __Good__

    ```typescript
    interface IStrongholdApi {
              ^
    }
    ```

### Types

- All type names __must__ be in `PascalCase`

    __Bad__

    ```typescript
    type profile {
        // ...
    }
    ```

    __Good__

    ```typescript
    type Profile {
         ^
    }
    ```
