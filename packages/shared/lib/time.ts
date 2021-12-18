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

/**
 * Formats a duration in milliseconds into the best matching unit, i.e.
 * it will only return a number of days, hours, minutes, or seconds but NOT
 * together.
 *
 * @method getBestTimeDuration
 *
 * @param {number} millis
 * @param {'days' | 'hours' | 'minutes' | 'seconds'} noDurationUnit
 *
 * @returns {string}
 */
export const getBestTimeDuration = (
    millis: number,
    noDurationUnit: 'days' | 'hours' | 'minutes' | 'seconds' = 'days'
): string => {
    const noDurationInLocale = localize(`general.time.${noDurationUnit}`, { values: { [noDurationUnit]: '0' } })
    if (Number.isNaN(millis)) return noDurationInLocale

    const inDays = millis / (HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND)
    if (inDays >= 1) {
        return localize('general.time.days', { values: { days: Math.ceil(inDays).toString() } })
    }

    const inHours = millis / (MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND)
    if (inHours >= 1) {
        return localize('general.time.hours', { values: { hours: Math.ceil(inHours).toString() } })
    }

    const inMinutes = millis / (SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND)
    if (inMinutes >= 1) {
        return localize('general.time.minutes', { values: { minutes: Math.ceil(inMinutes).toString() } })
    }

    const inSeconds = millis / MILLISECONDS_PER_SECOND
    if (inSeconds >= 1) {
        return localize('general.time.seconds', { values: { seconds: Math.ceil(inSeconds).toString() } })
    }

    return noDurationInLocale
}
