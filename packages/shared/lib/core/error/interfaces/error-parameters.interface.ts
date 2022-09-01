/**
 * Describes the available parameters to use when
 * creating or throwing an error.
 */
export interface IErrorParameters {
    message: string
    localizationKey?: string
    localizeMessage?: boolean
    logToConsole?: boolean
    saveToErrorLog?: boolean
    showNotification?: boolean
    originalError?: Error | unknown
}
