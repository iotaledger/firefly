import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class PastExpirationDateError extends BaseError {
    constructor() {
        const message = localize('error.send.pastExpirationDate')
        super({
            message,
            showNotification: false,
            saveToErrorLog: false,
            logToConsole: true,
        })
    }
}
