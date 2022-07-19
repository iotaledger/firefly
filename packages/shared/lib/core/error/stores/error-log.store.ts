import { persistent } from '@lib/helpers'

import { IError } from '../interfaces'

/**
 * Holds data about errors that have occurred.
 */
export const errorLog = persistent<IError[]>('errorLog', [])

/**
 * Adds an error to the error log store.
 */
export const addError = (err: IError): void => {
    errorLog.update((log) => [err, ...log])
}
