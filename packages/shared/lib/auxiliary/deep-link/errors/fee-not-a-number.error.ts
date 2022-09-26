import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class FeeNotANumberError extends BaseError {
    constructor(fee: string) {
        const message = localize('notifications.deepLinkingRequest.invalidFee', { values: { fee } })
        super({
            message,
            showNotification: true,
            saveToErrorLog: true,
            logToConsole: true,
        })
    }
}
