import { BaseError, DEFAULT_APP_ERROR_PARAMETERS } from '@core/error'

export class MissingTransactionIdError extends BaseError {
    constructor() {
        super({
            message: 'error.send.missingTransactionId',
            ...DEFAULT_APP_ERROR_PARAMETERS,
        })
    }
}
