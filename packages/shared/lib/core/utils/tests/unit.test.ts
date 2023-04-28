import { convertIotaUnit, formatIotaUnitPrecision, formatIotaUnitBestMatch, getIotaUnit } from '@core/utils/unit'
import { IotaUnit } from '@core/utils/enums'

describe('File: unit.ts', () => {
    describe('convertIotaUnit', () => {
        test('converts from K to M', () => {
            expect(convertIotaUnit(1_000, IotaUnit.K, IotaUnit.M)).toBe(1)
        })
        test('converts from M to K', () => {
            expect(convertIotaUnit(1, IotaUnit.M, IotaUnit.K)).toBe(1_000)
        })
        test('converts within the same unit (M to M)', () => {
            expect(convertIotaUnit(1_000, IotaUnit.M, IotaUnit.M)).toBe(1_000)
        })
        test('converts zero value', () => {
            expect(convertIotaUnit(0, IotaUnit.M, IotaUnit.K)).toBe(0)
        })
        test('converts from base unit to T', () => {
            expect(convertIotaUnit(1_000_000_000_000, IotaUnit._, IotaUnit.T)).toBe(1)
        })
    })

    describe('formatIotaUnitPrecision', () => {
        test('formats without units, ungrouped', () => {
            expect(formatIotaUnitPrecision(1234567.89, IotaUnit.M, false)).toBe('1.234568')
        })
        test('formats with units, ungrouped', () => {
            expect(formatIotaUnitPrecision(1234567.89, IotaUnit.M)).toBe('1.234568 M')
        })
        test('formats without units, grouped', () => {
            expect(formatIotaUnitPrecision(1234567.89, IotaUnit.M, false, true)).toBe('1.234568')
        })
        test('formats with units, grouped', () => {
            expect(formatIotaUnitPrecision(1234567.89, IotaUnit.M, true, true)).toBe('1.234568 M')
        })
        test('formats with overridden decimal places', () => {
            expect(formatIotaUnitPrecision(1234567.89, IotaUnit.M, true, false, 3)).toBe('1.235 M')
        })
        test('formats large number', () => {
            expect(formatIotaUnitPrecision(123456789012345678, IotaUnit.P)).toBe('123.45678901234568 P')
        })
        test('formats zero', () => {
            expect(formatIotaUnitPrecision(0, IotaUnit.M)).toBe('0 M')
        })
        test('formats negative number', () => {
            expect(formatIotaUnitPrecision(-1234567.89, IotaUnit.M)).toBe('-1.234568 M')
        })
    })

    describe('formatIotaUnitBestMatch', () => {
        test('formats value in base unit with units', () => {
            expect(formatIotaUnitBestMatch(123)).toBe('123 _')
        })
        test('formats value in base unit without units', () => {
            expect(formatIotaUnitBestMatch(123, false)).toBe('123')
        })
        test('formats value in K unit with units', () => {
            expect(formatIotaUnitBestMatch(123_000)).toBe('123.00 k')
        })
        test('formats value in T unit with units and 4 decimal places', () => {
            expect(formatIotaUnitBestMatch(123_456_789_000_000, true, 4)).toBe('123.4568 T')
        })
        test('formats value in P unit without units and 2 decimal places', () => {
            expect(formatIotaUnitBestMatch(123_456_789_000_000_000, false, 2)).toBe('123.46')
        })
    })

    describe('getIotaUnit', () => {
        test('value = 0', () => {
            expect(getIotaUnit(0)).toBe(IotaUnit.M)
        })
        test('value in IotaUnit._ range', () => {
            expect(getIotaUnit(1)).toBe(IotaUnit._)
            expect(getIotaUnit(999)).toBe(IotaUnit._)
        })
        test('value in IotaUnit.K range', () => {
            expect(getIotaUnit(1_000)).toBe(IotaUnit.K)
            expect(getIotaUnit(999_999)).toBe(IotaUnit.K)
        })
        test('value in IotaUnit.M range', () => {
            expect(getIotaUnit(1_000_000)).toBe(IotaUnit.M)
            expect(getIotaUnit(999_999_999)).toBe(IotaUnit.M)
        })
        test('value in IotaUnit.G range', () => {
            expect(getIotaUnit(1_000_000_000)).toBe(IotaUnit.G)
            expect(getIotaUnit(999_999_999_999)).toBe(IotaUnit.G)
        })
        test('value in IotaUnit.T range', () => {
            expect(getIotaUnit(1_000_000_000_000)).toBe(IotaUnit.T)
            expect(getIotaUnit(999_999_999_999_999)).toBe(IotaUnit.T)
        })
        test('value in IotaUnit.P range', () => {
            expect(getIotaUnit(1_000_000_000_000_000)).toBe(IotaUnit.P)
            expect(getIotaUnit(999_999_999_999_999_999)).toBe(IotaUnit.P)
        })
    })
})
