import { BaseError, DEFAULT_APP_ERROR_PARAMETERS } from '@core/error'

export class InvalidTransactionIdError extends BaseError {
    constructor() {
        super({
            message: 'error.send.invalidTransactionId',
            ...DEFAULT_APP_ERROR_PARAMETERS,
        })
    }
}
