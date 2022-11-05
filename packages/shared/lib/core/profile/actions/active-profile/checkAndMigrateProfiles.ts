import { get } from 'svelte/store'
import { PROFILE_VERSION } from '../../constants'
import { IPersistedProfile } from '../../interfaces'
import { currentProfileVersion, profiles, saveProfile } from '../../stores'

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

function migratePersistedProfiles(): void {
    const _profiles = get(profiles)
    for (const profile of _profiles) {
        migratePersistedProfile(profile)
    }
}

function migratePersistedProfile(persistedProfile: IPersistedProfile): void {
    let migratedPersistedProfile = persistedProfile
    let migrationVersion = get(currentProfileVersion)
    for (migrationVersion; migrationVersion < PROFILE_VERSION; migrationVersion++) {
        migratedPersistedProfile =
            persistedProfileMigrationsMap?.[migrationVersion]?.(migratedPersistedProfile) ?? migratedPersistedProfile
    }
    saveProfile(migratedPersistedProfile)
}

const persistedProfileMigrationsMap: Record<number, (existingProfile: unknown) => IPersistedProfile> = {
    /**
     * NOTE: 0-2 are missing here because we wrote this functionality,
     * when the profile version was already 3.
     */
    3: persistedProfileMigrationToV4,
}

function persistedProfileMigrationToV4(existingProfile: unknown): IPersistedProfile {
    const newProfile = {}

    const keysToKeep = [
        'id',
        'name',
        'type',
        'networkProtocol',
        'networkType',
        'lastStrongholdBackupTime',
        'settings',
        'accountMetadata',
        'isDeveloperProfile',
        'hasVisitedDashboard',
        'lastUsedAccountIndex',
        'clientOptions',
    ]

    keysToKeep.forEach((key) => {
        const existingValue = existingProfile?.[key]
        if (existingValue !== undefined) {
            newProfile[key] = existingValue
        }
    })

    return newProfile as IPersistedProfile
}
