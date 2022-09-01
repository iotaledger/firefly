/**
 * Describes the general error type, containing useful debug information.
 */
export interface IError {
    message?: string
    error?: string
    stack?: unknown
    time?: number
    type?: string
}
