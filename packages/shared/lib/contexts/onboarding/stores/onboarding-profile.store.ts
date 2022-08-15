import { writable } from 'svelte/store'

import { IOnboardingProfile } from '../interfaces'

export const onboardingProfile = writable<Partial<IOnboardingProfile>>(null)

export function updateOnboardingProfile(payload: Partial<IOnboardingProfile>): void {
    return onboardingProfile.update((state) => ({ ...state, ...payload }))
}
