import { MOCK_MNEMONIC, ProfileManagerMock } from './__mocks__/profileManager.mock'
import { destroyManager, profileManager, generateMnemonic, setStrongholdPassword, storeMnemonic } from '../wallet'
import { get } from 'svelte/store'
import { mnemonic } from '../app'

describe('File: api.test.ts', () => {
    let profileManagerMock: ProfileManagerMock

    beforeEach(() => {
        profileManagerMock = new ProfileManagerMock()
        profileManager.set(profileManagerMock)
    })

    it('should setup the profile manager correctly', () => {
        expect(profileManager).toBeDefined()
    })

    it('should destroy the profile manager correctly', () => {
        destroyManager('id')
        expect(get(profileManager)).toBeNull()
    })

    describe('Function: generateMnemonic', () => {
        it('should execute generateMnemonic correctly', async () => {
            const spy = jest.spyOn(profileManagerMock, 'generateMnemonic')

            const actual = await generateMnemonic()
            const expected = MOCK_MNEMONIC.split(' ')
            expect(actual).toEqual(expected)

            expect(spy).toHaveBeenCalledTimes(1)

            spy.mockRestore()
        })
    })

    describe('Function: setStrongholdPassword', () => {
        const password = 'password'

        it('should call setStrongholdPassword', async () => {
            const spy = jest.spyOn(profileManagerMock, 'setStrongholdPassword')
            await setStrongholdPassword(password)
            expect(spy).toBeCalledWith(password)
            expect(spy).toBeCalledTimes(1)
        })
    })

    describe('Function: storeMnemonic', () => {
        it('should execute storeMnemonic', async () => {
            const spy = jest.spyOn(profileManagerMock, 'storeMnemonic')
            await storeMnemonic(MOCK_MNEMONIC)
            expect(spy).toBeCalledWith(MOCK_MNEMONIC)
            expect(spy).toBeCalledTimes(1)
        })
    })

    describe('Function: verifyMnemonic', () => {
        it('should call verifyMnemonic', async () => {
            const spy = jest.spyOn(profileManagerMock, 'verifyMnemonic')
            await storeMnemonic(MOCK_MNEMONIC)
            expect(spy).toBeCalledWith(MOCK_MNEMONIC)
            expect(spy).toBeCalledTimes(1)
        })
    })
})
