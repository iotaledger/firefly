import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class UnknownAssetError extends BaseError {
    constructor() {
        const message = localize('error.send.unknownAsset')
        super({
            message,
            showNotification: true,
            saveToErrorLog: true,
            logToConsole: true,
        })
    }
}
