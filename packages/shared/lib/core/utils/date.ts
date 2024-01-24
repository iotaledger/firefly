import { SECONDS_PER_SLOT } from '../network/constants'

import { DAYS_PER_WEEK, MILLISECONDS_PER_DAY, MILLISECONDS_PER_SECOND, MONTHS_PER_YEAR } from './constants'
import { PastTimeUnit } from './enums'
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
export function isRecentDate(date: Date): { lessThanAMonth: boolean; lessThanThreeMonths: boolean } | null {
    if (!isValidDate(date)) {
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

// https://stackoverflow.com/questions/643782/how-to-check-whether-an-object-is-a-date
export function isValidDate(date: unknown): date is Date {
    return !!date && date instanceof Date && !isNaN(date.getTime())
}

/**
 * Get difference between two dates in weeks
 */
export function diffDates(firstDate: Date | null, secondDate: Date): IDateDifference | null {
    if (!isValidDate(firstDate) || !isValidDate(secondDate)) {
        return null
    }
    const timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime())
    const daysDifference = Math.floor(timeDifference / MILLISECONDS_PER_DAY)
    const weeksDifference = Math.floor(daysDifference / DAYS_PER_WEEK)
    const monthsDifference =
        Math.abs(secondDate.getMonth() - firstDate.getMonth()) +
        Math.abs(secondDate.getFullYear() - firstDate.getFullYear()) * MONTHS_PER_YEAR
    const yearsDifference = Math.abs(secondDate.getFullYear() - firstDate.getFullYear())

    if (yearsDifference >= 1) {
        return { unit: PastTimeUnit.YearsAgo, value: yearsDifference }
    }
    if (monthsDifference >= 1) {
        return { unit: PastTimeUnit.MonthsAgo, value: monthsDifference }
    }
    if (weeksDifference >= 1) {
        return { unit: PastTimeUnit.WeeksAgo, value: weeksDifference }
    }
    if (daysDifference > 1) {
        return { unit: PastTimeUnit.DaysAgo, value: daysDifference }
    }
    if (daysDifference === 1) {
        return { unit: PastTimeUnit.Yesterday }
    }
    return { unit: PastTimeUnit.Today }
}

/**
 * Converts slot to date based on current slot
 * @param {number} baseSlot - Slot to start from, generally the current slot
 * @param {number} slot
 */
export function slotToDate(baseSlot: number, slot: number): Date {
    const millisecondsPerSlot = SECONDS_PER_SLOT * MILLISECONDS_PER_SECOND
    const firstSlotMillis = Date.now() - baseSlot * millisecondsPerSlot
    const slotMillis = firstSlotMillis + slot * millisecondsPerSlot
    return new Date(slotMillis)
}
