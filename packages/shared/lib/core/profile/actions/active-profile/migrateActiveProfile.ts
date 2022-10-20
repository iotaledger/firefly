import { activeProfile, IPersistedProfile, updateActiveProfile } from '@core/profile'
import { DEFAULT_ACTIVE_PROFILE_VALUE } from '@core/profile/constants/default-active-profile-values.constant'
import { migrateObjects } from '@core/utils'
import { get } from 'svelte/store'

// TODO: Fix this function does not seem to be migrating optional properties, at least on nested objects

/**
 * Migrates profile data in need of being modified to accommodate changes
 * in a newer Firefly version.
 */
export function migrateActiveProfile(): void {
    const _activeProfile = get(activeProfile)
    updateActiveProfile(migrateObjects<IPersistedProfile>(_activeProfile, DEFAULT_ACTIVE_PROFILE_VALUE))
}
