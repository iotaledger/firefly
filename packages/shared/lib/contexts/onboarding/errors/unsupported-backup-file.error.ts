import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class UnsupportedBackupFileError extends BaseError {
    constructor() {
        super({
            message: localize('error.backup.invalid'),
            showNotification: true,
        })
    }
}
