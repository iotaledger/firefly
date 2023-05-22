import { get, writable } from 'svelte/store'

import type { IAccountPersistedData } from '@core/account/interfaces'

import { INITIAL_ACTIVE_PROFILE } from '../constants'
import type { IProfile, IProfileSettings } from '../interfaces'

export const activeProfile = writable<IProfile>(<IProfile>INITIAL_ACTIVE_PROFILE)

export function getActiveProfile(): IProfile {
    return get(activeProfile)
}

export function updateActiveProfile(payload: Partial<IProfile>): void {
    activeProfile?.update((state) => ({ ...state, ...payload }))
}

export function updateActiveProfileSettings(payload: Partial<IProfileSettings>): void {
    activeProfile?.update((state) => ({
        ...state,
        settings: { ...state?.settings, ...payload },
    }))
}

export function addAccountPersistedDataToActiveProfile(
    accountIndex: number,
    persistedData: IAccountPersistedData
): void {
    activeProfile?.update((state) => {
        if (!state?.accountPersistedData) {
            state.accountPersistedData = {}
        }
        state.accountPersistedData[accountIndex] = persistedData
        return state
    })
}

export function getActiveProfilePersistedAccountData(accountIndex: number): IAccountPersistedData {
    return get(activeProfile)?.accountPersistedData?.[accountIndex] ?? {}
}

export function updateAccountPersistedDataOnActiveProfile(
    accountIndex: number,
    persistedData: Partial<IAccountPersistedData>
): void {
    activeProfile?.update((state) => {
        if (!state?.accountPersistedData) {
            state.accountPersistedData = {}
        }
        state.accountPersistedData[accountIndex] = { ...state?.accountPersistedData?.[accountIndex], ...persistedData }
        return state
    })
}
