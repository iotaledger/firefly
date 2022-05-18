import { activeProfile } from '../../stores'
import { get } from 'svelte/store'
import { loadAccounts } from './loadAccounts'

export function login(): void {
    const { loggedIn, lastActiveAt, id } = get(activeProfile)
    if (id) {
        void loadAccounts()
        loggedIn.set(true)
        lastActiveAt.set(new Date())
    }
}
