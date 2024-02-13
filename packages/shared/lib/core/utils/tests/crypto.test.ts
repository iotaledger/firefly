import '@mocks/i18n.mock'

import { validateBech32Address } from '../crypto/utils/validateBech32Address'

describe('Module: crypto', () => {
    describe('Function: validateBech32Address', () => {
        it('should return error string if address is empty', () => {
            expect(() =>
                validateBech32Address('atoi', 'iota1qqf446qvry56672nefltyac6xw54k5eww43hr9lpdv03x9403uaewd807lx')
            ).toThrowError('Addresses start with the prefix atoi.')
        })
        it('should return error string if address is in wrong format', () => {
            expect(() =>
                validateBech32Address('iota', 'iota2qqf446qvry56672nefltyac6xw54k5eww43hr9lpdv03x9403uaewd807lx')
            ).toThrowError('The address is not correctly formatted.')
        })
        xit('should return error string if address cannot be decoded', () => {
            expect(() =>
                validateBech32Address('iota', 'iota1qqf446qvry56772nefltyac6xw54k5eww43hr9lpdv03x9403uaewd807lx')
            ).toThrowError('The address is not valid.')
        })
        xit('should return undefined if address is valid', () => {
            expect(() =>
                validateBech32Address('iota', 'iota1qqf446qvry56672nefltyac6xw54k5eww43hr9lpdv03x9403uaewd807lx')
            ).not.toThrow()
        })
    })
})
