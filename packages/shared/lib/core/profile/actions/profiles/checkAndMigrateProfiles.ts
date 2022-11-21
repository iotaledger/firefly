import { get } from 'svelte/store'
import { DEFAULT_PERSISTED_PROFILE_OBJECT, PROFILE_VERSION } from '../../constants'
import { IPersistedProfile } from '../../interfaces'
import { currentProfileVersion, profiles, saveProfile } from '../../stores'

/**
 * Migrates profile data in need of being modified to accommodate changes
 * in a newer Firefly version.
 */

export function checkAndMigrateProfiles(): void {
    const shouldMigratePersistedProfiles = (get(currentProfileVersion) ?? 3) < PROFILE_VERSION
    if (shouldMigratePersistedProfiles) {
        migrateEachVersion()
    }
}

function migrateEachVersion(): void {
    let migrationVersion = get(currentProfileVersion)
    for (migrationVersion; migrationVersion < PROFILE_VERSION; migrationVersion++) {
        migratePersistedProfile(migrationVersion)
        currentProfileVersion.set(migrationVersion + 1)
    }
}

function migratePersistedProfile(migrationVersion): void {
    const _profiles = get(profiles)
    for (const profile of _profiles) {
        persistedProfileMigrationsMap?.[migrationVersion]?.(profile)
    }
}

const persistedProfileMigrationsMap: Record<number, (existingProfile: unknown) => void> = {
    /**
     * NOTE: 0-2 are missing here because we wrote this functionality,
     * when the profile version was already 3.
     */
    3: persistedProfileMigrationToV4,
    4: persistedProfileMigrationToV5,
    5: persistedAssetsMigrationToV6,
}

function persistedProfileMigrationToV4(existingProfile: unknown): void {
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
        newProfile[key] = existingValue
    })

    saveProfile(newProfile as IPersistedProfile)
}

function persistedProfileMigrationToV5(existingProfile: unknown): void {
    interface IOldPersistedProfile {
        settings: {
            currency: unknown
        }
    }

    const oldProfile = existingProfile as IOldPersistedProfile
    delete oldProfile?.settings?.currency

    const newProfile = oldProfile as unknown as IPersistedProfile
    newProfile.settings.marketCurrency = DEFAULT_PERSISTED_PROFILE_OBJECT.settings?.marketCurrency

    saveProfile(newProfile)
}

function persistedAssetsMigrationToV6(existingProfile: IPersistedProfile): void {
    existingProfile.forceAssetRefresh = true
    saveProfile(existingProfile)
}
