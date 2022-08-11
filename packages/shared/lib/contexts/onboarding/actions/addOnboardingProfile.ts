import { get } from 'svelte/store'

import { addNewProfile, loadPersistedProfileIntoActiveProfile } from '@core/profile'

import { convertOnboardingProfileToPersistedProfile } from '../helpers'
import { onboardingProfile } from '../stores'

export function addOnboardingProfile(): void {
    const _onboardingProfile = get(onboardingProfile)
    const newProfile = convertOnboardingProfileToPersistedProfile(_onboardingProfile)
    addNewProfile(newProfile)
    loadPersistedProfileIntoActiveProfile(_onboardingProfile?.id)
}
