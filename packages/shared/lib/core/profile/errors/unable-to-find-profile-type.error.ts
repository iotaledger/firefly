import { BaseError, DEFAULT_APP_ERROR_PARAMETERS } from '@core/error'

export class UnableToFindProfileTypeError extends BaseError {
    constructor() {
        super({
            message: 'Unable to determine the profile type',
            ...DEFAULT_APP_ERROR_PARAMETERS,

            // TODO: Remove once error notification is in locales
            localizeMessage: false,
        })
    }
}
