import { convertUnixTimestampToDate } from '@core/utils'
import { EXPIRATION_DATE_REGEX, TIME_UNIT_MS_MAP } from '../constants'
import { TimeUnit } from '../enums'
import { InvalidExpirationDateError, PastExpirationDateError } from '../errors'

export function getExpirationDateFromSearchParam(expirationDate: string): Date | undefined {
    if (!expirationDate) {
        return undefined
    }

    // Check if it's a Unix timestamp (numeric value)
    if (!isNaN(Number(expirationDate))) {
        const expirationTimestamp = parseInt(expirationDate)
        const expirationDateTime = convertUnixTimestampToDate(expirationTimestamp) // Convert seconds to milliseconds
        if (isNaN(expirationDateTime.getTime())) {
            throw new InvalidExpirationDateError()
        } else if (expirationDateTime.getTime() < Date.now()) {
            throw new PastExpirationDateError()
        } else {
            return expirationDateTime
        }
    }

    // Validate expiration date format for relative time
    const regexMatch = EXPIRATION_DATE_REGEX.exec(expirationDate)

    if (!regexMatch) {
        throw new InvalidExpirationDateError()
    }

    const value = parseInt(regexMatch[1])
    const unit = regexMatch[2] as TimeUnit

    const selectedTimeUnitValue = TIME_UNIT_MS_MAP[unit]

    if (selectedTimeUnitValue === undefined) {
        throw new InvalidExpirationDateError()
    }

    const expirationDateTime = new Date(Date.now() + value * selectedTimeUnitValue)

    return expirationDateTime
}
