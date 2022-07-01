import { writable } from 'svelte/store'
import { IPersistedProfile, IProfileSettings } from '@core/profile/interfaces'

export const newProfile = writable<Partial<IPersistedProfile>>(null)

export function updateNewProfile(payload: Partial<IPersistedProfile>): void {
    return newProfile.update((state) => ({ ...state, ...payload }))
}

export function updateNewProfileSettings(payload: Partial<IProfileSettings>): void {
    newProfile?.update((state) => ({
        ...state,
        settings: { ...state?.settings, ...payload },
    }))
}
