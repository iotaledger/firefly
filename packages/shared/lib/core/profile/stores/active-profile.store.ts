import { get, writable } from 'svelte/store'

import type { IPersistedAccountData } from '@core/account/interfaces'
import { IEvmAddresses } from '@core/network/interfaces'

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
    accountPersistedData: IPersistedAccountData
): void {
    activeProfile?.update((state) => {
        if (!state?.accountPersistedData) {
            state.accountPersistedData = {}
        }
        state.accountPersistedData[accountIndex] = accountPersistedData
        return state
    })
}

export function getActiveProfilePersistedAccountData(accountIndex: number): IPersistedAccountData | undefined {
    return get(activeProfile)?.accountPersistedData?.[accountIndex]
}

export function updateAccountPersistedDataOnActiveProfile(
    accountIndex: number,
    partialAccountPersistedData: Partial<IPersistedAccountData>
): void {
    activeProfile?.update((state) => {
        if (!state?.accountPersistedData) {
            state.accountPersistedData = {}
        }
        state.accountPersistedData[accountIndex] = {
            ...state?.accountPersistedData?.[accountIndex],
            ...partialAccountPersistedData,
        }
        return state
    })
}

export function addEvmAddressToActiveProfileAccount(cointype: number, evmAddress: string, accountIndex: number): void {
    activeProfile?.update((state) => {
        const accountPersistedData = state.accountPersistedData ?? {}
        if (!accountPersistedData) {
            return state
        }

        const accountPersistedDataForAccountIndex = accountPersistedData[accountIndex]
        if (!accountPersistedDataForAccountIndex) {
            return state
        }

        const evmAddresses = accountPersistedDataForAccountIndex.evmAddresses ?? {}

        evmAddresses[cointype] = evmAddress
        accountPersistedDataForAccountIndex.evmAddresses = evmAddresses
        accountPersistedData[accountIndex] = accountPersistedDataForAccountIndex
        state.accountPersistedData = accountPersistedData

        return state
    })
}

export function getActiveProfileEvmAddressesByAccountIndex(accountIndex: number): IEvmAddresses {
    const accountPersistedData = getActiveProfilePersistedAccountData(accountIndex)
    return accountPersistedData?.evmAddresses ?? {}
}
