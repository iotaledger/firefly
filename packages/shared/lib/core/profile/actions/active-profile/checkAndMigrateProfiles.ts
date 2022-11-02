import { get } from 'svelte/store'
import { migrateObjects } from '@core/utils/object'

import { DEFAULT_PERSISTED_PROFILE_OBJECT, PROFILE_VERSION } from '../../constants'
import { IPersistedProfile } from '../../interfaces'
import { currentProfileVersion, profiles, saveProfile } from '../../stores'

// TODO: Fix this function does not seem to be migrating optional properties, at least on nested objects

/**
 * Migrates profile data in need of being modified to accommodate changes
 * in a newer Firefly version.
 */

export function checkAndMigrateProfiles(): void {
    const shouldMigratePersistedProfiles = (get(currentProfileVersion) ?? -1) < PROFILE_VERSION
    if (shouldMigratePersistedProfiles) {
        migratePersistedProfiles()
        currentProfileVersion.set(PROFILE_VERSION)
    }
}

export function migratePersistedProfiles(): void {
    const _profiles = get(profiles)
    for (const profile of _profiles) {
        migratePersistedProfile(profile)
    }
}

export function migratePersistedProfile(persistedProfile: IPersistedProfile): void {
    const migratedPersistedProfile = migrateObjects<IPersistedProfile>(
        persistedProfile,
        DEFAULT_PERSISTED_PROFILE_OBJECT
    )
    saveProfile(migratedPersistedProfile)
}
