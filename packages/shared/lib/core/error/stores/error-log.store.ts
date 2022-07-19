import { persistent } from '@lib/helpers'

import { IError } from '../interfaces'

export const errorLog = persistent<IError[]>('errorLog', [])

export const addError = (err: IError): void => {
    errorLog.update((log) => [err, ...log])
}
