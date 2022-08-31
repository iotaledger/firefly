import { IError } from '../interfaces'
import { logAndNotifyError } from '../actions'

export function handleGenericError(error: IError): void {
    logAndNotifyError({
        message: 'Error: ' + error?.message,
        logToConsole: true,
        saveToErrorLog: true,
        showNotification: true,
    })
}
