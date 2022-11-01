import Big from 'big.js'

import { fiatToMiota, miotaToFiat } from '../convert'

describe('File: currency.ts', () => {
    describe('Function: miotaToFiat', () => {
        it('should convert an amount from MIOTAs to fiat (USD)', () => {
            // (10Gi, $1.06/Mi, $1/$1) => $10,600
            const calc = miotaToFiat(Big(10_000_000_000), 1.06, 1.0)
            expect(calc).toEqual(10600.0)
        })
        it('should convert an amount from MIOTAs to fiat (non-USD)', () => {
            // (10Gi, $1.06/Mi, €0,853/$1) => €9041,80
            let calc = miotaToFiat(Big(10_000_000_000), 1.06, 0.853)
            expect(calc).toEqual(9041.8)
        })
    })

    describe('Function: fiatToMiota', () => {
        it('should convert an amount from fiat to MIOTAs (USD)', () => {
            // ($10,000, $1.06/Mi, $1/$1) => 9.4340Gi
            const calc = fiatToMiota(10000.0, 1.06, 1.0)
            expect(calc).toEqual(9_433_962_264)
        })
        it('should convert an amount from fiat to MIOTAs (non-USD)', () => {
            // (€10000, $1.06/Mi, €0,853/$1) => ~11.0598Gi
            const calc = fiatToMiota(10000.0, 1.06, 0.853)
            expect(calc).toEqual(11_059_744_741)
        })
    })
})
