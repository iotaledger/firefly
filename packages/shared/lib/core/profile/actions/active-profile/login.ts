import { isStrongholdUnlocked } from '@core/profile-manager'
import { get } from 'svelte/store'
import { INITIAL_ACCOUNT_GAP_LIMIT, INITIAL_ADDRESS_GAP_LIMIT } from '../../constants'
import { activeProfile } from '../../stores'
import { loadAccounts } from './loadAccounts'
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
        const response = await isStrongholdUnlocked()
        isStrongholdLocked.set(!response)
    }
}
