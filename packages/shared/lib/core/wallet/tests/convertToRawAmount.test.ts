import Big from 'big.js'

import { convertToRawAmount } from '../utils'
import { TokenMetadata } from '../types'
import { TokenStandard } from '../enums'
import { MAX_SUPPORTED_DECIMALS } from '../constants'
import { BASE_TOKEN, NetworkProtocol } from '@core/network'
import { IOTA_UNIT_MAP } from '@core/utils'

const iotaMetadata: TokenMetadata = {
    ...BASE_TOKEN[NetworkProtocol.IOTA],
    standard: TokenStandard.BaseToken,
}
const shimmerMetadata: TokenMetadata = {
    ...BASE_TOKEN[NetworkProtocol.Shimmer],
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
    describe('Function: convertToRawAmount', () => {
        it('should return undefined if amount is empty', () => {
            expect(convertToRawAmount('', invalidTokenMetadata)).toBeUndefined()
        })
        it.todo('should parse amount to number')
    })

    describe('Function: convertToRawAmountFromMetadata', () => {
        describe('given the tokenMetadata standard is BaseToken', () => {
            it.todo('should return XXX if tokenMetadata standard is BaseToken and useMetricPrefix is true')
            it('', () => {
                expect(convertToRawAmount('1', iotaMetadata, 'i')).toStrictEqual(Big('1').mul(Big(10).pow(0)))
            })

            describe('if tokenMetadata standard is BaseToken and useMetricPrefix is false', () => {
                it.todo('should return XXX if selectedUnit is tokenMetadata unit')
                it.todo('should return XXX if selectedUnit is tokenMetadata subunit')
                it('', () => {})
            })
        })
        describe('given the tokenMetadata standard is Irc30', () => {
            it('should depend on tokenMetadata.decimals if tokenMetadata.decimals <= MAX_SUPPORTED_DECIMALS', () => {
                expect(convertToRawAmount('1', irc30TokenLowDecimalsMetadata)).toStrictEqual(
                    Big('1').mul(Big(10).pow(irc30TokenLowDecimalsMetadata.decimals))
                )
            })
            it('should depend on MAX_SUPPORTED_DECIMALS if tokenMetadata.decimals > MAX_SUPPORTED_DECIMALS', () => {
                expect(convertToRawAmount('1', irc30TokenHighDecimalsMetadata)).toStrictEqual(
                    Big('1').mul(Big(10).pow(MAX_SUPPORTED_DECIMALS))
                )
            })
        })
        it('should throw an error if tokenMetadata standard is not BaseToken or Irc30', () => {
            expect(() => {
                convertToRawAmount('invalid amount', invalidTokenMetadata)
            }).toThrow(new Error('convertToRawAmountFromMetadata: Invalid token standard'))
        })
    })
})
