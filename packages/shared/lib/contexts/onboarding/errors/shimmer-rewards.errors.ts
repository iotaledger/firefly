import { BaseError, DEFAULT_APP_ERROR_PARAMETERS } from '@core/error'

export class ClaimShimmerRewardsError extends BaseError {
    constructor() {
        super({
            message: 'notifications.claimShimmerRewards.error',
            ...DEFAULT_APP_ERROR_PARAMETERS,
        })
    }
}

export class FindShimmerRewardsError extends BaseError {
    constructor() {
        super({
            message: 'notifications.findShimmerRewards.error',
            ...DEFAULT_APP_ERROR_PARAMETERS,
        })
    }
}
