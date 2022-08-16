import { get } from 'svelte/store'

import { getAndUpdateNodeInfo } from '@core/network'
import { isStrongholdUnlocked } from '@core/profile-manager'
import { startBackgroundSync, subscribe as subscribeToWalletEvents } from '@core/profile-manager/api'

import { INITIAL_ACCOUNT_GAP_LIMIT, INITIAL_ADDRESS_GAP_LIMIT } from '../../constants'
import { activeProfile, setTimeStrongholdLastUnlocked } from '../../stores'
import { loadProfile } from './loadProfile'
import { recoverAndLoadProfile } from './recoverAndLoadProfile'
import { ProfileType } from '@core/profile/enums'

export async function login(recoverAccounts?: boolean): Promise<void> {
    const { loggedIn, lastActiveAt, id, isStrongholdLocked, type } = get(activeProfile)
    if (id) {
        loggedIn.set(true)

        // Step 1: get node info to check we have a synced node
        await getAndUpdateNodeInfo()

        // Step 2: load and build all the profile data
        if (recoverAccounts) {
            void recoverAndLoadProfile(INITIAL_ACCOUNT_GAP_LIMIT[type], INITIAL_ADDRESS_GAP_LIMIT[type])
        } else {
            void loadProfile()
        }

        lastActiveAt.set(new Date())

        if (type === ProfileType.Software) {
            // Step 3: set initial stronghold status
            const strongholdUnlocked = await isStrongholdUnlocked()
            isStrongholdLocked.set(!strongholdUnlocked)
            // TODO: enable once https://github.com/iotaledger/firefly/issues/3693 is resolved
            // setStrongholdPasswordClearInterval(STRONGHOLD_PASSWORD_CLEAR_INTERVAL)
            if (strongholdUnlocked) {
                setTimeStrongholdLastUnlocked()
            }
        }

        // Step 4: sync wallet
        subscribeToWalletEvents()
        void startBackgroundSync({ syncIncomingTransactions: true })
    }
}
