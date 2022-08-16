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

export class CannotRestoreWithMismatchedCoinTypeError extends BaseError {
    constructor() {
        super({
            message: localize('notifications.restoreFromStrongholdBackup.wrongProtocolForClaiming'),
            localizeMessage: false,
            showNotification: true,
        })
    }
}
