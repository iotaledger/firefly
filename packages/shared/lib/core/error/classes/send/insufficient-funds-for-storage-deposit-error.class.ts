import { localize } from '@core/i18n'
import { BaseError } from '../base-error.class'

export class InsufficientFundsForStorageDepositError extends BaseError {
    constructor(storageDeposit: number, unit: string) {
        super({
            message: localize('error.send.insufficientFundsStorageDeposit', { values: { storageDeposit, unit } }),
            logError: true,
            showNotification: true,
        })
    }
}
