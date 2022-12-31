import { logAndNotifyError } from '../actions'
import { IError } from '../interfaces'

export function handleGenericError(error: IError | string): void {
    let message: string
    let type: string
    if (typeof error === 'string') {
        message = error
        type = 'Generic'
    } else {
        message = error?.message ?? error?.error
        type = error?.type ?? 'Generic'
    }

    logAndNotifyError({
        type,
        message,
        logToConsole: true,
        saveToErrorLog: true,
        showNotification: true,
    })
}
