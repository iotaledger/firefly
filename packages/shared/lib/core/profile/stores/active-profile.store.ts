import { IAccountMetadata, IAccountState } from '@core/account'
import { get, writable } from 'svelte/store'
import { IProfile, IProfileSettings } from '../interfaces'
import { INITIAL_ACTIVE_PROFILE } from '../constants'

export const activeProfile = writable<IProfile>(<IProfile>INITIAL_ACTIVE_PROFILE)

export function updateActiveProfile(payload: Partial<IProfile>): void {
    activeProfile?.update((state) => ({ ...state, ...payload }))
}

export function updateActiveProfileSettings(payload: Partial<IProfileSettings>): void {
    activeProfile?.update((state) => ({
        ...state,
        settings: { ...state?.settings, ...payload },
    }))
}

export function addAccountToActiveProfile(account: IAccountState): void {
    const { accounts } = get(activeProfile)
    accounts?.update((state) => [...state, account])
}

export function addAccountMetadataToActiveProfile(metadata: IAccountMetadata): void {
    activeProfile?.update((state) => ({
        ...state,
        accountMetadatas: [...state?.accountMetadatas, metadata],
    }))
}

export function getAccountMetadatById(id: string): IAccountMetadata {
    const { accountMetadatas } = get(activeProfile)
    return accountMetadatas.find((metadata) => metadata.id === id)
}

export function updateAccountMetadataOnActiveProfile(id: string, metadata: Partial<IAccountMetadata>): void {
    activeProfile?.update((state) => ({
        ...state,
        accountMetadatas: state?.accountMetadatas.map((existingValue) =>
            existingValue.id === id ? { ...existingValue, ...metadata } : existingValue
        ),
    }))
    const { accounts } = get(activeProfile)
    accounts.update((state) => [...state.map((account) => (account.id === id ? { ...account, ...metadata } : account))])
}
