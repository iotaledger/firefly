import { get } from 'svelte/store'

import { AppContext } from '@core/app/enums'
import { activeProfile, logout, profiles, removeProfile, removeProfileFolder } from '@core/profile'
import { routerManager } from '@core/router/stores'
import { removePersistedShimmerClaimingTransactions } from '@contexts/onboarding/stores'
import { destroyProfileManager } from '@core/profile-manager'

/**
 * It removes the active profile from the app's list of profiles, removes the profile's directory from
 * the file system, and logs the user out
 * @returns A Promise that resolves to void.
 */
export async function deleteProfile(): Promise<void> {
    try {
        const _activeProfile = get(activeProfile)
        if (!_activeProfile) {
            return
        }

        /**
         * CAUTION: Logout must occur before the profile is removed
         * from the Svelte store list of profiles.
         */
        logout(true, true)

        /**
         * CAUTION: The profile and its data must be removed from the
         * app's list of profiles that lives as a Svelte store.
         */
        removeProfile(_activeProfile?.id)
        removePersistedShimmerClaimingTransactions(_activeProfile?.id)

        /**
         * CAUTION: This removes the actual directory for the profile,
         * so it should occur last.
         */
        await removeProfileFolder(_activeProfile?.id)

        /**
         * NOTE: If there are no more profiles, then the user should be
         * routed to the welcome screen.
         */
        if (get(profiles).length === 0) {
            await destroyProfileManager()
            get(routerManager).goToAppContext(AppContext.Onboarding)
        }
    } catch (err) {
        console.error(err)
    }
}
