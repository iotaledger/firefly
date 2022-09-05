import { BaseError } from '@core/error'

export class InvalidAddressError extends BaseError {
    constructor(address: string) {
        const message = `Address or prefix is not valid for ${address}`
        super({
            message,
            showNotification: true,
            saveToErrorLog: true,
            logToConsole: true,
        })
    }
}
