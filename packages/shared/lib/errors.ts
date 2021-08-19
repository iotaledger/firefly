import { persistent } from 'shared/lib/helpers'

export const errorLog = persistent<Error[]>('errorLog', [])

export const addError = (err: Error): void => {
    errorLog.update((log) => [err, ...log])
}
