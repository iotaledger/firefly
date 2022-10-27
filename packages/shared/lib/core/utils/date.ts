import { IDateDifference } from './interfaces'

export function datesOnSameDay(first: Date, second: Date): boolean {
    return (
        first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate()
    )
}

export function dateIsBeforeOtherDate(first: Date, second: Date): boolean {
    return first < second && !datesOnSameDay(first, second)
}

export function dateIsAfterOtherDate(first: Date, second: Date): boolean {
    return first > second && !datesOnSameDay(first, second)
}

/**
 * Get if a date is considered "recent". Less than 1 month is considered recent.
 * @param date: date to know if recent or not, compared to today. Must be in the past.
 */
export function isRecentDate(date: Date): { lessThanAMonth; lessThanThreeMonths } {
    if (!(date instanceof Date)) {
        return null
    }
    const diff = Math.floor(new Date().getTime() - date.getTime())
    const day = 1000 * 60 * 60 * 24
    const days = Math.floor(diff / day)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(weeks / 4.33)
    const threeMonths = Math.floor(months / 3)

    return { lessThanAMonth: months === 0, lessThanThreeMonths: threeMonths === 0 }
}

/**
 * Get difference between two dates in weeks
 * @param firstDate: first date to compare
 * @param secondDate: second sate to compare
 */
export function diffDates(firstDate: Date, secondDate: Date): IDateDifference {
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
