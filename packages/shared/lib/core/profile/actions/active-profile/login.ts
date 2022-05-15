import { activeProfile } from '../../stores'
import { LoginRouter } from '@core/router'
import { get } from 'svelte/store'
import { lastActiveAt, loggedIn } from '@lib/app'
import { loadAccounts } from './loadAccounts'

export function login(): void {
    const loginRouter = new LoginRouter()
    if (get(activeProfile).id) {
        void loadAccounts()
        loggedIn.set(true)
        lastActiveAt.set(new Date())
        loginRouter.next()
    }
}
