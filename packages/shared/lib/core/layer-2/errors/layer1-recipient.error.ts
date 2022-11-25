import { BaseError } from '@core/error/classes'
import { localize } from '@core/i18n'

export class Layer1RecipientError extends BaseError {
    constructor() {
        const message = localize('error.layer2.layer1Recipient')
        super({
            message,
            showNotification: false,
            saveToErrorLog: false,
            logToConsole: true,
        })
    }
}
