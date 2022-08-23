import { BaseError, DEFAULT_APP_ERROR_PARAMETERS } from '@core/error'

export class UnableToFindProfileTypeError extends BaseError {
    constructor() {
        super({
            message: 'error.profile.type',
            ...DEFAULT_APP_ERROR_PARAMETERS,
        })
    }
}
