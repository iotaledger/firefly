import { get, writable } from 'svelte/store'
import { IPersistedWalletData } from '@core/wallet/interfaces'

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

export function addWalletPersistedDataToActiveProfile(
    walletId: string,
    walletPersistedData: IPersistedWalletData
): void {
    activeProfile?.update((state) => {
        if (!state?.walletPersistedData) {
            state.walletPersistedData = {}
        }
        state.walletPersistedData[walletId] = walletPersistedData
        return state
    })
}

export function getActiveProfilePersistedWalletData(walletId: string): IPersistedWalletData | undefined {
    return get(activeProfile)?.walletPersistedData?.[walletId]
}

export function updateWalletPersistedDataOnActiveProfile(
    walletId: string,
    partialWalletPersistedData: Partial<IPersistedWalletData>
): void {
    activeProfile?.update((state) => {
        if (!state?.walletPersistedData) {
            state.walletPersistedData = {}
        }
        state.walletPersistedData[walletId] = {
            ...state?.walletPersistedData?.[walletId],
            ...partialWalletPersistedData,
        }
        return state
    })
}
