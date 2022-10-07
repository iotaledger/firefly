import { BaseError, DEFAULT_APP_ERROR_PARAMETERS } from '@core/error'

export class MissingShimmerClaimingProfileManagerError extends BaseError {
    constructor() {
        super({
            message: 'error.shimmerClaiming.missingProfileManager',
            ...DEFAULT_APP_ERROR_PARAMETERS,
        })
    }
}
