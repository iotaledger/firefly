import '@mocks/crypto.mock'
import { ProfileManagerMock } from '@mocks/profile-manager.mock'
import { MOCK_MNEMONIC } from '@mocks/api.mock'

import { get } from 'svelte/store'

import { generateRandomId } from '../../utils'

import { clearProfileFromMemory } from '../actions'
import { generateMnemonic, setStrongholdPassword, storeMnemonic, verifyMnemonic, backup, restoreBackup } from '../api'
import { profileManager } from '../stores'
import { IApi } from '../interfaces'

// TODO(2.0): fix all these tests
describe('File: api.test.ts', () => {
    let profileManagerMock: ProfileManagerMock
    let spy: jest.SpyInstance
    const api: IApi = window['__WALLET__API__']

    const password = 'password'

    beforeEach(() => {
        const id = generateRandomId()
        profileManagerMock = new ProfileManagerMock(id)
        profileManager.set(profileManagerMock)
    })

    it('should setup the profile manager correctly', () => {
        expect(profileManager).toBeDefined()
    })

    it('should destroy the profile manager correctly', async () => {
        await clearProfileFromMemory()
        expect(get(profileManager)).toBeNull()
    })

    describe('Function: generateMnemonic', () => {
        it('should execute generateMnemonic correctly', async () => {
            spy = jest.spyOn(api, 'generateMnemonic')
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
            spy = jest.spyOn(api, 'verifyMnemonic')
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
            await restoreBackup(importFilePath, password, 'rms')
            expect(spy).toBeCalledWith(importFilePath, password, true, 'rms')
            expect(spy).toBeCalledTimes(1)
            spy.mockRestore()
        })
    })
})
