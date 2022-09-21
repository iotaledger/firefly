import { convertFromFiat, convertToFiat, isFiatCurrency } from '@lib/currency'
import { AvailableExchangeRates, CurrencyTypes } from '@lib/typings/currency'
import Big from 'big.js'

describe('File: currency.ts', () => {
    describe('Function: convertToFiat', () => {
        it('should convert an amount from IOTAs to fiat (USD)', () => {
            // (10Gi, $1.06/Mi, $1/$1) => $10,600
            const calc = convertToFiat(Big(10_000_000_000), 1.06, 1.0)
            expect(calc).toEqual(10600.0)
        })
        it('should convert an amount from IOTAs to fiat (non-USD)', () => {
            // (10Gi, $1.06/Mi, €0,853/$1) => €9041,80
            let calc = convertToFiat(Big(10_000_000_000), 1.06, 0.853)
            expect(calc).toEqual(9041.8)
        })
    })

    describe('Function: convertFromFiat', () => {
        it('should convert an amount from fiat to IOTAs (USD)', () => {
            // ($10,000, $1.06/Mi, $1/$1) => 9.4340Gi
            const calc = convertFromFiat(10000.0, 1.06, 1.0)
            expect(calc).toEqual(9_433_962_264)
        })
        it('should convert an amount from fiat to IOTAs (non-USD)', () => {
            // (€10000, $1.06/Mi, €0,853/$1) => ~11.0598Gi
            const calc = convertFromFiat(10000.0, 1.06, 0.853)
            expect(calc).toEqual(11_059_744_741)
        })
    })

    describe('Function: isFiatCurrency', () => {
        it('should pass any fiat currency', () => {
            const currencies = [AvailableExchangeRates.USD, AvailableExchangeRates.EUR, AvailableExchangeRates.JPY]

            const result = currencies.filter((c) => isFiatCurrency(c))
            expect(result.length).toEqual(currencies.length)
        }),
            it('should fail any non-fiat currency', () => {
                const currencies = [CurrencyTypes.BTC, CurrencyTypes.ETH]

                const result = currencies.filter((c) => !isFiatCurrency(c))
                expect(result.length).toEqual(currencies.length)
            })
    })
})
