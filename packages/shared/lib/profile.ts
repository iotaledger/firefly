import { derived, get, Readable, writable } from 'svelte/store'
import { _ } from 'svelte-i18n'
import { getTrimmedLength, persistent, validateFilenameChars } from 'shared/lib/helpers'
import { ledgerSimulator } from 'shared/lib/ledger'
import { generateRandomId, migrateObjects } from 'shared/lib/utils'
import { STRONGHOLD_VERSION } from 'shared/lib/stronghold'
import {
    asyncDeleteStorage,
    destroyActor,
    getProfileDataPath,
    getWalletDataPath,
    selectedAccountIdStore,
} from 'shared/lib/wallet'
import { Platform } from './platform'
import { AccountColor } from './typings/color'
import { ProfileType } from './typings/profile'
import { HistoryDataProps } from './typings/market'
import { AvailableExchangeRates } from './typings/currency'
import { getOfficialNetworkConfig } from './network'
import { NetworkConfig, NetworkType } from './typings/network'
import { ValuesOf } from './typings/utils'
import { Profile, UserSettings } from './typings/profile'
import { WalletAccount } from './typings/wallet'
import { Locale } from '@core/i18n'

const MAX_PROFILE_NAME_LENGTH = 20

export interface ProfileAccount {
    id: string
    color: string
}

export const activeProfileId = persistent<string | null>('activeProfileId', null)
export const profiles = persistent<Profile[]>('profiles', [])
export const profileInProgress = persistent<string | undefined>('profileInProgress', undefined)

export const newProfile = writable<Profile | null>(null)
export const isStrongholdLocked = writable<boolean>(true)
export const hasEverOpenedProfileModal = writable<boolean>(false)

export const activeProfile: Readable<Profile | undefined> = derived(
    [profiles, newProfile, activeProfileId],
    ([$profiles, $newProfile, $activeProfileId]) => $newProfile || $profiles.find((p) => p.id === $activeProfileId)
)

activeProfileId.subscribe((profileId) => {
    Platform.updateActiveProfile(profileId)
})

selectedAccountIdStore?.subscribe((accountId) => {
    if (accountId) {
        updateProfile('lastUsedAccountId', accountId)
    }
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
    strongholdVersion: STRONGHOLD_VERSION,
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
    accounts: [],
    hasFinishedSingleAccountGuide: true,
})

/**
 * Builds a new profile and sets Svelte store variables accordingly.
 *
 * @method storeProfile
 *
 * @param {string} profileName
 * @param {boolean} isDeveloperProfile
 *
 * @returns {Profile}
 */
export const storeProfile = (profileName: string, isDeveloperProfile: boolean): void => {
    const profile = buildProfile(profileName, isDeveloperProfile)

    newProfile.set(profile)
    activeProfileId.set(profile.id)
    profileInProgress.set(profileName)
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
    const profile = get(newProfile)
    if (profile) {
        try {
            await asyncDeleteStorage()
            await removeProfileFolder(profile.id)
        } catch (err) {
            console.error(err)
        }
        destroyActor(profile.id)
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
// TODO: refactor this: https://codewithstyle.info/Deep-property-access-in-TypeScript/
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
export const removeProfileFolder = async (id: string): Promise<void> => {
    try {
        const profileDataPath = await getProfileDataPath(id)
        await Platform.removeProfileFolder(profileDataPath)
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
        const profileDataPath = await getWalletDataPath()
        const storedProfiles = await Platform.listProfileFolders(profileDataPath)

        profiles.update((_profiles) => _profiles.filter((p) => storedProfiles.includes(p.id)))

        const appProfiles = get(profiles).map((p) => p.id)
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

/*
 * Maps accounts key values creating or updating existing objects with param profileAccount searching by account id
 *
 * @method getUpdatedAccounts
 *
 * @returns {ProfileAccount[]}
 */
const getUpdatedAccounts = (
    activeProfile: Profile,
    accountId: string,
    profileAccount: ProfileAccount
): ProfileAccount[] => {
    const { accounts } = activeProfile

    if (accounts?.length) {
        if (accounts?.find((account) => account.id === accountId)) {
            return accounts.map((account) => (account.id === accountId ? profileAccount : account))
        } else {
            return [...accounts, profileAccount]
        }
    }

    return [profileAccount]
}

/**
 * Sets profile account object color found by id inside profiles object
 *
 * @method setProfileAccount
 *
 * @returns {void}
 */
export const setProfileAccount = (activeProfile: Profile, profileAccount: ProfileAccount): void => {
    if (profileAccount.color) {
        updateProfile('accounts', getUpdatedAccounts(activeProfile, profileAccount.id, profileAccount))
    } else if (profileAccount.id) {
        const accountColors = Object.values(AccountColor).filter((_, i) => !(i % 2))
        const randomColor = accountColors[Math.floor(Math.random() * accountColors.length)].toString()
        updateProfile(
            'accounts',
            getUpdatedAccounts(activeProfile, profileAccount.id, { ...profileAccount, color: randomColor })
        )
    }
}

/**
 * Gets account color from activeProfile using account id
 *
 * @method getAccountColor
 *
 * @returns {string}
 */
export function getAccountColor(accountId: string): string | AccountColor {
    const _activeProfile = get(activeProfile)
    const accounts = _activeProfile?.accounts
    if (!accounts?.length && accountId) {
        setProfileAccount(_activeProfile, { id: accountId, color: '' })
    }
    return accounts?.find((account) => account.id === accountId)?.color ?? AccountColor.Blue
}

/**
 * Validates the trimmed profile name
 *
 * @method validateProfileName
 *
 * @param {string} trimmedName
 *
 * @returns {void}
 */
export const validateProfileName = (trimmedName: string): void => {
    const locale = get(_) as Locale
    const validateError = validateFilenameChars(trimmedName)

    if (validateError) {
        throw new Error(locale(`error.account.${validateError}`))
    }

    if (getTrimmedLength(trimmedName) > MAX_PROFILE_NAME_LENGTH) {
        throw new Error(
            locale('error.profile.length', {
                values: {
                    length: MAX_PROFILE_NAME_LENGTH,
                },
            })
        )
    }

    if (get(profiles).some((p) => p.name === trimmedName)) {
        throw new Error(locale('error.profile.duplicate'))
    }
}

async function renameProfileFolder(oldName: string, newName: string): Promise<void> {
    const oldPath = await getProfileDataPath(oldName)
    const newPath = await getProfileDataPath(newName)
    await Platform.renameProfileFolder(oldPath, newPath)
}

export async function renameOldProfileFoldersToId(): Promise<void> {
    const walletPath = await getWalletDataPath()
    const profileFolders = await Platform.listProfileFolders(walletPath)
    const oldProfiles = get(profiles).filter((profile) => profileFolders.find((p) => p === profile.name))

    if (oldProfiles.length > 0) {
        await Promise.all(
            oldProfiles.map(async (profile) => {
                await renameProfileFolder(profile.name, profile.id)
            })
        )
    }
}
