import { BaseError } from '@core/error/classes'
import { DEFAULT_APP_ERROR_PARAMETERS } from '@core/error/constants'

export class MissingTransactionIdError extends BaseError {
    constructor() {
        super({
            message: 'error.send.missingTransactionId',
            ...DEFAULT_APP_ERROR_PARAMETERS,
        })
    }
}
