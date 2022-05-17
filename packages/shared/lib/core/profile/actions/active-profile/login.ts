import { activeProfile } from '../../stores'
import { LoginRouter } from '@core/router'
import { get } from 'svelte/store'
import { loadAccounts } from './loadAccounts'
import { setSelectedAccount } from '@core/account'

export function login(): void {
    const loginRouter = new LoginRouter()
    const { loggedIn, lastActiveAt, id } = get(activeProfile)
    if (id) {
        void loadAccounts()
        loggedIn.set(true)
        lastActiveAt.set(new Date())
        loginRouter.next()
    }
}
