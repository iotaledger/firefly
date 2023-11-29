import { BaseError, DEFAULT_APP_ERROR_PARAMETERS } from '@core/error'

export class UnableToGetBoundWalletError extends BaseError {
    constructor() {
        super({
            message: 'error.wallet.cannotGetBoundAccount',
            ...DEFAULT_APP_ERROR_PARAMETERS,
        })
    }
}
