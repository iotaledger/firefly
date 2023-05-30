import { deconstructBip32Path } from '../utils/deconstructBip32Path'

describe('File: deconstructBip32Path.ts', () => {
    it('should throw error if path not long enough', () => {
        expect(() => {
            deconstructBip32Path(`44'/60'`)
        }).toThrow()
    })

    it('should correctly give BIP32 path', () => {
        const bip32Path = deconstructBip32Path(`44/60'/0/1/2`)
        const expectedBip32Path = {
            coinType: 60,
            accountIndex: 0,
            change: 1,
            addressIndex: 2,
        }

        expect(expectedBip32Path).toStrictEqual(bip32Path)
    })
})
