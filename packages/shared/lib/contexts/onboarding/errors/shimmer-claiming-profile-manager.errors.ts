import { BaseError, DEFAULT_APP_ERROR_PARAMETERS } from '@core/error'

export class MissingShimmerClaimingProfileManagerError extends BaseError {
    constructor() {
        super({
            ...DEFAULT_APP_ERROR_PARAMETERS,
            message: 'error.shimmerClaiming.missingProfileManager',
        })
    }
}
