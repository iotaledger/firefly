import { BaseError, DEFAULT_APP_ERROR_PARAMETERS } from '@core/error'

export class UnableToFindProfileSetupTypeError extends BaseError {
    constructor() {
        super({
            message: '',
            ...DEFAULT_APP_ERROR_PARAMETERS,
        })
    }
}
