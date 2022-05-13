import { derived, Readable } from 'svelte/store'
import { ProfileType } from '../enums'
import { activeProfile } from './active-profile.store'

export const isSoftwareProfile: Readable<boolean> = derived(
    activeProfile,
    ($activeProfile) => $activeProfile?.type === ProfileType.Software
)
