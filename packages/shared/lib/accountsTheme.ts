import { updateProfile } from 'shared/lib/profile'
import type { Profile, ProfileAccount } from 'shared/lib/typings/profile'

/**
 * Sets account element color and pattern for accounts key inside profiles object
 *
 * @method setAccountTheme
 *
 * @returns {void}
 */
export const setAccountTheme = (activeProfile: Profile, profileAccount: ProfileAccount): void => {
    const { accounts } = activeProfile
    const { id, color, pattern } = profileAccount

    const updatedAccounts = () => {
        if (accounts?.length) {
            return accounts.map(account => account.id === id ? { ...account, color, pattern } : account)
        }
        return [profileAccount]
    }

    updateProfile('accounts', updatedAccounts())
}
