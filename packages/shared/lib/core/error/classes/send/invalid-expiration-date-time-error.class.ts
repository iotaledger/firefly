import { localize } from '@core/i18n'
import { BaseError } from '../base-error.class'

export class InvalidExpirationDateTimeError extends BaseError {
    constructor() {
        super({
            message: localize('error.send.invalidExpirationDateTime'),
            logToConsole: false,
        })
    }
}
