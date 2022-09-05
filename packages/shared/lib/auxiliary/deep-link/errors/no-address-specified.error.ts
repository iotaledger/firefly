import { BaseError } from '@core/error'

export class NoAddressSpecifiedError extends BaseError {
    constructor() {
        const message = 'No address specified in the url path'
        super({
            message,
            showNotification: true,
            saveToErrorLog: true,
            logToConsole: true,
        })
    }
}
