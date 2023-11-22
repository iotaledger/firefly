import { InvalidExpirationDateError, PastExpirationDateError } from '../errors'

enum TimeUnit {
    Weeks = 'w',
    Days = 'd',
    Hours = 'h',
    Minutes = 'm',
}

const timeUnitValues: Record<TimeUnit, number> = {
    [TimeUnit.Weeks]: 604800000,
    [TimeUnit.Days]: 86400000,
    [TimeUnit.Hours]: 3600000,
    [TimeUnit.Minutes]: 60000,
}

export function getExpirationDateFromSearchParam(expirationDate: string): Date | undefined {
    if (!expirationDate) {
        return undefined
    }

    // Check if it's a Unix timestamp (numeric value)
    if (!isNaN(Number(expirationDate))) {
        const expirationTimestamp = parseInt(expirationDate)
        const expirationDateTime = new Date(expirationTimestamp * 1000) // Convert seconds to milliseconds
        if (isNaN(expirationDateTime.getTime())) {
            throw new InvalidExpirationDateError()
        } else if (expirationDateTime.getTime() < Date.now()) {
            throw new PastExpirationDateError()
        } else {
            return expirationDateTime
        }
    }

    // Validate expiration date format for relative time
    const expirationRegex = /^(\d+)([hdwm])$/
    const regexMatch = expirationRegex.exec(expirationDate)

    if (!regexMatch) {
        throw new InvalidExpirationDateError()
    }

    const value = parseInt(regexMatch[1])
    const unit = regexMatch[2] as TimeUnit

    const selectedTimeUnitValue = timeUnitValues[unit]

    if (selectedTimeUnitValue === undefined) {
        throw new InvalidExpirationDateError()
    }

    const expirationDateTime = new Date(Date.now() + value * selectedTimeUnitValue)

    return expirationDateTime
}
