import { BaseError, DEFAULT_APP_ERROR_PARAMETERS } from '@core/error'

export class CannotInitialiseShimmerClaimingAccountError extends BaseError {
    constructor() {
        super({
            ...DEFAULT_APP_ERROR_PARAMETERS,
            message: 'error.shimmerClaiming.cannotInitialiseAccount',
        })
    }
}

export class MissingShimmerClaimingAccountError extends BaseError {
    constructor() {
        super({
            ...DEFAULT_APP_ERROR_PARAMETERS,
            message: 'error.shimmerClaiming.missingAccount',
        })
    }
}
