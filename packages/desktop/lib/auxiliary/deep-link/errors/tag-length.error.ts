import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class TagLengthError extends BaseError {
    constructor() {
        const message = localize('error.send.tagTooLong')
        super({
            message,
            showNotification: true,
            saveToErrorLog: true,
            logToConsole: true,
        })
    }
}
