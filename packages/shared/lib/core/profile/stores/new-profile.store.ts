import { writable } from 'svelte/store'
import { IPersistedProfile } from '../interfaces'

export const newProfile = writable<IPersistedProfile>(null)

export function updateNewProfile(payload: Partial<IPersistedProfile>): void {
    return newProfile.update((state) => ({ ...state, ...payload }))
}
