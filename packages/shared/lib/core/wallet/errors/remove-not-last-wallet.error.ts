import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class RemoveNotLastWalletError extends BaseError {
    constructor() {
        super({ message: localize('error.wallet.notLast'), logToConsole: true })
    }
}
