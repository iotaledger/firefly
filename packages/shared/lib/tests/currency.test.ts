import { AvailableExchangeRates, convertFromFiat, convertToFiat, CurrencyTypes, isFiatCurrency } from '../currency'

describe('File: currency.ts', () => {
    describe('Function: convertToFiat', () => {
        it('should convert an amount from IOTAs to fiat (USD)', () => {
            // (10Gi, $1.06/Mi, $1/$1) => $10,600
            let calc = convertToFiat(10_000_000_000, 1.06, 1.00)
            expect(calc).toEqual(10600.00)
        })
        it('should convert an amount from IOTAs to fiat (non-USD)', () => {
            // (10Gi, $1.06/Mi, €0,853/$1) => €9041,80
            let calc = convertToFiat(10_000_000_000, 1.06, 0.853)
            expect(calc).toEqual(9041.80)
        })
    })

    describe('Function: convertFromFiat', () => {
        it('should convert an amount from fiat to IOTAs (USD)', () => {
            // ($10,000, $1.06/Mi, $1/$1) => 9.4340Gi
            let calc = convertFromFiat(10000.00, 1.06, 1.00)
            expect(calc).toEqual(9_433_962_264)
        })
        it('should convert an amount from fiat to IOTAs (non-USD)', () => {
            // (€10000, $1.06/Mi, €0,853/$1) => ~11.0598Gi
            let calc = convertFromFiat(10000.00, 1.06, 0.853)
            expect(calc).toEqual(11_059_744_741)
        })
    })

    describe('Function: isFiatCurrency', () => {
        it('should pass any fiat currency', () => {
            let currencies = [
                AvailableExchangeRates.USD,
                AvailableExchangeRates.EUR,
                AvailableExchangeRates.JPY,
            ]

            let result = currencies.filter(c => isFiatCurrency(c))
            expect(result.length).toEqual(currencies.length)
        }),

        it('should fail any non-fiat currency', () => {
            let currencies = [
                CurrencyTypes.BTC,
                CurrencyTypes.ETH,
            ]

            let result = currencies.filter(c => !isFiatCurrency(c))
            expect(result.length).toEqual(currencies.length)
        })
    })
})
