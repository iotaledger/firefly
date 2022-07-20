import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class InvalidBackupDestinationError extends BaseError {
    constructor() {
        super({
            message: localize('error.backup.destination'),
            logToConsole: true,
            saveToErrorLog: true,
            showNotification: true,
        })
    }
}
