import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

// TODO(2.0) Rename to CannotRemoveWalletError
export class CannotRemoveAccountError extends BaseError {
    constructor() {
        super({ message: localize('error.account.cannotRemove'), showNotification: true })
    }
}
