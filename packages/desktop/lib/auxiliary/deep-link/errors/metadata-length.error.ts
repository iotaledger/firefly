import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class MetadataLengthError extends BaseError {
    constructor() {
        const message = localize('error.send.metadataTooLong')
        super({
            message,
            showNotification: true,
            saveToErrorLog: true,
            logToConsole: true,
        })
    }
}
