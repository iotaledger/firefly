import { IProfile } from '@core/profile'
import { AccountColors } from 'shared/lib/wallet'
import { get } from 'svelte/store'

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
