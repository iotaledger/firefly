import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class AmountNotAnIntegerError extends BaseError {
    constructor(amount: string) {
        const message = localize('notifications.deepLinkingRequest.invalidAmount', { values: { amount } })
        super({
            message,
            showNotification: true,
            saveToErrorLog: true,
            logToConsole: true,
        })
    }
}
