import { BaseError } from '@core/error'

export class CannotInitialiseShimmerClaimingAccountError extends BaseError {
    constructor() {
        super({
            message: 'Cannot initialise Shimmer Claiming account.',
            logToConsole: true,
            saveToErrorLog: true,
        })
    }
}
