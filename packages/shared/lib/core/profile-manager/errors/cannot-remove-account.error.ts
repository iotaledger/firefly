import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class CannotRemoveAccountError extends BaseError {
    constructor() {
        super({ message: localize('error.account.cannotRemove'), showNotification: true })
    }
}
