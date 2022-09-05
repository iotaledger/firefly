import { BaseError } from '@core/error'

export class AmountNotANumberError extends BaseError {
    constructor(amountParam: string) {
        const message = `Amount in deep link is not a number '${amountParam}'`
        super({
            message,
            showNotification: true,
            saveToErrorLog: true,
            logToConsole: true,
        })
    }
}
