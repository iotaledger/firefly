import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class NoAddressSpecifiedError extends BaseError {
    constructor() {
        const message = localize('notifications.deepLinkingRequest.invalidFormat')
        super({
            message,
            showNotification: true,
            saveToErrorLog: true,
            logToConsole: true,
        })
    }
}
