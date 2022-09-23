import { addNewProfile, loadPersistedProfileIntoActiveProfile } from '@core/profile'
import { get } from 'svelte/store'
import { convertOnboardingProfileToPersistedProfile } from '../helpers'
import { onboardingProfile } from '../stores'

export function createNewProfileFromOnboardingProfile(): void {
    const _onboardingProfile = get(onboardingProfile)
    const newProfile = convertOnboardingProfileToPersistedProfile(_onboardingProfile)
    addNewProfile(newProfile)
    loadPersistedProfileIntoActiveProfile(_onboardingProfile?.id)
}
