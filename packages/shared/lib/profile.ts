import { get } from 'svelte/store'
import { _ } from 'svelte-i18n'
import { getTrimmedLength, validateFilenameChars } from 'shared/lib/helpers'
import { ledgerSimulator } from 'shared/lib/ledger'
import { generateRandomId, migrateObjects } from 'shared/lib/utils'
import {
    asyncDeleteStorage,
    destroyManager,
    getProfileDataPath,
    getWalletDataPath,
    AccountColors,
} from 'shared/lib/wallet'
import { Platform } from './platform'
import {
    ProfileType,
    IPersistedProfile,
    IProfileSettings,
    activeProfile,
    IProfile,
    profiles,
    activeProfileId,
    MAX_PROFILE_NAME_LENGTH,
    newProfile,
} from '@core/profile'
import { HistoryDataProps } from './typings/market'
import { getOfficialNetworkConfig, INetworkConfig, NetworkProtocol, NetworkType } from '@core/network'
import { ValuesOf } from './typings/utils'
import { WalletAccount } from './typings/walletAccount'
import { Locale } from '@core/i18n'
import { AvailableExchangeRates } from './typings/currency'
import { buildNewProfile } from '@core/profile/helpers'

// TODO move this somewhere else?
// activeProfileId?.subscribe((profileId) => {
//     Platform.updateActiveProfile(profileId)
// })

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
    const newProfile = buildNewProfile(
        oldProfile.name,
        oldProfile.isDeveloperProfile,
        oldProfile.networkProtocol,
        oldProfile.networkType
    )

    updateProfile('', migrateObjects<IPersistedProfile>(oldProfile, newProfile))
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
    value: ValuesOf<IPersistedProfile> | ValuesOf<IProfileSettings> | ValuesOf<INetworkConfig>
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

        pathList.reduce((a, b: keyof IPersistedProfile | keyof IProfileSettings, level: number) => {
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

/*
 * Maps accounts key values creating or updating existing objects with param profileAccount searching by account id
 *
 * @method getUpdatedAccounts
 *
 * @returns {ProfileAccount[]}
 */
// function getUpdatedAccounts(
//     activeProfile: IPersistedProfile,
//     accountId: string,
//     profileAccount: ProfileAccount
// ): ProfileAccount[] {
//     // const { accounts } = activeProfile

//     // if (accounts?.length) {
//     //     if (accounts?.find((account) => account.id === accountId)) {
//     //         return accounts.map((account) => (account.id === accountId ? profileAccount : account))
//     //     } else {
//     //         return [...accounts, profileAccount]
//     //     }
//     // }

//     return [profileAccount]
// }

// /**
//  * Sets profile account object color found by id inside profiles object
//  *
//  * @method setProfileAccount
//  *
//  * @returns {void}
//  */
// export const setProfileAccount = (activeProfile: IPersistedProfile, profileAccount: ProfileAccount): void => {
//     if (profileAccount.color) {
//         updateProfile('accounts', getUpdatedAccounts(activeProfile, profileAccount.id, profileAccount))
//     } else if (profileAccount.id) {
//         const accountColors = Object.values(AccountColors).filter((_, i) => !(i % 2))
//         const randomColor = accountColors[Math.floor(Math.random() * accountColors.length)].toString()
//         updateProfile(
//             'accounts',
//             getUpdatedAccounts(activeProfile, profileAccount.id, { ...profileAccount, color: randomColor })
//         )
//     }
// }

/**
 * Gets account color from activeProfile using account id
 *
 * @method getColor
 *
 * @returns {string}
 */
export const getColor = (activeProfile: IProfile, accountId: string): string | AccountColors => {
    const { accounts } = activeProfile || {}
    const _accounts = get(accounts)

    if (_accounts?.length) {
        const foundAccountColor = _accounts.find((account) => account.id === accountId)?.color
        if (foundAccountColor) return foundAccountColor
    }
}
