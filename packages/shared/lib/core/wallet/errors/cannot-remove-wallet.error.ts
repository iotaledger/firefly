import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class CannotRemoveWalletError extends BaseError {
    constructor() {
        super({ message: localize('error.wallet.cannotRemove'), showNotification: true })
    }
}
