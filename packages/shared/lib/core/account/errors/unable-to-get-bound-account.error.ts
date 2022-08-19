import { BaseError, DEFAULT_APP_ERROR_PARAMETERS } from '@core/error'

export class UnableToGetBoundAccountError extends BaseError {
    constructor() {
        super({
            message: 'Unable to get bound account',
            ...DEFAULT_APP_ERROR_PARAMETERS,
            localizeMessage: false,
        })
    }
}
