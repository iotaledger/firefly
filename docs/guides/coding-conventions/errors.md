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
     * The message to display for the error, whether it's logged to the console,
     * saved to the error log, or shown in a notification.
     */
    message: string

    /**
     * If true, will localize the string on the message field. If the error is
     * user-facing, it MUST be localized.
     */
    localizeMessage?: boolean

    /**
     * If true, will log the message to the developer console.
     */
    logToConsole?: boolean

    /**
     * If true, will save the error object to the error log Svelte store,
     * which is what is displayed to the user when the click on "Error log"
     * from the menu bar.
     */
    saveToErrorLog?: boolean

    /**
     * If true, will display the message in a toast notification
     * to the user. The message MUST be localized.
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

## Errors from wallet.rs

We handle errors from wallet.rs by using the `handleError` function, e.g.

```typescript
try {
    ...
} catch (err) {
    handleError(err)
}
```

This automatically checks, if the error comes from wallet.rs or not. Step-by-step the handlers for the corresponding errors (e.g. `ClientError`, `InsufficientFunds`, ...) are added to this function. If you encounter an unhandled error, create the handler and add the type and the corresponding handlers in the following position in the `handleWalletRsError.ts` :

```typescript
switch (error?.type) {
    ...
    case WalletRsError.InsufficientFunds:
        handleInsufficientFundsError(error)
        break
    ...
}
```
