import { BaseError } from '@core/error/classes'

export class OnboardingProfileManagerAlreadyInitializedError extends BaseError {
    constructor() {
        super({
            message: 'The profile manager was already initialized.',
            logToConsole: true,
        })
    }
}
