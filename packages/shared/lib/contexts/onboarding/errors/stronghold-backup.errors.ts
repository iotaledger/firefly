import { BaseError } from '@core/error'
import { localize } from '@core/i18n'
import { formatProtocolName, NetworkProtocol } from '@core/network'

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
            message: localize('notifications.restoreFromStrongholdBackup.notProtocolBased', {
                values: { protocol: formatProtocolName(NetworkProtocol.IOTA) },
            }),
            localizeMessage: false,
            showNotification: true,
        })
    }
}
