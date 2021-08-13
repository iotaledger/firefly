import { convertToFiat } from '../currency'

describe('File: currency.ts', () => {
    describe('Function: convertToFiat', () => {
        it('should convert USD fiat values', () => {
            // (10Gi, $1.06/Mi, 1 USD / USD) => $10,600
            let calc = convertToFiat(10_000_000_000, 1.06, 1.00)
            expect(calc).toEqual(10600.00)
        })
        it('should convert non-USD fiat values', () => {
            // (10Gi, $1.06/Mi, 1 USD / USD) => $10,600
            let calc = convertToFiat(10_000_000_000, 1.06, 0.8528784648)
            expect(calc).toEqual(9040.51)
        })
    })
})
