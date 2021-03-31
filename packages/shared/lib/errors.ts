import { persistent } from 'shared/lib/helpers'

/**
 * Error interface
 */
export interface Error {
    time: number
    type: string,
    message: string
}

export const errorLog = persistent<Error[]>('errorLog', [])

export const addError = (err: Error) => {
    errorLog.update((log) => [err, ...log])
}
