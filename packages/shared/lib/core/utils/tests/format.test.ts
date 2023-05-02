import { formatHexString, getMonthYear } from '@core/utils/format'

describe('File: format.ts', () => {
    describe('Function: formatHexString', () => {
        const NULL_RESULT = '00'

        it('should handle invalid input', () => {
            expect(formatHexString(undefined)).toEqual(NULL_RESULT)
            expect(formatHexString('')).toEqual(NULL_RESULT)
            expect(formatHexString('xyz')).toEqual(NULL_RESULT)
        })
        it('should handle invalid hex strings', () => {
            expect(formatHexString('123G')).toEqual(NULL_RESULT)
            expect(formatHexString('0x123G')).toEqual(NULL_RESULT)
        })
        it('should handle valid hex strings', () => {
            expect(formatHexString('0')).toEqual('0x0')
            expect(formatHexString('0x1')).toEqual('0x1')
            expect(formatHexString('0x1a2b3c')).toEqual('0x1A2B3C')
        })
        it('should handle valid hex strings with modifications', () => {
            expect(formatHexString('0', true, false)).toEqual('0')
            expect(formatHexString('0x1', false, false)).toEqual('1')
            expect(formatHexString('0x1a2b3c', true, true)).toEqual('0x1A2B3C')
            expect(formatHexString('0x1A2B3C', false, true)).toEqual('0x1a2b3c')
        })
    })
    describe('Function: getMonthYear', () => {
        it('should return the month and year', () => {
            expect(getMonthYear(new Date(2020, 0, 1))).toEqual('Jan 2020')
            expect(getMonthYear(new Date(2020, 1, 1))).toEqual('Feb 2020')
            expect(getMonthYear(new Date(2020, 2, 1))).toEqual('Mar 2020')
            expect(getMonthYear(new Date(2020, 3, 1))).toEqual('Apr 2020')
            expect(getMonthYear(new Date(2020, 4, 1))).toEqual('May 2020')
            expect(getMonthYear(new Date(2020, 5, 1))).toEqual('Jun 2020')
            expect(getMonthYear(new Date(2020, 6, 1))).toEqual('Jul 2020')
            expect(getMonthYear(new Date(2020, 7, 1))).toEqual('Aug 2020')
            expect(getMonthYear(new Date(2020, 8, 1))).toEqual('Sep 2020')
            expect(getMonthYear(new Date(2020, 9, 1))).toEqual('Oct 2020')
            expect(getMonthYear(new Date(2020, 10, 1))).toEqual('Nov 2020')
            expect(getMonthYear(new Date(2020, 11, 1))).toEqual('Dec 2020')
        })
    })
})
