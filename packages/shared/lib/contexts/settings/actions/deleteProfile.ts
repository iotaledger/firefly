import { get } from 'svelte/store'

import { localize } from '@core/i18n'
import { showAppNotification } from '@lib/notifications'
import {
    activeProfile,
    isSoftwareProfile,
    lockStronghold,
    logout,
    profiles,
    removeProfile,
    removeProfileFolder,
} from '@core/profile'
import { deleteAccountsAndDatabase } from '@core/profile-manager'
import { appRouter } from '@core/router'
import { removePersistedShimmerClaimingTransactions } from '@contexts/onboarding/stores'

/**
 * Deletes the currently active profile.
 */
export async function deleteProfile(): Promise<void> {
    try {
        const _activeProfile = get(activeProfile)
        if (!_activeProfile) {
            return
        }

        const shouldLockStronghold = get(isSoftwareProfile) && !_activeProfile.isStrongholdLocked
        if (shouldLockStronghold) {
            await lockStronghold()
        }

        /**
         * CAUTION: The storage for wallet.rs must also be deleted in order
         * to free the locks on the files within the profile folder (removed
         * later).
         */
        await deleteAccountsAndDatabase()

        /**
         * CAUTION: This removes the actual directory for the profile,
         * so it should occur last.
         */
        await removeProfileFolder(_activeProfile?.id)

        /**
         * CAUTION: Logout must occur before the profile is removed
         * from the Svelte store list of profiles.
         */
        await logout(true, false)

        /**
         * CAUTION: The profile and its data must be removed from the
         * app's list of profiles that lives as a Svelte store.
         */
        removeProfile(_activeProfile?.id)
        removePersistedShimmerClaimingTransactions(_activeProfile?.id)

        /**
         * NOTE: If there are no more profiles then the user should be
         * routed to the welcome screen.
         */
        if (get(profiles).length === 0) {
            get(appRouter).reset()
        }
    } catch (err) {
        const isAccountNotEmptyError = err?.type === 'AccountNotEmpty'
        showAppNotification({
            type: 'error',
            message: localize(`error.${isAccountNotEmptyError ? 'profile.delete.nonEmptyAccounts' : 'global.generic'}`),
        })
    }
}
