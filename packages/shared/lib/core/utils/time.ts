/**
 * Returns true if a given expiration date/time is valid or
 * has not yet expired.
 */
export function isValidExpirationDateTime(expirationDateTime: Date): boolean {
    if (expirationDateTime) {
        const nowDateTime = new Date(Date.now())
        return expirationDateTime.getTime() > nowDateTime.getTime()
    } else {
        return false
    }
}
