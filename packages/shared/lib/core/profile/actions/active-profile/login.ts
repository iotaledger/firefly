import { getAndUpdateNodeInfo } from '@core/network'
import { isStrongholdUnlocked } from '@core/profile-manager'
import {
    setStrongholdPasswordClearInterval,
    startBackgroundSync,
    subscribe as subscribeToWalletEvents,
} from '@core/profile-manager/api'
import { get } from 'svelte/store'
import {
    INITIAL_ACCOUNT_GAP_LIMIT,
    INITIAL_ADDRESS_GAP_LIMIT,
    STRONGHOLD_PASSWORD_CLEAR_INTERVAL,
} from '../../constants'
import { activeProfile, setTimeStrongholdLastUnlocked } from '../../stores'
import { loadAccounts } from './loadAccounts'
import { recoverAndLoadAccounts } from './recoverAndLoadAccounts'

export async function login(firstTime: boolean = false): Promise<void> {
    const { loggedIn, lastActiveAt, id, isStrongholdLocked, type } = get(activeProfile)
    if (id) {
        loggedIn.set(true)
        await getAndUpdateNodeInfo()

        if (firstTime) {
            void recoverAndLoadAccounts(INITIAL_ACCOUNT_GAP_LIMIT[type], INITIAL_ADDRESS_GAP_LIMIT[type])
        } else {
            void loadAccounts()
        }

        loggedIn.set(true)
        lastActiveAt.set(new Date())

        const strongholdUnlocked = await isStrongholdUnlocked()
        isStrongholdLocked.set(!strongholdUnlocked)
        setStrongholdPasswordClearInterval(STRONGHOLD_PASSWORD_CLEAR_INTERVAL)
        if (strongholdUnlocked) {
            setTimeStrongholdLastUnlocked()
        }

        void startBackgroundSync()

        // enable listeners
        subscribeToWalletEvents()
    }
}
