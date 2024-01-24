import {
    datesOnSameDay,
    dateIsBeforeOtherDate,
    dateIsAfterOtherDate,
    isRecentDate,
    isValidDate,
    diffDates,
    slotToDate,
} from '../date'
import { SECONDS_PER_SLOT } from '../../network/constants'
import { MILLISECONDS_PER_SECOND } from '../constants'

describe('datesOnSameDay', () => {
    test('returns true for the same date', () => {
        const date = new Date()
        expect(datesOnSameDay(date, date)).toBe(true)
    })
    test('returns true for different date objects on the same day', () => {
        const date1 = new Date('2023-04-28T10:00:00')
        const date2 = new Date('2023-04-28T22:00:00')
        expect(datesOnSameDay(date1, date2)).toBe(true)
    })
    test('returns false for dates on different days', () => {
        const date1 = new Date('2023-04-28')
        const date2 = new Date('2023-04-29')
        expect(datesOnSameDay(date1, date2)).toBe(false)
    })
})

describe('dateIsBeforeOtherDate', () => {
    test('returns true when the first date is before the second date', () => {
        const date1 = new Date('2023-04-28')
        const date2 = new Date('2023-04-29')
        expect(dateIsBeforeOtherDate(date1, date2)).toBe(true)
    })
    test('returns false when the first date is after the second date', () => {
        const date1 = new Date('2023-04-29')
        const date2 = new Date('2023-04-28')
        expect(dateIsBeforeOtherDate(date1, date2)).toBe(false)
    })
    test('returns false when the dates are on the same day', () => {
        const date1 = new Date('2023-04-28T10:00:00')
        const date2 = new Date('2023-04-28T22:00:00')
        expect(dateIsBeforeOtherDate(date1, date2)).toBe(false)
    })
})

describe('dateIsAfterOtherDate', () => {
    test('returns true when the first date is after the second date', () => {
        const date1 = new Date('2023-04-29')
        const date2 = new Date('2023-04-28')
        expect(dateIsAfterOtherDate(date1, date2)).toBe(true)
    })
    test('returns false when the first date is before the second date', () => {
        const date1 = new Date('2023-04-28')
        const date2 = new Date('2023-04-29')
        expect(dateIsAfterOtherDate(date1, date2)).toBe(false)
    })
    test('returns false when the dates are on the same day', () => {
        const date1 = new Date('2023-04-28T10:00:00')
        const date2 = new Date('2023-04-28T22:00:00')
        expect(dateIsAfterOtherDate(date1, date2)).toBe(false)
    })
})

describe('isRecentDate', () => {
    test('returns true for lessThanAMonth and lessThanThreeMonths for a date within a month', () => {
        const date = new Date()
        date.setDate(date.getDate() - 10)
        const result = isRecentDate(date)
        expect(result.lessThanAMonth).toBe(true)
        expect(result.lessThanThreeMonths).toBe(true)
    })
    test('returns false for lessThanAMonth and true for lessThanThreeMonths for a date within three months but more than a month', () => {
        const date = new Date()
        date.setDate(date.getDate() - 45)
        const result = isRecentDate(date)
        expect(result.lessThanAMonth).toBe(false)
        expect(result.lessThanThreeMonths).toBe(true)
    })
    test('returns false for lessThanAMonth and false for lessThanThreeMonths for a date older than three months', () => {
        const date = new Date()
        date.setDate(date.getDate() - 100)
        const result = isRecentDate(date)
        expect(result.lessThanAMonth).toBe(false)
        expect(result.lessThanThreeMonths).toBe(false)
    })
    test('returns null for a future date', () => {
        const date = new Date()
        date.setDate(date.getDate() + 10)
        const result = isRecentDate(date)
        expect(result).toBe(null)
    })
})

describe('isValidDate', () => {
    it('should return true for a past date', () => {
        expect(isValidDate(new Date(Date.now() - 100_000_000))).toBe(true)
    })
    it('should return true for a future date', () => {
        expect(isValidDate(new Date(Date.now() + 100_000_000))).toBe(true)
    })
    it('should return true for a present date', () => {
        expect(isValidDate(new Date())).toBe(true)
    })
    it('should return false if date is instantiated with a string', () => {
        expect(isValidDate(new Date(''))).toBe(false)
    })
})

describe('diffDates', () => {
    test('returns difference in days for dates within the same week', () => {
        const firstDate = new Date('2023-04-28T12:00:00Z')
        const secondDate = new Date('2023-04-30T12:00:00Z')
        const result = diffDates(firstDate, secondDate)
        expect(result.unit).toBe('daysAgo')
        expect(result.value).toBe(2)
    })
    test('returns difference in weeks for dates within the same month but different weeks', () => {
        const firstDate = new Date('2023-04-01T12:00:00Z')
        const secondDate = new Date('2023-04-22T12:00:00Z')
        const result = diffDates(firstDate, secondDate)
        expect(result.unit).toBe('weeksAgo')
        expect(result.value).toBe(3)
    })
    test('returns difference in months for dates within the same year but different months', () => {
        const firstDate = new Date('2023-04-01T12:00:00Z')
        const secondDate = new Date('2023-07-01T12:00:00Z')
        const result = diffDates(firstDate, secondDate)
        expect(result.unit).toBe('monthsAgo')
        expect(result.value).toBe(3)
    })
    test('returns difference in years for dates in different years', () => {
        const firstDate = new Date('2025-04-01T12:00:00Z')
        const secondDate = new Date('2023-04-01T12:00:00Z')
        const result = diffDates(firstDate, secondDate)
        expect(result.unit).toBe('yearsAgo')
        expect(result.value).toBe(2)
    })
    test('returns yesterday for dates with a one-day difference', () => {
        const firstDate = new Date('2023-04-27T12:00:00Z')
        const secondDate = new Date('2023-04-28T12:00:00Z')
        const result = diffDates(firstDate, secondDate)
        expect(result.unit).toBe('yesterday')
    })
    test('returns today for dates on the same day', () => {
        const firstDate = new Date('2023-04-28T12:00:00Z')
        const secondDate = new Date('2023-04-28T15:00:00Z')
        const result = diffDates(firstDate, secondDate)
        expect(result.unit).toBe('today')
    })
})

describe('slotToDate', () => {
    test('returns the correct date for a past milestone based on the current milestone', () => {
        const baseMilestone = 10
        const milestone = 5
        const currentMillis = Date.now()
        const expectedMillis = currentMillis - (baseMilestone - milestone) * SECONDS_PER_SLOT * MILLISECONDS_PER_SECOND
        const expectedDate = new Date(expectedMillis)

        const result = slotToDate(baseMilestone, milestone)
        expect(result.getTime()).toBeCloseTo(expectedDate.getTime(), -2) // Tolerating a 100ms difference
    })
    test('returns the correct date for the current milestone', () => {
        const baseMilestone = 10
        const milestone = 10
        const currentMillis = Date.now()
        const expectedDate = new Date(currentMillis)

        const result = slotToDate(baseMilestone, milestone)
        expect(result.getTime()).toBeCloseTo(expectedDate.getTime(), -2) // Tolerating a 100ms difference
    })
    test('returns the correct date for a future milestone based on the current milestone', () => {
        const baseMilestone = 10
        const milestone = 15
        const currentMillis = Date.now()
        const expectedMillis = currentMillis + (milestone - baseMilestone) * SECONDS_PER_SLOT * MILLISECONDS_PER_SECOND
        const expectedDate = new Date(expectedMillis)

        const result = slotToDate(baseMilestone, milestone)
        expect(result.getTime()).toBeCloseTo(expectedDate.getTime(), -2) // Tolerating a 100ms difference
    })
})
