--- 
icon: x-24
---

# Errors

Our code takes a `class`-based approach to error handling, allowing us to write domain-specific errors and sometimes even with specific logic built in.

:information_source: These errors can be thrown from any layer within the library as needed.

## Error Parameters

Each error extends the `BaseError` class, which, as a constructor argument, takes an object implementing the `IErrorParameters` interface:

```typescript
interface IErrorParameters {
    /**
     * The message to display for the error. If it is a user-facing error,
     * it should already be localized in the user's selected language.
     */
    message: string

    /**
     * (Opt.) If true, will log the message to the console.
     */
    logError?: boolean

    /**
     * (Opt.) If true, will display the message in a toast notification
     * to the user. 
     */
    showNotification?: boolean
}
```

## Creating an Error

To create module- or domain-specific errors, you must write an additional class that `extends` the `BaseError`, e.g.

```typescript
class InvalidStrongholdPasswordError extends BaseError {
    constructor() {
        super({
            message: localize('error.stronghold.invalidPassword'),
            showNotification: true,
        })
    }
}
```

## Using an Error

To use one of these errors, it is simply a matter of throwing it like a normal `Error`, e.g.

```typescript
if (isStrongholdPasswordValid(password)) {
    throw new InvalidStrongholdPasswordError()
}
```
