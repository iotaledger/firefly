import { SECONDS_PER_MILESTONE } from '../network/constants'
import { MILLISECONDS_PER_SECOND } from './constants'
import { IDateDifference } from './interfaces'

export function datesOnSameDay(first: Date, second: Date): boolean {
    return first.toDateString() === second.toDateString()
}

export function dateIsBeforeOtherDate(first: Date, second: Date): boolean {
    return first < second && !datesOnSameDay(first, second)
}

export function dateIsAfterOtherDate(first: Date, second: Date): boolean {
    return first > second && !datesOnSameDay(first, second)
}

/**
 * Get if a date is considered "recent". Less than 1 month is considered recent.
 */
export function isRecentDate(date: Date): { lessThanAMonth: boolean; lessThanThreeMonths: boolean } {
    if (!(date instanceof Date)) {
        return null
    }

    const currentDate = new Date()
    const isFutureDate = dateIsAfterOtherDate(date, currentDate)

    if (isFutureDate) {
        return null
    }

    const oneMonthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate())
    const threeMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, currentDate.getDate())

    return {
        lessThanAMonth: date >= oneMonthAgo,
        lessThanThreeMonths: date >= threeMonthsAgo,
    }
}

/**
 * Get difference between two dates in weeks
 */
export function diffDates(firstDate: Date, secondDate: Date): IDateDifference {
    if (!(firstDate instanceof Date) || !(secondDate instanceof Date)) {
        return null
    }
    const diff = Math.abs(secondDate.getTime() - firstDate.getTime())
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
    if (Math.abs(firstDate.getDate() - secondDate.getDate()) > 1) {
        return { unit: 'daysAgo', value: days }
    }
    if (firstDate.getDate() !== secondDate.getDate()) {
        return { unit: 'yesterday' }
    }
    return { unit: 'today' }
}

/**
 * Converts milestone to date based on current milestone
 *
 * @method milestoneToDate
 *
 * @param {number} baseMilestone - Milestone to start from, generally the current milestone
 * @param {number} milestone
 *
 * @returns {Date}
 */
export function milestoneToDate(baseMilestone: number, milestone: number): Date {
    const firstMilestoneMillis = Date.now() - baseMilestone * SECONDS_PER_MILESTONE * MILLISECONDS_PER_SECOND
    const milestoneMillis = firstMilestoneMillis + milestone * SECONDS_PER_MILESTONE * MILLISECONDS_PER_SECOND
    return new Date(milestoneMillis)
}
