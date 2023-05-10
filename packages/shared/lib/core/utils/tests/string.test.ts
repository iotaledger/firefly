import { isStringTrue } from '@core/utils'

describe('File: string.ts', () => {
    describe('Function: isStringTrue', () => {
        it('should return true if string is "true"', () => {
            expect(isStringTrue('true')).toBeTruthy()
        })
        it('should return false if string is different to "true"', () => {
            expect(isStringTrue('truee')).toBeFalsy()
            expect(isStringTrue('false')).toBeFalsy()
            expect(isStringTrue('')).toBeFalsy()
        })
    })
})
