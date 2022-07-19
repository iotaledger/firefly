import { localize } from '@core/i18n'
import { BaseError } from '../base-error.class'

export class InsufficientFundsForStorageDepositError extends BaseError {
    constructor() {
        super({
            message: localize('error.send.insufficientFundsStorageDeposit'),
            logToConsole: false,
        })
    }
}
