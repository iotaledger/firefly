import { activeProfile, IPersistedProfile, updateActiveProfile } from '@core/profile'
import { buildNewProfile } from '@core/profile/helpers'
import { migrateObjects } from '@lib/utils'
import { get } from 'svelte/store'

// TODO: Fix this function does not seem to be migrating optional properties, at least on nested objects

/**
 * Migrates profile data in need of being modified to accommodate changes
 * in a newer Firefly version.
 */
export function migrateActiveProfile(): void {
    const _activeProfile = get(activeProfile)
    const newProfileDefaults = buildNewProfile(
        _activeProfile?.isDeveloperProfile,
        _activeProfile?.networkProtocol,
        _activeProfile?.networkType,
        _activeProfile?.settings.clientOptions
    )
    updateActiveProfile(migrateObjects<IPersistedProfile>(_activeProfile, newProfileDefaults))
}
