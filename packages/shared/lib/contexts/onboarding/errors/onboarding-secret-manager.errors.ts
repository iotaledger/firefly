import { BaseError } from '@core/error'

export class OnboardingSecretManagerAlreadyInitializedError extends BaseError {
    constructor() {
        super({
            message: 'The secret manager was already initialized.',
            logToConsole: true,
        })
    }
}
