import { BaseError, DEFAULT_APP_ERROR_PARAMETERS } from '@core/error'

export class UnableToGetBoundWalletError extends BaseError {
    constructor() {
        super({
            message: 'error.account.cannotGetBoundAccount',
            ...DEFAULT_APP_ERROR_PARAMETERS,
        })
    }
}
