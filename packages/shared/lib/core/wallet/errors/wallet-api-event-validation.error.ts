import { BaseError, DEFAULT_APP_ERROR_PARAMETERS } from '@core/error'

export class WalletApiEventValidationError extends BaseError {
    constructor(reason: string) {
        super({
            message: reason,
            ...DEFAULT_APP_ERROR_PARAMETERS,
            localizeMessage: false,
        })
    }
}
