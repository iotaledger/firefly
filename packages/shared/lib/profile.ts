import { activeProfile, IPersistedProfile, IProfile, ProfileType, updateActiveProfile } from '@core/profile'
import { buildNewProfile } from '@core/profile/helpers'
import { migrateObjects } from 'shared/lib/utils'
import { AccountColors } from 'shared/lib/wallet'
import { get } from 'svelte/store'
import { WalletAccount } from './typings/walletAccount'

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

    updateActiveProfile(migrateObjects<IPersistedProfile>(oldProfile, newProfile))
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
// export const updateProfile = (
//     path: string,
//     value: ValuesOf<IPersistedProfile> | ValuesOf<IProfileSettings> | ValuesOf<INetworkConfig>
// ): void => {
//     const _update = (_profile) => {
//         if (path === '') {
//             const isValidData =
//                 /* eslint-disable no-prototype-builtins */
//                 typeof value === 'object' && Object.keys(value).filter((k) => !_profile.hasOwnProperty(k)).length === 0
//             /* eslint-disable @typescript-eslint/ban-types */
//             return isValidData ? { ..._profile, ...(value as object) } : _profile
//         }

//         const pathList = path.split('.')

//         pathList.reduce((a, b: keyof IPersistedProfile | keyof IProfileSettings, level: number) => {
//             if (level === pathList.length - 1) {
//                 a[b] = value
//                 return value
//             }
//             return a[b]
//         }, _profile)

//         return _profile
//     }

//     if (get(newProfile)) {
//         newProfile.update((_profile) => _update(_profile))
//     } else {
//         profiles.update((_profiles) =>
//             _profiles.map((_profile) => {
//                 if (_profile.id === get(activeProfile)?.id) {
//                     return _update(_profile)
//                 }

//                 return _profile
//             })
//         )
//     }
// }

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
    let accountType: ProfileType
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
        updateActiveProfile({ type: accountType })
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
