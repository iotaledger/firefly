import ProfileManagerMock from './__mocks__/profileManager.mock'
import { profileManager, requestMnemonic } from '../wallet'

describe('Stardust API', () => {
    beforeEach(() => {
        profileManager.set(new ProfileManagerMock())
    })

    it('Request mnemonic of manager returns list', async () => {
        const mnemonic = await requestMnemonic()
        expect(mnemonic).toEqual(['test', 'mnemonic', 'string'])
    })
})
