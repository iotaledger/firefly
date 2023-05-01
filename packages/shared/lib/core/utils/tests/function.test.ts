import { isFunction } from '../function'

describe('isFunction', () => {
    test('returns true for valid function input', () => {
        const testFunction = () => {}
        expect(isFunction(testFunction)).toBe(true)
    })

    test('returns false for non-function input', () => {
        expect(isFunction(undefined)).toBe(false)
        expect(isFunction(null)).toBe(false)
        expect(isFunction(42)).toBe(false)
        expect(isFunction('hello')).toBe(false)
        expect(isFunction({})).toBe(false)
        expect(isFunction([])).toBe(false)
    })
})
