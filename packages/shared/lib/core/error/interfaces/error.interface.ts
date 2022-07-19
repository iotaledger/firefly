/**
 * Describes the general error type, containing useful debug information.
 */
export interface IError {
    time: number
    type: string
    message: string
    stack?: unknown
}
