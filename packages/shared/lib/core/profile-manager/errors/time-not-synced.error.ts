import { BaseError } from '@core/error'

export class TimeNotSyncedError extends BaseError {
    constructor() {
        super({
            message: 'error.account.timeDoesNotMatch',
            localizeMessage: true,
            logToConsole: false,
            saveToErrorLog: true,
            showNotification: true,
        })
    }
}
