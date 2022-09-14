import { BaseError, DEFAULT_APP_ERROR_PARAMETERS } from '@core/error'

export class WalletApiEventError extends BaseError {
    constructor(error: Error) {
        super({
            message: error.message,
            ...DEFAULT_APP_ERROR_PARAMETERS,
            localizeMessage: false,
        })
    }
}
