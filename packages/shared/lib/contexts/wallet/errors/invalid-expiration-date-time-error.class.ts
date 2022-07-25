import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class InvalidExpirationDateTimeError extends BaseError {
    constructor() {
        super({
            message: localize('error.send.invalidExpirationDateTime'),
            logToConsole: false,
        })
    }
}
