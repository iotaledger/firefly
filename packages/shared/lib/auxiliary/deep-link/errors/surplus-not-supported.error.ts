import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class SurplusNotSupportedError extends BaseError {
    constructor() {
        const message = localize('notifications.deepLinkingRequest.surplusNotSupported')
        super({
            message,
            showNotification: true,
            saveToErrorLog: true,
            logToConsole: true,
        })
    }
}
