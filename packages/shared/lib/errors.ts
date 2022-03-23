import { persistent } from '@core/utils/storage'

import { Error } from './typings/error'

export const errorLog = persistent<Error[]>('errorLog', [])

export const addError = (err: Error): void => {
    errorLog.update((log) => [err, ...log])
}
