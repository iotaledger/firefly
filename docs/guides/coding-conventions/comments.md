---
icon: comment-discussion
---

# Comments

## Regular Comments

> Every time you express yourself in code, you should pat yourself on the back. Every time you write a comment, you should grimace and feel the failure of your ability of expression.

In general it is preferable to avoid writing comments, especially if there is a way to __cleanly express the logic with the code itself__ (aka [_self-documenting code_](https://en.wikipedia.org/wiki/Self-documenting_code)). Otherwise, we adhere to the following rules about comments:

- __Do NOT write comments that are noisy or state the obvious__

    ```typescript
    // get and check store for if Stronghold is locked
    if (get(isStrongholdLocked)) {
        // ...
    }

    function add(a: number, b: number): number {
        // throw error if a or b are not of type "number"
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new Error('Invalid arguments')
        }
    }
    ```

- __Do NOT write `TODO` comments__

    ```typescript
    // TODO: Abstract this code and move to wallet.ts
    ```

  :information_source: If you find yourself writing `TODO` comments, instead [create a new task](https://github.com/iotaledger/firefly/issues/new?assignees=&labels=&template=create-task.yml&title=%5BTask%5D%3A+) on GitHub or add to your existing task's requirements list.

- __Do NOT write inline or embedded comments__

  __Bad__

    ```typescript
    function someFunction(): void { // this function does something
    }
    ```

  __Good__

    ```typescript
    // this function does something
    function someFunction(): void {
    }
    ```

- __They should be preceded by a blank _without_ a following a blank line__

  __Bad__

    ```typescript
    const anArray = ["a string"]
    // a comment about this other array

    const anotherArray = ["another string"]
    ```

  __Good__

    ```typescript
    const anArray = ["a string"]

    // a comment about this other array
    const anotherArray = ["another string"]
    ```

## TSDoc Comments

Because our library is of a considerable size, it is helpful to create and maintain library specifications and documentation so that developers can easily see what is inside a particular module.

As such, it is important that **when writing code that is intended to be used elsewhere** (e.g. in a component, elsewhere in the library), it is annotated with a TSDoc comment.
It is also important to write these comments consistently and in a way that makes it easier to actually read the generated markdown specification pages.

Helpers functions within a module file **should NOT** be annotated.

### Constants

When writing constants, use the following template:
```typescript
/**
 * The [constant name], used for [...].
 */
```

**Example**

```typescript
/**
 * The default locale options, used for when a specific
 * translation is not supported.
 */
export const DEFAULT_LOCALE_OPTIONS: LocaleOptions = {
    ...
}
```

### Enums

When writing enums, use the following template:
```typescript
/**
 * The various [descriptor (e.g. "types", "levels")] of [enum name], used for [...].
 */
```

**Example**

```typescript
/**
 * The various statuses of network health.
 */
export enum NetworkHealth {
  ...
}
```

### Functions

#### `void` / `Promise<void>`

When writing functions that returns `void` or `Promise<void>`, use the following template:

```typescript
/**
 * [Action verb (present tense) followed by descriptive phrase].
 */
```

**Example**

```typescript
/**
 * Updates the network and client options of a new profile.
 */
export function updateNewProfileNetwork(networkProtocol: NetworkProtocol, networkType: NetworkType, node: INode): void {
  ...
}
```

#### `boolean`

When writing functions that return a `boolean`, use the following template:

```typescript
/**
 * Returns true if given [argument] [is/can/should] [condition].
 */
```

**Example**

```typescript
/**
 * Returns true if the given URL is a valid HTTPS URL string.
 */
export const isValidHttpsUrl = (url: string): boolean => {
    ...
}
```

#### Non-`void`/`Promise<void>` and non-`boolean`

When writing functions that return neither `void` nor `Promise<void>` nor `boolean`s, use the following template:

```typescript
/**
 * Returns [a/the] [returned object].
 */
```

**Example**

```typescript
/**
 * Returns the converted amount in fiat from IOTAs.
 */
export function miotaToFiat(amount: number, usdPrice: number, conversionRate: number): number {
    ...
}
```

### Interfaces

When writing interfaces, use the following template:

```typescript
/**
 * Describes [a/the] [interface name], used for [...].
 */
```

**Example**

```typescript
/**
 * Describes the general application settings, used across multiple profiles.
 */
export interface IAppSettings {
    ...
}
```

### Types

When writing types, use the following template:

```typescript
/**
 * Describes [a/the] [type name], used for [...].
 */
```

**Example**

```typescript
/**
 * Describes a deep link URL, used for parsing and building deep links.
 */
export type DeepLinkUrl = string
```

### Stores

When writing stores, use the following template:

```typescript
/**
 * Holds data about [description].
 */
```

**Example**

```typescript
/**
 * Holds data about the current status of the network. 
 */
export const networkStatus = writable<INetworkStatus>(DEFAULT_NETWORK_STATUS)
```
