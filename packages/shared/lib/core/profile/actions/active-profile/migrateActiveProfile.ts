import { activeProfile, IPersistedProfile, updateActiveProfile } from '@core/profile'
import { buildNewProfile } from '@core/profile/helpers'
import { migrateObjects } from '@lib/utils'
import { get } from 'svelte/store'

/**
 * Migrates profile data in need of being modified to accommodate changes
 * in a newer Firefly version.
 * @method migrateActiveProfile
 * @returns {void}
 */
export function migrateActiveProfile(): void {
    const _activeProfile = get(activeProfile)
    const newProfileDefaults = buildNewProfile(
        _activeProfile?.name,
        _activeProfile?.isDeveloperProfile,
        _activeProfile?.networkProtocol,
        _activeProfile?.networkType
    )

    updateActiveProfile(migrateObjects<IPersistedProfile>(_activeProfile, newProfileDefaults))
}
