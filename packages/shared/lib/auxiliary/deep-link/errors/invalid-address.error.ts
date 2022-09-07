import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class InvalidAddressError extends BaseError {
    constructor() {
        const message = localize('error.send.invalidAddress')
        super({
            message,
            showNotification: true,
            saveToErrorLog: true,
            logToConsole: true,
        })
    }
}
