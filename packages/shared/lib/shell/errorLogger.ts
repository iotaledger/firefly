let errorLogger

export function hookErrorLogger(errLogger) {
    errorLogger = errLogger
}

export function logError(err) {
    console.error(err)
    if (errorLogger) {
        errorLogger(err)
    }
}
