import { IError } from '../interfaces'
import { logAndNotifyError } from '../actions'

export function handleGenericError(error: IError): void {
    logAndNotifyError({
        message: error?.message,
        logToConsole: true,
        saveToErrorLog: true,
        showNotification: true,
    })
}
