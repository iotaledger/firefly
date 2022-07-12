import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class RemoveAccountWithBalanceError extends BaseError {
    constructor() {
        super({ message: localize('error.account.withBalance'), logError: true })
    }
}
