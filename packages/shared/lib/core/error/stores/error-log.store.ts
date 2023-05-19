import { persistent } from '@core/utils/store'

import { IError } from '../interfaces'

/**
 * Holds data about errors that have occurred.
 */
export const errorLog = persistent<IError[]>('errorLog', [])

/**
 * Adds an error to the error log store.
 */
export function addError(err: IError | Error): void {
    errorLog.update((log) => [err, ...log])
}
