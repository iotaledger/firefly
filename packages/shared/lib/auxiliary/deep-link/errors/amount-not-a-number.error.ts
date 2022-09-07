import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class AmountNotANumberError extends BaseError {
    constructor(amount: string) {
        const message = localize('notifications.deepLinkingRequest.invalidNumber', { values: { amount } })
        super({
            message,
            showNotification: true,
            saveToErrorLog: true,
            logToConsole: true,
        })
    }
}
