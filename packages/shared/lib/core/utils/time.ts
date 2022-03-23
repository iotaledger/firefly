import { DateDiff } from '@lib/typings/wallet'
import { localize } from '@core/i18n'

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

/**
 * Get difference between two dates in weeks
 * @param firstDate: first date to compare
 * @param secondDate: second sate to compare
 */
export const diffDates = (firstDate: Date, secondDate: Date): DateDiff => {
    if (!(firstDate instanceof Date) || !(secondDate instanceof Date)) {
        return null
    }
    const diff = Math.floor(secondDate.getTime() - firstDate.getTime())
    const day = 1000 * 60 * 60 * 24

    const days = Math.floor(diff / day)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(weeks / 4.33)
    const years = Math.floor(months / 12)

    if (years > 0) {
        return { unit: 'yearsAgo', value: years }
    }
    if (months > 0) {
        return { unit: 'monthsAgo', value: months }
    }
    if (weeks > 0) {
        return { unit: 'weeksAgo', value: weeks }
    }
    if (days > 0) {
        return { unit: 'daysAgo', value: days }
    }

    if (firstDate.getDate() !== secondDate.getDate()) {
        return { unit: 'yesterday' }
    }

    return { unit: 'today' }
}

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

/**
 * Get if a date is considered "recent". Less than 1 month is considered recent.
 * @param date: date to know if recent or not, compared to today. Must be in the past.
 */
export const isRecentDate = (date: Date): { lessThanAMonth; lessThanThreeMonths } => {
    if (!(date instanceof Date)) {
        return null
    }
    const diff = Math.floor(new Date().getTime() - date.getTime())
    const day = 1000 * 60 * 60 * 24
    const days = Math.floor(diff / day)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(weeks / 4.33)
    const threeMonths = Math.floor(months / 3)

    return { lessThanAMonth: months == 0, lessThanThreeMonths: threeMonths == 0 }
}

/**
 * Returns a timeout for a given duration (milliseconds).
 * @param ms
 */
export function sleep(ms: number): Promise<number> {
    return new Promise((resolve, reject) => setTimeout(resolve, ms))
}
