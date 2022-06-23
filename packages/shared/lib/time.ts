// BASE
import { localize } from '@core/i18n'
import { get } from 'svelte/store'
import { networkStatus } from './networkStatus'

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
 * Converts milestone to date based on current milestone
 *
 * @method milestoneToDate
 *
 * @param {number} milestone
 *
 * @returns {Date}
 */
export const milestoneToDate = (milestone: number): Date => {
    const currentMilestone = get(networkStatus)?.currentMilestone
    const firstMilestoneMillis = Date.now() - currentMilestone * SECONDS_PER_MILESTONE * MILLISECONDS_PER_SECOND
    const milestoneMillis = firstMilestoneMillis + milestone * SECONDS_PER_MILESTONE * MILLISECONDS_PER_SECOND
    return new Date(milestoneMillis)
}

/**
 * Gets string duration from millis in days, hours and minutes
 *
 * @method getDurationString
 *
 * @param {number} millis
 *
 * @returns {string}
 */
export const getDurationString = (durationInMillis: number): string => {
    if (!durationInMillis) {
        return `${localize('times.day', { values: { time: 0 } })} ${localize('times.hour', { values: { time: 0 } })}`
    }

    const durationInMinutes = durationInMillis / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)
    const minutes = Math.floor(durationInMinutes % MINUTES_PER_HOUR)
    const hours = Math.floor((durationInMinutes / MINUTES_PER_HOUR) % HOURS_PER_DAY)
    const days = Math.floor(durationInMinutes / (MINUTES_PER_HOUR * HOURS_PER_DAY))

    const minutesString = minutes ? localize('times.minute', { values: { time: minutes } }) : ''
    const hoursString = hours ? localize('times.hour', { values: { time: hours } }) : ''
    const daysString = days ? localize('times.day', { values: { time: days } }) : ''
    return `${daysString} ${hoursString} ${minutesString}`.trim()
}
