import { ITokenMetadata } from '../interfaces'
import { formatTokenAmountDefault } from '../utils'
import { appSettings } from '@core/app'

describe('File: formatTokenAmountDefault.ts', () => {
    let decimalToken: ITokenMetadata

    beforeEach(() => {
        decimalToken = {
            name: 'Hoi',
            unit: 'SMR',
            decimals: 0,
        }
        appSettings.update((state) => ({ ...state, language: 'en' }))
    })

    it('should work if number is 0 and token contains decimals', () => {
        const amount = 0
        decimalToken.decimals = 8
        const formattedAmount = formatTokenAmountDefault(amount, decimalToken)
        expect(formattedAmount).toBe('0')
    })
    it('should work if number is 0 and token contains no decimals', () => {
        const amount = 0
        const formattedAmount = formatTokenAmountDefault(amount, decimalToken)
        expect(formattedAmount).toBe('0')
    })
    it('should throw an error if amount is not an integer', () => {
        const amount = 42.069
        expect(() => formatTokenAmountDefault(amount, decimalToken)).toThrow()
    })
    it('should throw an error if amount is negative', () => {
        const amount = -42069
        expect(() => formatTokenAmountDefault(amount, decimalToken)).toThrow()
    })
    it('should add correct decimal character for german', () => {
        appSettings.update((state) => ({ ...state, language: 'de' }))
        const amount = 42069
        decimalToken.decimals = 3
        const formattedAmount = formatTokenAmountDefault(amount, decimalToken)
        expect(formattedAmount).toBe('42,069')
    })
    it('should work with normal number and no decimals', () => {
        const amount = 42069
        const formattedAmount = formatTokenAmountDefault(amount, decimalToken)
        expect(formattedAmount).toBe('42,069')
    })
    it('should work with normal number and small decimal amount', () => {
        const amount = 42069
        decimalToken.decimals = 3
        const formattedAmount = formatTokenAmountDefault(amount, decimalToken)
        expect(formattedAmount).toBe('42.069')
    })
    it('should work with normal number and normal decimal amount', () => {
        const amount = 42069
        decimalToken.decimals = 8
        const formattedAmount = formatTokenAmountDefault(amount, decimalToken)
        expect(formattedAmount).toBe('0.00042069')
    })
    it('should work with normal number and big decimal amount', () => {
        const amount = 42069
        decimalToken.decimals = 20
        const formattedAmount = formatTokenAmountDefault(amount, decimalToken)
        expect(formattedAmount).toBe('0')
    })
    it('should work with big number and no decimals', () => {})
    it('should work with big number and normal decimal amount', () => {})
    it('should work with big number and big decimal amount', () => {})
})
