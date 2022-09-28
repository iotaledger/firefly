import { BaseError, DEFAULT_APP_ERROR_PARAMETERS } from '@core/error'

export class ClaimShimmerRewardsError extends BaseError {
    constructor(originalError?: Error | unknown) {
        super({
            message: 'notifications.claimShimmerRewards.error',
            originalError,
            ...DEFAULT_APP_ERROR_PARAMETERS,
        })
    }
}

export class FindShimmerRewardsError extends BaseError {
    constructor(originalError?: Error | unknown) {
        super({
            message: 'notifications.findShimmerRewards.error',
            originalError,
            ...DEFAULT_APP_ERROR_PARAMETERS,
        })
    }
}
