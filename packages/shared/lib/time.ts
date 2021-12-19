// BASE
import { localize } from './i18n'

export const MILLISECONDS_PER_SECOND = 1000
export const SECONDS_PER_MINUTE = 60
export const MINUTES_PER_HOUR = 60
export const HOURS_PER_DAY = 24
export const DAYS_PER_WEEK = 7
export const MONTHS_PER_YEAR = 12

// DOMAIN-SPECIFIC
export const SECONDS_PER_MILESTONE = 10

// DERIVED
export const SECONDS_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE

type Duration = 'day' | 'hour' | 'minute' | 'second'

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
    if (inDays > 1 || inDays === 1) return localize('times.day', { values: { time: Math.floor(inDays) } })

    const inHours = millis / (MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND)
    if (inHours > 1 || inHours === 1) return localize('times.hour', { values: { time: Math.floor(inHours) } })

    const inMinutes = millis / (SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND)
    if (inMinutes > 1 || inMinutes === 1) return localize('times.minute', { values: { time: Math.floor(inMinutes) } })

    const inSeconds = millis / MILLISECONDS_PER_SECOND
    if (inSeconds > 1 || inSeconds === 1) return localize('times.second', { values: { time: Math.floor(inSeconds) } })

    return zeroTime
}
