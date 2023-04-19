import Big from 'big.js'

import { convertToRawAmount } from '../utils'
import { TokenMetadata } from '../types'
import { TokenStandard } from '../enums'
import { MAX_SUPPORTED_DECIMALS } from '../constants'
import { BASE_TOKEN, NetworkProtocol } from '@core/network'
import { IOTA_UNIT_MAP, IotaUnit } from '@core/utils'

const iotaMetadata: TokenMetadata = {
    ...BASE_TOKEN[NetworkProtocol.IOTA],
    standard: TokenStandard.BaseToken,
}
const shimmerMetadata: TokenMetadata = {
    ...BASE_TOKEN[NetworkProtocol.Shimmer],
    standard: TokenStandard.BaseToken,
}
const web3TokenMetadata: TokenMetadata = {
    name: 'RAWR',
    tickerSymbol: 'RAWR',
    unit: 'RAWR',
    decimals: 60,
    subunit: 'MEOW',
    useMetricPrefix: false,
    standard: TokenStandard.BaseToken,
}

const irc30TokenHighDecimalsMetadata: TokenMetadata = {
    standard: TokenStandard.Irc30,
    name: 'Test Token',
    symbol: 'TEST',
    decimals: 100000,
}
const irc30TokenLowDecimalsMetadata: TokenMetadata = {
    standard: TokenStandard.Irc30,
    name: 'Test Token',
    symbol: 'TEST',
    decimals: 6,
}
const invalidTokenMetadata: TokenMetadata = {
    standard: 'IRC1000',
    name: 'Bad Token',
    symbol: 'BAD',
    decimals: 0,
}

describe('File: convertToRawAmount.ts', () => {
    it('should return undefined if amount is empty', () => {
        expect(convertToRawAmount('', invalidTokenMetadata)).toBeUndefined()
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
                expect(convertToRawAmount(amount, iotaMetadata, unit)).toStrictEqual(expected)
            })
            it("should treat unit as 'i' and return Big(amount) if the unit provided isn't in the IotaUnit enum", () => {
                expect(convertToRawAmount('1', iotaMetadata, 'test')).toStrictEqual(Big('1'))
            })
            it("should treat unit as 'i' and return Big(amount) if a unit isn't provided", () => {
                expect(convertToRawAmount('1', iotaMetadata)).toStrictEqual(Big('1'))
            })
        })
        describe("given useMetricPrefix is false (currently Shimmer's case)", () => {
            it("should return Big(amount) * decimal property if selectedUnit is unit and baseToken's decimal is less than MAX_SUPPORTED_DECIMALS", () => {
                let value = convertToRawAmount('1', shimmerMetadata, 'SMR')
                expect(value).toStrictEqual(Big('1').mul(Big(10).pow(shimmerMetadata.decimals)))
            })
            it("should return XXX if selectedUnit is unit and baseToken's decimals property is greater than MAX_SUPPORTED_DECIMALS", () => {
                let value = convertToRawAmount('1', web3TokenMetadata, 'RAWR')
                expect(value).toStrictEqual(Big('1').mul(Big(10).pow(MAX_SUPPORTED_DECIMALS)))
            })
            it('should return same Big(amount) if selectedUnit is subunit', () => {
                expect(convertToRawAmount('1', shimmerMetadata, 'glow')).toStrictEqual(Big('1'))
            })
            it('should return undefined if a unit is not provided', () => {
                expect(convertToRawAmount('1', shimmerMetadata)).toBeUndefined()
            })
            it('should return undefined if provided unit does not match the tokenMetadata unit or subunit', () => {
                expect(convertToRawAmount('1', shimmerMetadata, 'test')).toBeUndefined()
            })
        })
    })
    describe('given the tokenMetadata standard is Irc30', () => {
        it('should depend on tokenMetadata.decimals if tokenMetadata.decimals <= MAX_SUPPORTED_DECIMALS', () => {
            let value = convertToRawAmount('1', irc30TokenLowDecimalsMetadata)
            expect(value).toStrictEqual(Big('1').mul(Big(10).pow(irc30TokenLowDecimalsMetadata.decimals)))
        })
        it('should depend on MAX_SUPPORTED_DECIMALS if tokenMetadata.decimals > MAX_SUPPORTED_DECIMALS', () => {
            let value = convertToRawAmount('1', irc30TokenHighDecimalsMetadata)
            expect(value).toStrictEqual(Big('1').mul(Big(10).pow(MAX_SUPPORTED_DECIMALS)))
        })
    })
    it('should throw an error if tokenMetadata standard is not BaseToken or Irc30', () => {
        expect(() => {
            convertToRawAmount('invalid amount', invalidTokenMetadata)
        }).toThrow(new Error('convertToRawAmountFromMetadata: Invalid token standard'))
    })
})
