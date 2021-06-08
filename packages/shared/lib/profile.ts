import { AvailableExchangeRates } from 'shared/lib/currency'
import { persistent } from 'shared/lib/helpers'
import { generateRandomId } from 'shared/lib/utils'
import type { WalletAccount } from 'shared/lib/wallet'
import { destroyActor, getStoragePath, getWalletStoragePath } from 'shared/lib/wallet'
import { derived, get, Readable, writable } from 'svelte/store'
import type { ChartSelectors } from './chart'
import { Electron } from './electron'
import {
    HistoryDataProps
} from './marketData'
import type { Node } from './typings/client'

export interface MigratedTransaction {
    address: string;
    balance: number;
    timestamp: string
    account: number;
    tailTransactionHash: string;
}

/**
 * Profile
 */
export interface Profile {
    id: string
    name: string
    /**
     * Time for most recent stronghold back up
     */
    lastStrongholdBackupTime: Date | null
    /**
     * User settings
     */
    settings: UserSettings
    hiddenAccounts?: string[]
    migratedTransactions?: MigratedTransaction[]
    isDeveloperProfile: boolean
    gapLimit?: number
    profileType?: ProfileType
}

/**
 * User Settings
 */
export interface UserSettings {
    currency: AvailableExchangeRates
    automaticNodeSelection: boolean
    includeOfficialNodes: boolean
    disabledNodes: string[] | undefined
    /** Lock screen timeout in minutes */
    lockScreenTimeout: number
    showHiddenAccounts?: boolean
    chartSelectors: ChartSelectors
    hideNetworkStatistics?: boolean
}

/**
 * Profile types
 */
export enum ProfileType {
    Software = 'Software',
    Ledger = 'Ledger',
    LedgerSimulator = 'LedgerSimulator'
}

/**
 * Profile import types
 */
export enum ImportType {
    Seed = 'seed',
    Mnemonic = 'mnemonic',
    File = 'file',
    SeedVault = 'seedvault',
    Stronghold = 'stronghold',
    Ledger = 'ledger',
    TrinityLedger = 'trinityLedger',
    FireflyLedger = 'fireflyLedger',
}

export enum LedgerApp {
    Trinity = 'Trinity',
    Firefly = 'Firefly',
}

export const activeProfileId = writable<string | null>(null)

export const profiles = persistent<Profile[]>('profiles', [])

export const profileInProgress = persistent<string | undefined>('profileInProgress', undefined)

export const newProfile = writable<Profile | null>(null)

export const isStrongholdLocked = writable<boolean>(true)

// Dev flag to create simulator ledger profiles
export const ledgerSimulator = true

/**
 * Currently active profile
 */
export const activeProfile: Readable<Profile | undefined> = derived(
    [profiles, newProfile, activeProfileId],
    ([$profiles, $newProfile, $activeProfileId]) =>
        $newProfile ||
        $profiles.find((_profile) => {
            return _profile.id === $activeProfileId
        })
)

activeProfileId.subscribe((profileId) => {
    Electron.updateActiveProfile(profileId)
})

export const isSoftwareProfile: Readable<Boolean> = derived(activeProfile, $activeProfile => {
    return $activeProfile?.profileType === ProfileType.Software
})

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
    profiles.update((_profiles) => {
        return [..._profiles, profile]
    })

    return profile
}

/**
 * Creates a new profile
 *
 * @method createProfile
 *
 * @returns {Profile}
 */
export const createProfile = (profileName, isDeveloperProfile): Profile => {
    const profile: Profile = {
        id: generateRandomId(),
        name: profileName,
        lastStrongholdBackupTime: null,
        isDeveloperProfile,
        gapLimit: 10,
        settings: {
            currency: AvailableExchangeRates.USD,
            automaticNodeSelection: true,
            includeOfficialNodes: true,
            disabledNodes: undefined,
            lockScreenTimeout: 5,
            chartSelectors: {
                currency: AvailableExchangeRates.USD,
                timeframe: HistoryDataProps.SEVEN_DAYS
            }
        },
        profileType: null
    }

    newProfile.set(profile)
    activeProfileId.set(profile.id)

    return profile
}

/**
 * Disposes a new profile
 *
 * @method disposeNewProfile
 *
 * @returns {void}
 */
export const disposeNewProfile = async () => {
    const np = get(newProfile)
    if (np) {
        try {
            await removeProfileFolder(np.name)
        } catch (err) {
            console.error(err)
        }
        destroyActor(np.id)
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
    profiles.update((_profiles) => {
        return _profiles.filter((_profile) => _profile.id !== id)
    })
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
    path: string, value: string | string[] | boolean | Date | number | AvailableExchangeRates | Node | Node[] | ChartSelectors | HistoryDataProps | MigratedTransaction[]) => {
    const _update = (_profile) => {
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
        profiles.update((_profiles) => {
            return _profiles.map((_profile) => {
                if (_profile.id === get(activeProfile)?.id) {
                    return _update(_profile)
                }

                return _profile
            })
        })
    }
}

/**
 * Cleanup any in progress profiles
 *
 * @method cleanupInProgressProfiles
 *
 * @returns {void}
 */
export const cleanupInProgressProfiles = async () => {
    const inProgressProfile = get(profileInProgress)
    if (inProgressProfile) {
        profileInProgress.update(() => undefined)
        await removeProfileFolder(inProgressProfile)
    }
}

/**
 * Remove the profile folder from storage
 *
 * @method removeProfileFolder
 *
 * @returns {void}
 */
export const removeProfileFolder = async (profileName) => {
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
export const cleanupEmptyProfiles = async () => {
    try {
        const userDataPath = await Electron.getUserDataPath()
        const profileStoragePath = getWalletStoragePath(userDataPath)
        const storedProfiles = await Electron.listProfileFolders(profileStoragePath)

        profiles.update((_profiles) => {
            return _profiles.filter(p => storedProfiles.includes(p.name))
        })

        const appProfiles = get(profiles).map(p => p.name)
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
 * @param {ProfileType} profileType 
 * 
 * @returns {void}
 */
export const setProfileType = (profileType: ProfileType) => {
    if (ledgerSimulator && profileType === ProfileType.Ledger) {
        updateProfile('profileType', ProfileType.LedgerSimulator)
    }
    else {
        updateProfile('profileType', profileType)
    }
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
export const setMissingProfileType = (accounts: WalletAccount[] = []) => {
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
        updateProfile('profileType', accountType)
    }
}