import { clamp } from '@core/utils'

describe('File: math.ts', () => {
    describe('Function: clamp', () => {
        test.each([
            ['1', 1, 1],
            [1, undefined, 1],
            [1, 1, {}],
            ['', 1, 1],
            [1, false, 1],
        ])('should return 0 for invalid values', (n, min, max) => {
            expect(clamp(n, min, max)).toEqual(0)
        })
        it('should return min if n is less than min', () => {
            expect(clamp(-1_000, -1, 1)).toEqual(-1)
        })
        it('should return max if n is greater than max', () => {
            expect(clamp(1_000, -1, 1)).toEqual(1)
        })
        it('should return n if n is between min and max', () => {
            expect(clamp(0, -1, 1)).toEqual(0)
        })
        it('should return n if n is equal to min and max', () => {
            expect(clamp(1, 1, 1)).toEqual(1)
        })
        it('should return n if n is equal to max', () => {
            expect(clamp(1, -1_000, 1)).toEqual(1)
        })
        it('should return n if n is equal to min', () => {
            expect(clamp(1, 1, 1_000)).toEqual(1)
        })
    })
})
