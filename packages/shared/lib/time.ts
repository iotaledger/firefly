import { get, writable } from 'svelte/store'

export const MILLISECONDS_PER_SECOND = 1000
export const SECONDS_PER_MINUTE = 60
export const MINUTES_PER_HOUR = 60
export const HOURS_PER_DAY = 24
export const DAYS_PER_WEEK = 7
export const MONTHS_PER_YEAR = 12

/**
 * The last timestamp that the app user was active
 */
export const lastActiveAt = writable<Date>(new Date())

/**
 * Determines whether a period of time is considered higher
 * or lower than the idle time threshold
 *
 * @param {Date} newLastActiveTime The latest active time detected from the user
 * @param {number} timeoutDuration The timeout duration (millis) threshold for inactivity
 *
 * @returns {boolean} True if the duration from the new and last active times is less than the timeout
 * duration threshold
 */
export const isIdleTimeValid = (newLastActiveTime: Date, timeoutDuration: number): boolean => {
    /**
     * CAUTION: An attacker may be able to manipulate the date / time on his device, so
     * it is necessary to ensure that the newLastActiveTime is really newer than the old one.
     */
    const oldLastActiveTime = get(lastActiveAt)
    const isValidIdleTimestamp = newLastActiveTime >= oldLastActiveTime

    const idleDuration = calculateUpdatedIdleDuration(newLastActiveTime)
    const isValidIdleDuration = idleDuration < timeoutDuration

    return isValidIdleTimestamp && isValidIdleDuration
}

const calculateUpdatedIdleDuration = (newLastActiveTime: Date): number => {
    const oldLastActiveTime = get(lastActiveAt)

    lastActiveAt.set(newLastActiveTime)

    return newLastActiveTime.getTime() - oldLastActiveTime.getTime()
}
