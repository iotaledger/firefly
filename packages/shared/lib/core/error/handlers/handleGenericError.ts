import { IError } from '../interfaces'
import { logAndNotifyError } from '../actions'

export function handleGenericError(error: IError): void {
    logAndNotifyError({
        type: error?.type ?? 'Generic',
        message: error?.message ?? error?.error,
        logToConsole: true,
        saveToErrorLog: true,
        showNotification: true,
    })
}
