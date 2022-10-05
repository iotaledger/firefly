import { BaseError, DEFAULT_APP_ERROR_PARAMETERS } from '@core/error'

export class MissingTransactionProgressEventPayloadError extends BaseError {
    constructor() {
        super({
            message: 'error.send.missingTransactionProgressEventPayload',
            ...DEFAULT_APP_ERROR_PARAMETERS,
        })
    }
}
