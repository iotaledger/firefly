import { convertChrysalisDeepLinkToStardust } from '../handlers/chrysalisDeepLink'

const APP_PROTOCOL = 'iota'

describe('File: chrysalisDeepLink.ts', () => {
    describe('Function: parseWalletDeepLinkRequest', () => {
        it('should return the stardust equivalent URL of a SEND chrysalis deeplink', () => {
            const chrysalisUrl = new URL(
                'iota://wallet/send/iota1qqcts4pndmjzan0jyqjvqyk0qejmsksr3n2cw6pxuy87lmm47gne5ph6fna?amount=1'
            )
            const expectedStardustUrl = new URL(
                'iota://wallet/sendForm?address=iota1qqcts4pndmjzan0jyqjvqyk0qejmsksr3n2cw6pxuy87lmm47gne5ph6fna&amount=1'
            )
            const stardustUrl = convertChrysalisDeepLinkToStardust(chrysalisUrl, APP_PROTOCOL)

            expect(stardustUrl.toString()).toEqual(expectedStardustUrl.toString())
        })

        it('should throw an context error ', () => {
            const chrysalisUrl = new URL('iota://typescript/send/')

            expect(() => convertChrysalisDeepLinkToStardust(chrysalisUrl, APP_PROTOCOL)).toThrow(
                `Unrecognized wallet context 'typescript'`
            )
        })

        it('should throw an operation error ', () => {
            const chrysalisUrl = new URL('iota://wallet/rust/')

            expect(() => convertChrysalisDeepLinkToStardust(chrysalisUrl, APP_PROTOCOL)).toThrow(
                `Unrecognized wallet operation 'rust'`
            )
        })

        it('should throw a missing address error ', () => {
            const chrysalisUrl = new URL('iota://wallet/send/')

            expect(() => convertChrysalisDeepLinkToStardust(chrysalisUrl, APP_PROTOCOL)).toThrow(
                `No address specified in the url path`
            )
        })

        it('should throw a wrong amount error ', () => {
            const chrysalisUrl = new URL(
                'iota://wallet/send/iota1qqcts4pndmjzan0jyqjvqyk0qejmsksr3n2cw6pxuy87lmm47gne5ph6fna?amount=rust'
            )

            expect(() => convertChrysalisDeepLinkToStardust(chrysalisUrl, APP_PROTOCOL)).toThrow(
                `Amount is not a number 'rust'`
            )
        })
    })
})
