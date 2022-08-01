import { writable } from 'svelte/store'
import { IPersistedProfile } from '@core/profile/interfaces'

export const onboardingProfile = writable<Partial<IPersistedProfile>>(null)

export function updateOnboardingProfile(payload: Partial<IPersistedProfile>): void {
    return onboardingProfile.update((state) => ({ ...state, ...payload }))
}
