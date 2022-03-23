import { errorLog } from './stores'
import { Error } from './types'

export function addError(err: Error): void {
    errorLog.update((log) => [err, ...log])
}
