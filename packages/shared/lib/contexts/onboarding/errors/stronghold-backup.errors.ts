import { BaseError, DEFAULT_APP_ERROR_PARAMETERS } from '@core/error'
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
    constructor(isClaiming: boolean = false) {
        super({
            message: isClaiming
                ? localize('notifications.restoreFromStrongholdBackup.wrongProtocolForClaiming')
                : localize('notifications.restoreFromStrongholdBackup.wrongProtocol'),
            ...DEFAULT_APP_ERROR_PARAMETERS,
            localizeMessage: false,
        })
    }
}
