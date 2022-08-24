import { BaseError, DEFAULT_APP_ERROR_PARAMETERS } from '@core/error'

export class UnableToFindProfileSetupTypeError extends BaseError {
    constructor() {
        super({
            message: 'error.profile.setupType',
            ...DEFAULT_APP_ERROR_PARAMETERS,
        })
    }
}
