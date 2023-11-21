import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class InvalidExpirationDateError extends BaseError {
    constructor() {
        const message = localize('error.send.invalidExpirationDate')
        super({
            message,
            showNotification: false,
            saveToErrorLog: false,
            logToConsole: true,
        })
    }
}
