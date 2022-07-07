import { localize } from '@core/i18n'
import { BaseError } from '../base-error.class'

export class InvalidBackupDestinationError extends BaseError {
    constructor() {
        super({
            message: localize('error.backup.destination'),
            logError: true,
            showNotification: true,
        })
    }
}
