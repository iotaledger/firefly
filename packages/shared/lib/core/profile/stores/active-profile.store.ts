import { get, writable } from 'svelte/store'

import type { IAccountMetadata } from '@core/account/interfaces'

import { INITIAL_ACTIVE_PROFILE } from '../constants'
import type { IProfile, IProfileSettings } from '../interfaces'

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

export function addAccountMetadataToActiveProfile(metadata: IAccountMetadata): void {
    activeProfile?.update((state) => ({
        ...state,
        accountMetadata: [...state?.accountMetadata, metadata],
    }))
}

export function getAccountMetadataByIndex(index: number): IAccountMetadata {
    const { accountMetadata } = get(activeProfile)
    return accountMetadata.find((metadata) => metadata.index === index)
}

export function updateAccountMetadataOnActiveProfile(index: number, metadata: Partial<IAccountMetadata>): void {
    activeProfile?.update((state) => ({
        ...state,
        accountMetadata: state?.accountMetadata.map((existingValue) =>
            existingValue.index === index ? { ...existingValue, ...metadata } : existingValue
        ),
    }))
}
