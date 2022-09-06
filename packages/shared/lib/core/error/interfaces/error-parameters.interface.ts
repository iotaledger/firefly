/**
 * Describes the available parameters to use when
 * creating or throwing an error.
 */
export interface IErrorParameters {
    type: string
    message: string
    localizationKey?: string
    localizeMessage?: boolean
    logToConsole?: boolean
    saveToErrorLog?: boolean
    showNotification?: boolean
    originalError?: Error | unknown
}
