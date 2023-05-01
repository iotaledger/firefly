import { range, tryNumberOrZero, isNumberLetterOrPunctuation, round } from '../number'

describe('range', () => {
    test('returns an empty array when size is zero or negative', () => {
        expect(range(0)).toEqual([])
        expect(range(-1)).toEqual([])
    })
    test('returns an array with the specified size and starting at the specified value', () => {
        expect(range(5, 1)).toEqual([1, 2, 3, 4, 5])
        expect(range(3, 10)).toEqual([10, 11, 12])
    })
    test('defaults to start at 0 when not provided', () => {
        expect(range(3)).toEqual([0, 1, 2])
    })
})

describe('tryNumberOrZero', () => {
    test('returns zero when given NaN or non-numeric input', () => {
        expect(tryNumberOrZero(NaN)).toBe(0)
        expect(tryNumberOrZero('abc')).toBe(0)
        expect(tryNumberOrZero(undefined)).toBe(0)
    })
    test('returns the correct number when given numeric input', () => {
        expect(tryNumberOrZero(42)).toBe(42)
        expect(tryNumberOrZero('42')).toBe(42)
    })
})

describe('isNumberLetterOrPunctuation', () => {
    test('returns false for strings with more than one character', () => {
        expect(isNumberLetterOrPunctuation('abc')).toBe(false)
    })
    test('returns true for valid number, letter or punctuation characters', () => {
        expect(isNumberLetterOrPunctuation('a')).toBe(true)
        expect(isNumberLetterOrPunctuation('Z')).toBe(true)
        expect(isNumberLetterOrPunctuation('5')).toBe(true)
    })
    test('returns false for invalid characters', () => {
        expect(isNumberLetterOrPunctuation(' ')).toBe(false)
        expect(isNumberLetterOrPunctuation('€')).toBe(false)
    })
})

describe('round', () => {
    test('rounds the given value to the specified precision', () => {
        expect(round(1.2345, 2)).toBe(1.23)
        expect(round(1.2345, 3)).toBe(1.235)
    })
    test('defaults to rounding to the nearest whole number when no precision is provided', () => {
        expect(round(1.5)).toBe(2)
        expect(round(1.49)).toBe(1)
    })
})
