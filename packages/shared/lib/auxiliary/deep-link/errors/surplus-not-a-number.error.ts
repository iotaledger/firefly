import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class SurplusNotANumberError extends BaseError {
    constructor(surplus: string) {
        const message = localize('notifications.deepLinkingRequest.invalidSurplus', { values: { surplus } })
        super({
            message,
            showNotification: true,
            saveToErrorLog: true,
            logToConsole: true,
        })
    }
}
