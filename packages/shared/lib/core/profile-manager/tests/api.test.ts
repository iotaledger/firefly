import { AccountMock } from '@mocks/account.mock'
import { MOCK_MNEMONIC, ProfileManagerMock } from '@mocks/profile-manager.mock'

import { get } from 'svelte/store'

import { destroyProfileManager } from '../actions'
import {
    generateMnemonic,
    setStrongholdPassword,
    storeMnemonic,
    verifyMnemonic,
    backup,
    restoreBackup,
    createStardustAccount,
} from '../api'
import { profileManager } from '../stores'

describe('File: api.test.ts', () => {
    let profileManagerMock: ProfileManagerMock
    let spy: jest.SpyInstance

    const password = 'password'

    beforeEach(() => {
        const id = generateRandomId()
        profileManagerMock = new ProfileManagerMock(id)
        profileManager.set(profileManagerMock)
    })

    it('should setup the profile manager correctly', () => {
        expect(profileManager).toBeDefined()
    })

    it('should destroy the profile manager correctly', () => {
        destroyProfileManager()
        expect(get(profileManager)).toBeNull()
    })

    describe('Function: generateMnemonic', () => {
        it('should execute generateMnemonic correctly', async () => {
            spy = jest.spyOn(profileManagerMock, 'generateMnemonic')
            const actual = await generateMnemonic()
            expect(actual).toEqual(MOCK_MNEMONIC)
            expect(spy).toHaveBeenCalledTimes(1)
            spy.mockRestore()
        })
    })

    describe('Function: setStrongholdPassword', () => {
        it('should call setStrongholdPassword', async () => {
            spy = jest.spyOn(profileManagerMock, 'setStrongholdPassword')
            await setStrongholdPassword(password)
            expect(spy).toBeCalledWith(password)
            expect(spy).toBeCalledTimes(1)
            spy.mockRestore()
        })
    })

    describe('Function: storeMnemonic', () => {
        it('should execute storeMnemonic', async () => {
            spy = jest.spyOn(profileManagerMock, 'storeMnemonic')
            await storeMnemonic(MOCK_MNEMONIC)
            expect(spy).toBeCalledWith(MOCK_MNEMONIC)
            expect(spy).toBeCalledTimes(1)
            spy.mockRestore()
        })
    })

    describe('Function: verifyMnemonic', () => {
        it('should call verifyMnemonic', async () => {
            spy = jest.spyOn(profileManagerMock, 'verifyMnemonic')
            await verifyMnemonic(MOCK_MNEMONIC)
            expect(spy).toBeCalledWith(MOCK_MNEMONIC)
            expect(spy).toBeCalledTimes(1)
            spy.mockRestore()
        })
    })

    describe('Function: backup', () => {
        it('should call backup', async () => {
            spy = jest.spyOn(profileManagerMock, 'backup')
            const destination = './destination'
            await backup(destination, password)
            expect(spy).toBeCalledWith(destination, password)
            expect(spy).toBeCalledTimes(1)
            spy.mockRestore()
        })
    })

    describe('Function: restoreBackup', () => {
        it('should call restoreBackup', async () => {
            spy = jest.spyOn(profileManagerMock, 'restoreBackup')
            const importFilePath = './backup.stronghold'
            await restoreBackup(importFilePath, password)
            expect(spy).toBeCalledWith(importFilePath, password)
            expect(spy).toBeCalledTimes(1)
            spy.mockRestore()
        })
    })

    describe('Function: createStardustAccount', () => {
        it('should call createStardustAccount', async () => {
            spy = jest.spyOn(profileManagerMock, 'createAccount')
            const payload = { alias: 'alias', coinType: 4219 }
            const account = await createStardustAccount(payload)
            expect(account).toEqual(new AccountMock())
            expect(spy).toBeCalledTimes(1)
            expect(spy).toBeCalledWith(payload)
        })
    })
})
