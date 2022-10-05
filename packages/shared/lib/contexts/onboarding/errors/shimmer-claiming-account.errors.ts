import { BaseError, DEFAULT_APP_ERROR_PARAMETERS } from '@core/error'

export class CannotInitialiseShimmerClaimingAccountError extends BaseError {
    constructor() {
        super({
            message: 'error.shimmerClaiming.cannotInitialiseAccount',
            ...DEFAULT_APP_ERROR_PARAMETERS,
        })
    }
}

export class MissingShimmerClaimingAccountError extends BaseError {
    constructor() {
        super({
            message: 'error.shimmerClaiming.missingAccount',
            ...DEFAULT_APP_ERROR_PARAMETERS,
        })
    }
}
