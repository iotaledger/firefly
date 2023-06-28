import { buildBip32Path } from '../utils/buildBip32Path'

describe('File: buildBip32Path.ts', () => {
    it('should correctly give BIP32 path', () => {
        const coinType = 60
        const accountIndex = 1
        const bip32Path = buildBip32Path(coinType, accountIndex)
        const expectedBip32Path = "44'/60'/1'/0/0"

        expect(expectedBip32Path).toStrictEqual(bip32Path)
    })
})
