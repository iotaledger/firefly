import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class InsufficientFundsForStorageDepositError extends BaseError {
    constructor() {
        super({
            message: localize('error.send.insufficientFundsStorageDeposit'),
            logToConsole: false,
        })
    }
}
