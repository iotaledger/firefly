---
icon: pencil
---

# Formatting

## Brackets

We adhere to the [_one true brace style_](https://en.wikipedia.org/wiki/Indentation_style#Variant:_1TBS_(OTBS)) (OTBS) for brackets. OTBS means that the opening brace for a code block follows its corresponding statement or declaration __on the same line__.

__Bad__

```typescript
if (get(isStrongholdLocked))
{
    // ...
}
else
{
    // ...
}
       
function getStrongholdStatus(): StrongholdStatus
{
    // ...
}
```

__Good__

```typescript
if (get(isStrongholdLocked)) {
                             ^
} else {
       ^
}
       
function getStrongholdStatus(): StrongholdStatus {
                               ^ 
}
```

The only circumstances where curly brackets __may__ be omitted are when...

- __An anonymous callback or lambda function is being defined__, e.g.

    __Bad__ (excessive)

    ```typescript
    account.messages.filter((message) => {
        return !message.confirmed
    })
    ```

    __Good__ (concise)

    ```typescript
    accounts.messages.filter((message) => !message.confirmed)
                                          ^--
    ```

- __Handling a (simple) `case` inside of a `switch` statement__, e.g.

    ```typescript
    switch (ledgerDeviceStatus) {
        case Disconnected:
            // do something simple
            break
        case AppOpen: {
                      ^
            // do something complex
            break
        }
        ^
        default:
            // handle default case
            break
    }
    ```

## Commas

Unless the file in question is of JSON format, we __should__ use [trailing commas](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Trailing_commas) wherever possible in the code. In short trailing commas follow the last item in a larger array, despite not having a following item. The reason for this is to make code more editable when we need to move, add, or remove data from said array.

__Bad__

```typescript
const anArray = [
    "string1",
    "string2",
    "string3"
]
```

__Good__

```typescript
const anArray = [
    "string1",
    "string2",
    "string3",
             ^
]
```

:warning: JSON __does NOT__ support trailing commas; __only__ ES5+ code.

## Quotes

We use __single quotes__ throughout the codebase.

__Bad__

```typescript
enum ProfileType {
    Stronghold = "stronghold",
    Ledger = "ledger",
}
```

__Good__

```typescript
enum ProfileType {
    Stronghold = 'stronghold',
    Ledger = 'ledger',
}
```

We use __double quotes__ only in the following places:

- JSON metadata (__NOT__ supported)
- Rust source code (__NOT__ syntactical)
- HTML elements attributes (purely stylistic as single quotes _are_ supported here)

## Semicolons

We are choosing to __NOT__ use semicolons anywhere in the code (unless it is SCSS/CSS code as it is hard-requirement of the syntax).

## Spacing

Spacings are another consideration to make when writing clean code.

They are used in the following places:

- __After a comment__

    __Bad__

    ``` typescript
    //Some useful comment
    ```

    __Good__

    ```typescript
    // Some useful comment...
      ^
    ```

- __Before and after parentheses for `if` statements__

    __Bad__

    ```typescript
    if(get(isStrongholdLocked)){
        // ...
    }
    ```

    __Good__

    ```typescript
    if (get(isStrongholdLocked)) {
      ^                         ^
    }
    ```

- __Before and after parentheses for `for` loops__

    __Bad__

    ```typescript
    for(int i = 0; i < messages.length; i++){
        // ...
    }
    ```

    __Good__

    ```typescript
    for (int i = 0; i < messages.length; i++) {
       ^                                     ^
    }
    ```

- __Before and after parentheses for `switch` statements__

    __Bad__

    ```typescript
    switch(ledgerDeviceStatus){
        // ...
    }
    ```

    __Good__

    ```typescript
    switch (ledgerDeviceStatus) {
          ^                    ^ 
    }
    ```

- __Inside import statements__

    __Bad__

    ```typescript
    import {isStrongholdLocked,getStrongholdStatus} from '@common/stronghold'
    ```

    __Good__

    ```typescript
    import { isStrongholdLocked, getStrongholdStatus } from '@common/stronghold'
            ^                   ^                   ^
    ```

- __Inside object definitions__

    __Bad__

    ```typescript
    const myObject = {num: 1, str: 'one'}
    ```

    __Good__

    ```typescript
    const myObject = { num: 1, str: 'one' }
                      ^                  ^ 
    
    const myObject = { ...anotherObject, field: 'data' }
                      ^                               ^ 
    ```

:warning: __Do NOT__ use tabs for indentation; use spaces instead.
