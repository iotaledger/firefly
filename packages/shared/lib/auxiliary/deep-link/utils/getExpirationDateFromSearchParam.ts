import { InvalidExpirationDateError, PastExpirationDateError } from '../errors'

export function getExpirationDateFromSearchParam(expirationDate: string): Date | undefined {
    if (!expirationDate) {
        return undefined
    }
    const expirationDateTime = new Date(expirationDate)
    if (isNaN(expirationDateTime.getTime())) {
        throw new InvalidExpirationDateError()
    } else if (expirationDateTime.getTime() < Date.now()) {
        throw new PastExpirationDateError()
    } else {
        return expirationDateTime
    }
}
