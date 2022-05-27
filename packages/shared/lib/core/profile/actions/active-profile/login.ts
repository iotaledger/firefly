import { activeProfile } from '../../stores'
import { get } from 'svelte/store'
import { loadAccounts } from './loadAccounts'
import { isStrongholdUnlocked } from '@core/profile-manager'
import { loadAllAccountActivities } from '@core/wallet'

export async function login(): Promise<void> {
    const { loggedIn, lastActiveAt, id, isStrongholdLocked } = get(activeProfile)
    if (id) {
        void loadAccounts()
        loggedIn.set(true)
        lastActiveAt.set(new Date())
        const response = await isStrongholdUnlocked()
        isStrongholdLocked.set(!response)
    }
}
