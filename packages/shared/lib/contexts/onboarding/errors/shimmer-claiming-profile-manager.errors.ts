import { BaseError } from '@core/error'

export class MissingShimmerClaimingProfileManagerError extends BaseError {
    constructor() {
        super({
            message: 'Missing Shimmer claiming profile manager',
            logToConsole: true,
            saveToErrorLog: true,
        })
    }
}
