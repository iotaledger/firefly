import { BaseError } from '@core/error'
import { localize } from '@core/i18n'

export class RemoveNotLastAccountError extends BaseError {
    constructor() {
        super({ message: localize('error.account.notLast'), logError: true })
    }
}
