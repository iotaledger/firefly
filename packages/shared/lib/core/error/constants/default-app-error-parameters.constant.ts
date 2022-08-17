import { IErrorParameters } from '../interfaces'

export const DEFAULT_APP_ERROR_PARAMETERS: Partial<IErrorParameters> = {
    localizeMessage: true,
    showNotification: true,
    saveToErrorLog: true,
    logToConsole: false,
}
