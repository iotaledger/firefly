import { localize } from '@core/i18n'

import { HOURS_PER_DAY, MILLISECONDS_PER_SECOND, MINUTES_PER_HOUR, SECONDS_PER_MINUTE } from './constants'
import { Duration } from './types'

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

/**
 * Formats a duration in milliseconds into the best matching unit, i.e.
 * it will only return a number of days, hours, minutes, or seconds but NOT
 * together.
 *
 * @method getBestTimeDuration
 *
 * @param {number} millis
 * @param {Duration} noDurationUnit
 *
 * @returns {string}
 */
export const getBestTimeDuration = (millis: number, noDurationUnit: Duration = 'day'): string => {
    const zeroTime = localize(`times.${noDurationUnit || 'day'}`, { values: { time: 0 } })

    if (Number.isNaN(millis)) return zeroTime

    const inDays = millis / (HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND)
    if (inDays >= 1) return localize('times.day', { values: { time: inDays > 1 ? Math.ceil(inDays) : inDays } })

    const inHours = millis / (MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND)
    if (inHours >= 1) return localize('times.hour', { values: { time: inHours > 1 ? Math.ceil(inHours) : inHours } })

    const inMinutes = millis / (SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND)
    if (inMinutes >= 1)
        return localize('times.minute', { values: { time: inMinutes > 1 ? Math.ceil(inMinutes) : inMinutes } })

    const inSeconds = millis / MILLISECONDS_PER_SECOND
    if (inSeconds >= 1)
        return localize('times.second', { values: { time: inSeconds > 1 ? Math.ceil(inSeconds) : inSeconds } })

    return zeroTime
}
