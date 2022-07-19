/**
 * Describes the general error type, containing useful debug information.
 */
export interface IError {
    message: string
    stack?: unknown
    time?: number
    type?: string
}
