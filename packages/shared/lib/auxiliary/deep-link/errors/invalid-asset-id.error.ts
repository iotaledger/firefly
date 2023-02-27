import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class InvalidAssetIdError extends BaseError {
    constructor() {
        const message = localize('error.send.invalidAssetId')
        super({
            message,
            showNotification: true,
            saveToErrorLog: false,
            logToConsole: true,
        })
    }
}
