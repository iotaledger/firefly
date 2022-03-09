import { persistent } from 'shared/lib/helpers'
import { Error } from './typings/error'

export const errorLog = persistent<Error[]>('errorLog', [])

export const addError = (err: Error): void => {
    errorLog.update((log) => [err, ...log])
}
