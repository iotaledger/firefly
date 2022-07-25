---
icon: stack
---

# Modules

## Organization

Modules are the heart of our TypeScript library; they house the various types of code components we use, namely:

- `actions` - higher-level functions that deal with state in some way
- `api` - wrapper functions for `wallet.rs` NodeJS bindings
- `constants` - values that are defined at compile time
- `enums` - variants of a type grouped together
- `helpers` - helper functions to be used inside of a module (opposite of `utils`); they **MUST NOT** be exported in the module's root barrel file
- `interfaces` - object type definitions
- `stores` - Svelte store objects
- `tests` - module unit tests
- `types` - non-object type definitions
- `utils` - utility functions to be used outside of a module (opposite of `helpers`)

The following is a typical module structure:

```
- deep-links/
    - enums/
        - deep-link-context.enum.ts
        - index.ts
        - wallet-context.enum.ts
    - interfaces/
        - deep-link-manager.interface.ts
        - index.ts
    - stores/
        - deep-link-request.store.ts
        - index.ts
    - types/
        - deep-link-request.type.ts
        - index.ts
        - wallet-context.type.ts
    - deep-link-handler.ts
    - index.ts
    - wallet-context-handler.ts
```

## Barrels

A [barrel](https://basarat.gitbook.io/typescript/main-1/barrel) is an intermediary module that rolls up exports from other files and re-exports them. They are the `index.(ts|js)` files that live within modules.

__The functions must be barrel-exported exported within the `index.ts` file__.

```typescript
// directories
export * from './enums'
export * from './interfaces'
export * from './stores'
export * from './types'

// business logic files
export * from './deep-link-handler.ts'
export * from './wallet-context-handler.ts'
```

__Then they can be used within a UI component or another library file__.

```typescript
import {
    getParticipationEvents,
    getParticipationOverview,
    isAccountPartiallyStaked,
    isAccountStaked,
} from '@common/participation'
```

## Constants

Constants are never-changing values that can be used throughout the entire application (i.e. Svelte UI components and other library files). For a variable to be a constant, __it must be evaluated at compile-time rather than runtime__.

__Bad__

```typescript
function getMaxNumIotas(): number {
    return someDynamicCalculation()
}

const MAX_NUM_IOTAS = getMaxNumIotas()
```

__Good__

```typescript
const MAX_NUM_IOTAS = 2_779_530_283_277_761
```

## Enumerations

Enumerations are objects that define one or more variants of a certain type.

__Defining an enumeration__

```typescript
enum ProfileType {
    Stronghold,
    Ledger,
}
```

__Handling different enum cases__

```typescript
const profileType = get(active_profile)?.type
switch(profileType) {
    case ProfileType.Stronghold:
        // do one thing for Stronghold profiles
        break
    case ProfileType.Ledger:
        // do another thing for Ledger profiles
        break
    default:
        // handle default case last
        break
}
```

## Functions

Functions are callable objects that perform some type of operation; they are the building blocks of our application. As such, we have different ways that we use them.

There are some general considerations we should all keep in mind when writing functions:

- __They should be small and contained__. When functions have lots of code that is doing many different things, it is hard to navigate and reason about, ultimately making it hard to debug problems or add new features. It is most likely best that the function be refactored into multiple smaller functions within a larger one.
- __They should contain little-to-no [side-effects](https://en.wikipedia.org/wiki/Side_effect_(computer_science))__. These also make code difficult to debug, extend or test, simply because you cannot be sure that a function did __only__ what it said it was going to do. We should apply a more functional-style of programming, the idea being mainly that functions simply (and _deterministically_) return outputs as a result of some input (i.e. [_pure functions_](https://en.wikipedia.org/wiki/Pure_function)).

### Regular Functions

These are the most common type of function that we write. They are used in Svelte components, library files, and other places in our applcation.

They have the following rules:

- All regular functions __must__ be declared with the `function` keyword
- All regular function signatures __must__ be explicitly typed

__Bad__

```typescript
export const generateRandomInt = (lowerBound, upperBound) => {
    return Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound)
}
```

__Good__

```typescript
export function generateRandomInteger(lowerBound: number, upperBound: number): number {
    return Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound)
}
```

### Anonymous Functions

These are small, unnamed functions that we typically use as callbacks, lambdas, etc.

They have the following rules:

- All anonymous functions __should__ be in the ES6 arrow-style syntax; __do NOT__ use the  `function` keyword*
- Any anonymous function __may__ be explicitly typed (usually if a type is a non-primitive, e.g. __NOT__ `string`, `number`, `boolean`, etc.)

\* The exception to this is when you pass a regular function to a higher-order function.

__Bad__

```typescript
let pollInterval = setInterval(async function {
    await pollNetworkStatusInternal()
}, DEFAULT_NETWORK_STATUS_POLL_INTERVAL)
```

__Good__

```typescript
let pollInterval = setInterval(async () => pollNetworkStatusInternal(), DEFAULT_NETWORK_STATUS_POLL_INTERVAL)
```

### Wrapper Functions

These are the functions that internally access the `api` object, which contains the API methods for `wallet.rs`.

They have the following rules:

- All wrapper functions __must__ be declared with the `function` keyword
- All wrapper functions __must__ be explicitly typed
- All wrapper functions __must__ return a `Promise`-based type
- All wrapper functions __must__ allow for optional callbacks (e.g. `onSuccess`, `onError`)
- All wrapper functions __must__ be free of side-effects

__Bad__

```typescript
function getNodeInfo(
    accountId: string,
    url?: string,
    auth?: NodeAuth
): Promise<NodeInfo> {    
    return new Promise<NodeInfo>((resolve, reject) => {
        api.getNodeInfo(accountId, url, auth, {
            onSuccess(response: Event<NodeInfo>) {
                // BAD
                someStore.set(response?.payload.data)

                resolve(response.payload)
            },
            onError(err: ErrorEventPayload) {
                reject(err)
            }
        })
    })
}
```

__Good__

```typescript
async function getNodeInfo(
    accountId: string,
    url?: string,
    auth?: NodeAuth
): Promise<NodeInfo> {    
    return new Promise<NodeInfo>((resolve, reject) => {
        api.getNodeInfo(accountId, url, auth, {
            onSuccess(response: Event<NodeInfo>) {
                resolve(response.payload)
            },
            onError(err: ErrorEventPayload) {
                reject(err)
            }
        })
    })
}
```

ℹ Responses are validated in the `onMessage` callback via the `Validator` class.

## Interfaces

Interfaces are definitions of a complex object-based type. It may contain fields, functions, or both of these.

For example, we can define a `INode` interface that describes the properties of a node.

```typescript
interface INode {
    url: string
    auth?: NodeAuth
    network?: Network
    isPrimary?: boolean
    isDisabled?: boolean
}
```

:x: Interfaces __should NOT__ be used to define a data type; instead use the `type` keyword.

## Tests

Tests are files containing one or more unit tests for functions in its corresponding source code file. The tests within a module form a test suite. It is worth noting that if the filename is `the-file.ts` then its test __should be__ named `the-file.test.ts`.

:information_source: Please refer to the [testing](../testing.md) guide for more info on setting up and running tests.

### Writing

Most of the test files __should__ have a structure like this:

```typescript
import { theFunctionToTest } from '../the-file.ts'

/**
 * Using a consistent testing structure like this one will increase output 
 * readability and help you to fix things should they start breaking on you. 
 */

describe('File: the-file.ts', () => {
    describe('Function: theFunctionToTest', () => {
        it('should do something', () => {
            const result = theFunctionToTest(...)
            expect(result).toEqual('The correct value')
        })
    })
})
```

### Mocking

Mocks are files that imitate objects or functionality for the sake of testing something. There may be different requirements per whatever it is that is being mocked or will be using the mock, so they may not necessarily all look the same.

To use a mock, simply import it at the beginning of a test file.

```typescript
import './mocks/i18n'
import './mocks/matchMedia'

describe('File: ...', () => {
 // ...
})
```

## Types

Types are definitions of non-object data types, e.g. `boolean`, `number`, and `string`.

```typescript
type NftMetadataValue = boolean | number | string
```

:information_source: It is good practice to explicitly define types for data even if it is simply a `number` or `string`. The largest benefit is that if the type were to change at a later point it would be much easier to implement as we would only need to change the defintion rather than all the places where it's used.
