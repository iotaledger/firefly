import { parseCurrency } from '../utils'

describe('File: parseCurrency.ts', () => {
    it('should work with normal number and no decimals', () => {
        const amount = '42069'
        const parsedAmount = parseCurrency(amount)
        expect(parsedAmount).toBe(42069)
    })
    it('should work with normal number and decimal amount', () => {
        const amount = '42.069'
        const parsedAmount = parseCurrency(amount)
        expect(parsedAmount).toBe(42.069)
    })
    it('should work with a decimal number without a leading 0', () => {
        const amount = '.00042069'
        const parsedAmount = parseCurrency(amount)
        expect(parsedAmount).toBe(0.00042069)
    })
    it('should work with a decimal number without a leading 0', () => {
        const amount = '.'
        const parsedAmount = parseCurrency(amount)
        expect(parsedAmount).toBe(0)
    })
})
