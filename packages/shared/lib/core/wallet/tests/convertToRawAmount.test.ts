import Big from 'big.js'

import { convertToRawAmount } from '../utils'
import { TokenMetadata } from '../types'
import { TokenStandard } from '../enums'
import { MAX_SUPPORTED_DECIMALS } from '../constants'
import { NetworkId } from '@core/network'
import { IBaseToken } from '../interfaces'

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

const DEFAULT_IOTA_BASE_TOKEN: IBaseToken = {
    standard: TokenStandard.BaseToken,
    name: 'IOTA',
    tickerSymbol: 'IOTA',
    unit: 'IOTA',
    decimals: 6,
    subunit: 'micro',
    useMetricPrefix: false,
}

const DEFAULT_SHIMMER_BASE_TOKEN: IBaseToken = {
    standard: TokenStandard.BaseToken,
    name: 'Shimmer',
    tickerSymbol: 'SMR',
    unit: 'SMR',
    decimals: 6,
    subunit: 'glow',
    useMetricPrefix: false,
}

describe('File: convertToRawAmount.ts', () => {
    it('should return undefined if amount is empty', () => {
        expect(convertToRawAmount('', INVALID_TOKEN_METADATA)).toStrictEqual(undefined)
    })

    describe('given the tokenMetadata standard is BaseToken', () => {
        describe("given useMetricPrefix is false (currently IOTA's case)", () => {
            it("should return Big(amount) * decimal property if selectedUnit is unit and baseToken's decimal is less than MAX_SUPPORTED_DECIMALS", () => {
                let value = convertToRawAmount('1', DEFAULT_IOTA_BASE_TOKEN, 'IOTA')
                expect(value).toStrictEqual(Big('1').mul(Big(10).pow(DEFAULT_IOTA_BASE_TOKEN.decimals)))
            })
            it("should return XXX if selectedUnit is unit and baseToken's decimals property is greater than MAX_SUPPORTED_DECIMALS", () => {
                let value = convertToRawAmount('1', WEB3_TOKEN_METADATA, 'RAWR')
                expect(value).toStrictEqual(Big('1').mul(Big(10).pow(MAX_SUPPORTED_DECIMALS)))
            })
            it('should return same Big(amount) if selectedUnit is subunit', () => {
                expect(convertToRawAmount('1', DEFAULT_IOTA_BASE_TOKEN, 'micro')).toStrictEqual(Big('1'))
            })
            it('should return undefined if a unit is not provided', () => {
                expect(convertToRawAmount('1', DEFAULT_IOTA_BASE_TOKEN)).toStrictEqual(undefined)
            })
            it('should return undefined if provided unit does not match the tokenMetadata unit or subunit', () => {
                expect(convertToRawAmount('1', DEFAULT_IOTA_BASE_TOKEN, 'test')).toStrictEqual(undefined)
            })
        })
        describe("given useMetricPrefix is false (currently Shimmer's case)", () => {
            it("should return Big(amount) * decimal property if selectedUnit is unit and baseToken's decimal is less than MAX_SUPPORTED_DECIMALS", () => {
                let value = convertToRawAmount('1', DEFAULT_SHIMMER_BASE_TOKEN, 'SMR')
                expect(value).toStrictEqual(Big('1').mul(Big(10).pow(DEFAULT_SHIMMER_BASE_TOKEN.decimals)))
            })
            it("should return XXX if selectedUnit is unit and baseToken's decimals property is greater than MAX_SUPPORTED_DECIMALS", () => {
                let value = convertToRawAmount('1', WEB3_TOKEN_METADATA, 'RAWR')
                expect(value).toStrictEqual(Big('1').mul(Big(10).pow(MAX_SUPPORTED_DECIMALS)))
            })
            it('should return same Big(amount) if selectedUnit is subunit', () => {
                expect(convertToRawAmount('1', DEFAULT_SHIMMER_BASE_TOKEN, 'glow')).toStrictEqual(Big('1'))
            })
            it('should return undefined if a unit is not provided', () => {
                expect(convertToRawAmount('1', DEFAULT_SHIMMER_BASE_TOKEN)).toStrictEqual(undefined)
            })
            it('should return undefined if provided unit does not match the tokenMetadata unit or subunit', () => {
                expect(convertToRawAmount('1', DEFAULT_SHIMMER_BASE_TOKEN, 'test')).toStrictEqual(undefined)
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
