import Big from 'big.js'

import { convertToRawAmount } from '../utils'
import { TokenMetadata } from '../types'
import { TokenStandard } from '../enums'
import { MAX_SUPPORTED_DECIMALS } from '../constants'
import { DEFAULT_BASE_TOKEN, NetworkId } from '@core/network'
import { IotaUnit } from '@core/utils'

const WEB3_TOKEN_METADATA: TokenMetadata = {
    name: 'RAWR',
    tickerSymbol: 'RAWR',
    unit: 'RAWR',
    decimals: 60,
    subunit: 'MEOW',
    useMetricPrefix: false,
    standard: TokenStandard.BaseToken,
}

const IRC30_TOKEN_HIGH_DECIMALS_METADATA: TokenMetadata = {
    standard: TokenStandard.Irc30,
    name: 'Test Token',
    symbol: 'TEST',
    decimals: 100000,
}
const IRC30_TOKEN_LOW_DECIMALS_METADATA: TokenMetadata = {
    standard: TokenStandard.Irc30,
    name: 'Test Token',
    symbol: 'TEST',
    decimals: 6,
}
const INVALID_TOKEN_METADATA: TokenMetadata = {
    standard: 'IRC1000',
    name: 'Bad Token',
    symbol: 'BAD',
    decimals: 0,
}

describe('File: convertToRawAmount.ts', () => {
    it('should return undefined if amount is empty', () => {
        expect(convertToRawAmount('', INVALID_TOKEN_METADATA)).toStrictEqual(undefined)
    })

    describe('given the tokenMetadata standard is BaseToken', () => {
        describe("given useMetricPrefix is true (currently IOTA's case)", () => {
            it.each([
                { amount: '1', unit: IotaUnit._, expected: Big('1').mul(Big(10).pow(0)) },
                { amount: '1', unit: IotaUnit.K, expected: Big('1').mul(Big(10).pow(3)) },
                { amount: '1', unit: IotaUnit.M, expected: Big('1').mul(Big(10).pow(6)) },
                { amount: '1', unit: IotaUnit.G, expected: Big('1').mul(Big(10).pow(9)) },
                { amount: '1', unit: IotaUnit.T, expected: Big('1').mul(Big(10).pow(12)) },
                { amount: '1', unit: IotaUnit.P, expected: Big('1').mul(Big(10).pow(15)) },
            ])('should return amount * $expected when unit is $unit', ({ amount, unit, expected }) => {
                expect(convertToRawAmount(amount, DEFAULT_BASE_TOKEN[NetworkId.Iota], unit)).toStrictEqual(expected)
            })
            it("should treat unit as 'i' and return Big(amount) if the unit provided isn't in the IotaUnit enum", () => {
                expect(convertToRawAmount('1', DEFAULT_BASE_TOKEN[NetworkId.Iota], 'test')).toStrictEqual(Big('1'))
            })
            it("should treat unit as 'i' and return Big(amount) if a unit isn't provided", () => {
                expect(convertToRawAmount('1', DEFAULT_BASE_TOKEN[NetworkId.Iota])).toStrictEqual(Big('1'))
            })
        })
        describe("given useMetricPrefix is false (currently Shimmer's case)", () => {
            it("should return Big(amount) * decimal property if selectedUnit is unit and baseToken's decimal is less than MAX_SUPPORTED_DECIMALS", () => {
                let value = convertToRawAmount('1', DEFAULT_BASE_TOKEN[NetworkId.Shimmer], 'SMR')
                expect(value).toStrictEqual(Big('1').mul(Big(10).pow(DEFAULT_BASE_TOKEN[NetworkId.Shimmer].decimals)))
            })
            it("should return XXX if selectedUnit is unit and baseToken's decimals property is greater than MAX_SUPPORTED_DECIMALS", () => {
                let value = convertToRawAmount('1', WEB3_TOKEN_METADATA, 'RAWR')
                expect(value).toStrictEqual(Big('1').mul(Big(10).pow(MAX_SUPPORTED_DECIMALS)))
            })
            it('should return same Big(amount) if selectedUnit is subunit', () => {
                expect(convertToRawAmount('1', DEFAULT_BASE_TOKEN[NetworkId.Shimmer], 'glow')).toStrictEqual(Big('1'))
            })
            it('should return undefined if a unit is not provided', () => {
                expect(convertToRawAmount('1', DEFAULT_BASE_TOKEN[NetworkId.Shimmer])).toStrictEqual(undefined)
            })
            it('should return undefined if provided unit does not match the tokenMetadata unit or subunit', () => {
                expect(convertToRawAmount('1', DEFAULT_BASE_TOKEN[NetworkId.Shimmer], 'test')).toStrictEqual(undefined)
            })
        })
    })
    describe('given the tokenMetadata standard is Irc30', () => {
        it('should depend on tokenMetadata.decimals if tokenMetadata.decimals <= MAX_SUPPORTED_DECIMALS', () => {
            let value = convertToRawAmount('1', IRC30_TOKEN_LOW_DECIMALS_METADATA)
            expect(value).toStrictEqual(Big('1').mul(Big(10).pow(IRC30_TOKEN_LOW_DECIMALS_METADATA.decimals)))
        })
        it('should depend on MAX_SUPPORTED_DECIMALS if tokenMetadata.decimals > MAX_SUPPORTED_DECIMALS', () => {
            let value = convertToRawAmount('1', IRC30_TOKEN_HIGH_DECIMALS_METADATA)
            expect(value).toStrictEqual(Big('1').mul(Big(10).pow(MAX_SUPPORTED_DECIMALS)))
        })
    })
    it('should throw an error if tokenMetadata standard is not BaseToken or Irc30', () => {
        expect(() => {
            convertToRawAmount('invalid amount', INVALID_TOKEN_METADATA)
        }).toThrow(new Error('convertToRawAmountFromMetadata: Invalid token standard'))
    })
})
