import { get } from 'svelte/store'
import {
    INITIAL_ACCOUNT_GAP_LIMIT,
    INITIAL_ADDRESS_GAP_LIMIT,
    STRONGHOLD_PASSWORD_CLEAR_INTERVAL,
} from '../../constants'
import { activeProfile, setTimeStrongholdLastUnlocked } from '../../stores'
import { loadAccounts } from './loadAccounts'
import { isStrongholdUnlocked } from '@core/profile-manager'
import { profileManager } from '@core/profile-manager/stores'
import { setStrongholdPasswordClearInterval, subscribe as subscribeToWalletEvents } from '@core/profile-manager/api'
import { recoverAndLoadAccounts } from './recoverAndLoadAccounts'

export async function login(firstTime: boolean = false): Promise<void> {
    const { loggedIn, lastActiveAt, id, isStrongholdLocked, type } = get(activeProfile)
    if (id) {
        if (firstTime) {
            void recoverAndLoadAccounts(INITIAL_ACCOUNT_GAP_LIMIT[type], INITIAL_ADDRESS_GAP_LIMIT[type])
        } else {
            void loadAccounts()
        }
        loggedIn.set(true)
        lastActiveAt.set(new Date())
        const strongholdLocked = await isStrongholdUnlocked()
        if (!strongholdLocked) {
            isStrongholdLocked.set(!strongholdLocked)
            setTimeStrongholdLastUnlocked()
        }
        setStrongholdPasswordClearInterval(STRONGHOLD_PASSWORD_CLEAR_INTERVAL)

        const manager = get(profileManager)

        // start background sync
        manager.startBackgroundSync()

        // enable listeners
        subscribeToWalletEvents()
    }
}
