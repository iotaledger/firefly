let errorLogger

export function hookErrorLogger(errLogger: unknown): void {
    errorLogger = errLogger
}

export function logError(err: unknown): void {
    console.error(err)
    if (errorLogger) {
        errorLogger(err)
    }
}
