import { IError } from '../interfaces'
import { handleError } from './handleError'

export function handleGenericError(error: IError): void {
    handleError({
        message: 'Error: ' + error?.message,
        logToConsole: true,
        saveToErrorLog: true,
        showNotification: true,
    })
}
