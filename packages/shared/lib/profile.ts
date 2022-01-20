import { persistent } from 'shared/lib/helpers'
import { ledgerSimulator } from 'shared/lib/ledger'
import { generateRandomId, migrateObjects } from 'shared/lib/utils'
import { asyncRemoveStorage, destroyActor, getStoragePath, getWalletStoragePath } from 'shared/lib/wallet'
import { derived, get, Readable, writable } from 'svelte/store'
import { Electron } from './electron'
import type { ValuesOf } from './typings/utils'
import type { Profile, UserSettings } from './typings/profile'
import { ProfileType } from './typings/profile'
import { HistoryDataProps } from './typings/market'
import { AvailableExchangeRates } from './typings/currency'
import type { WalletAccount } from './typings/wallet'
import { getOfficialNetworkConfig } from './network'
import { NetworkConfig, NetworkType } from './typings/network'

export const activeProfileId = persistent<string | null>('activeProfileId', null)

export const profiles = persistent<Profile[]>('profiles', [])

export const profileInProgress = persistent<string | undefined>('profileInProgress', undefined)

export const newProfile = writable<Profile | null>(null)

export const isStrongholdLocked = writable<boolean>(true)

/**
 * Currently active profile
 */
export const activeProfile: Readable<Profile | undefined> = derived(
    [profiles, newProfile, activeProfileId],
    ([$profiles, $newProfile, $activeProfileId]) =>
        $newProfile || $profiles.find((_profile) => _profile.id === $activeProfileId)
)

activeProfileId.subscribe((profileId) => {
    Electron?.updateActiveProfile(profileId)
})

export const isSoftwareProfile: Readable<boolean> = derived(
    activeProfile,
    ($activeProfile) => $activeProfile?.type === ProfileType.Software
)

export const isLedgerProfile: Readable<boolean> = derived(
    activeProfile,
    ($activeProfile) =>
        $activeProfile?.type === ProfileType.Ledger || $activeProfile?.type === ProfileType.LedgerSimulator
)

/**
 * Saves profile in persistent storage
 *
 * @method saveProfile
 *
 * @param {Profile} profile
 *
 * @returns {Profile}
 */
export const saveProfile = (profile: Profile): Profile => {
    profiles.update((_profiles) => [..._profiles, profile])

    return profile
}

/**
 * Build a default profile object given a name and developer status.
 *
 * @method buildProfile
 *
 * @param {string} profileName
 * @param {boolean} isDeveloperProfile
 *
 * @returns {Profile}
 */
const buildProfile = (profileName: string, isDeveloperProfile: boolean): Profile => ({
    id: generateRandomId(),
    name: profileName,
    type: null,
    lastStrongholdBackupTime: null,
    isDeveloperProfile,
    settings: {
        currency: AvailableExchangeRates.USD,
        networkConfig: getOfficialNetworkConfig(
            isDeveloperProfile ? NetworkType.ChrysalisDevnet : NetworkType.ChrysalisMainnet
        ),
        lockScreenTimeout: 5,
        chartSelectors: {
            currency: AvailableExchangeRates.USD,
            timeframe: HistoryDataProps.SEVEN_DAYS,
        },
    },
    ledgerMigrationCount: 0,
})

/**
 * Builds a new profile and sets Svelte store variables accordingly.
 *
 * @method createProfile
 *
 * @param {string} profileName
 * @param {boolean} isDeveloperProfile
 *
 * @returns {Profile}
 */
export const createProfile = (profileName: string, isDeveloperProfile: boolean): Profile => {
    const profile = buildProfile(profileName, isDeveloperProfile)

    newProfile.set(profile)
    activeProfileId.set(profile.id)

    return profile
}

/**
 * Migrates profile data in need of being modified to accommodate changes
 * in a newer Firefly version.
 *
 * @method migrateProfile
 *
 * @returns {void}
 */
export const migrateProfile = (): void => {
    const oldProfile = get(activeProfile)
    const newProfile = buildProfile(oldProfile.name, oldProfile.isDeveloperProfile)

    updateProfile('', migrateObjects<Profile>(oldProfile, newProfile))
}

/**
 * Disposes a new profile
 *
 * @method disposeNewProfile
 *
 * @returns {void}
 */
export const disposeNewProfile = async (): Promise<void> => {
    const _newProfile = get(newProfile)
    if (_newProfile) {
        try {
            await asyncRemoveStorage()
            await removeProfileFolder(_newProfile.name)
        } catch (err) {
            console.error(err)
        }
        destroyActor(_newProfile.id)
    }

    newProfile.set(null)
    activeProfileId.set(null)
}

/**
 * Sets profile with provided id as active
 *
 * @method setActiveProfile
 *
 * @param {string} id
 *
 * @returns {void}
 */
export const setActiveProfile = (id: string): void => {
    activeProfileId.set(id)
}

/**
 * Clears the active profile
 *
 * @method clearActiveProfile
 *
 * @returns {void}
 */
export const clearActiveProfile = (): void => {
    activeProfileId.set(null)
}

/**
 * Removes profile from storage
 *
 * @method removeProfile
 *
 * @param {string} id
 *
 * @returns {void}
 */
export const removeProfile = (id: string): void => {
    profiles.update((_profiles) => _profiles.filter((_profile) => _profile.id !== id))
}

/**
 * Updates a profile property
 *
 * @method UpdateProfile
 *
 * @param {string} id
 *
 * @returns {void}
 */
export const updateProfile = (
    path: string,
    value: ValuesOf<Profile> | ValuesOf<UserSettings> | ValuesOf<NetworkConfig>
): void => {
    const _update = (_profile) => {
        if (path === '') {
            const isValidData =
                /* eslint-disable no-prototype-builtins */
                typeof value === 'object' && Object.keys(value).filter((k) => !_profile.hasOwnProperty(k)).length === 0
            /* eslint-disable @typescript-eslint/ban-types */
            return isValidData ? { ..._profile, ...(value as object) } : _profile
        }

        const pathList = path.split('.')

        pathList.reduce((a, b: keyof Profile | keyof UserSettings, level: number) => {
            if (level === pathList.length - 1) {
                a[b] = value
                return value
            }
            return a[b]
        }, _profile)

        return _profile
    }

    if (get(newProfile)) {
        newProfile.update((_profile) => _update(_profile))
    } else {
        profiles.update((_profiles) =>
            _profiles.map((_profile) => {
                if (_profile.id === get(activeProfile)?.id) {
                    return _update(_profile)
                }

                return _profile
            })
        )
    }
}

/**
 * Cleanup any in progress profiles
 *
 * @method cleanupInProgressProfiles
 *
 * @returns {void}
 */
export const cleanupInProgressProfiles = (): void => {
    const inProgressProfile = get(profileInProgress)
    if (inProgressProfile) {
        profileInProgress.update(() => undefined)
    }
}

/**
 * Remove the profile folder from storage
 *
 * @method removeProfileFolder
 *
 * @returns {void}
 */
export const removeProfileFolder = async (profileName: string): Promise<void> => {
    try {
        const userDataPath = await Electron.getUserDataPath()
        const profileStoragePath = getStoragePath(userDataPath, profileName)
        await Electron.removeProfileFolder(profileStoragePath)
    } catch (err) {
        console.error(err)
    }
}

/**
 * Cleanup profile listed that have nothing stored and stored profiles not in app.
 *
 * @method cleanupEmptyProfiles
 *
 * @returns {void}
 */
export const cleanupEmptyProfiles = async (): Promise<void> => {
    try {
        const userDataPath = await Electron.getUserDataPath()
        const profileStoragePath = getWalletStoragePath(userDataPath)
        const storedProfiles = await Electron.listProfileFolders(profileStoragePath)

        profiles.update((_profiles) => _profiles.filter((p) => storedProfiles.includes(p.name)))

        const appProfiles = get(profiles).map((p) => p.name)
        for (const storedProfile of storedProfiles) {
            if (!appProfiles.includes(storedProfile)) {
                await removeProfileFolder(storedProfile)
            }
        }
    } catch (err) {
        console.error(err)
    }
}

/**
 * Set profile type if missing (for back compatibility purposes)
 *
 * @method setProfileType
 *
 * @param {ProfileType} type
 *
 * @returns {void}
 */
export const setProfileType = (type: ProfileType): void => {
    const isLedgerSimulator = ledgerSimulator && type === ProfileType.Ledger
    updateProfile('type', isLedgerSimulator ? ProfileType.LedgerSimulator : type)
}

/**
 * Set profile type for back compatibility purposes
 *
 * @method setMissingProfileType
 *
 * @param {WalletAccount[]} accounts
 *
 * @returns {void}
 */
export const setMissingProfileType = (accounts: WalletAccount[] = []): void => {
    let accountType = null
    if (accounts.length) {
        switch (accounts[0]?.signerType?.type) {
            case 'Stronghold':
                accountType = ProfileType.Software
                break
            case 'LedgerNano':
                accountType = ProfileType.Ledger
                break
            case 'LedgerNanoSimulator':
                accountType = ProfileType.LedgerSimulator
                break
        }
    }
    if (accountType) {
        updateProfile('type', accountType)
    }
}

/**
 * Determines if the user has no existing profiles
 *
 * @method hasNoProfiles
 *
 * @returns {boolean}
 */
export const hasNoProfiles = (): boolean => get(profiles).length === 0
