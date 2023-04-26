import { Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import { restoreProfileRouter } from '../restore-profile/restore-profile-router'
import { RestoreFromMnemonicRoute } from './restore-from-mnemonic-route.enum'

export const restoreFromMnemonicRoute = writable<RestoreFromMnemonicRoute>(undefined)
export const restoreFromMnemonicRouter = writable<RestoreFromMnemonicRouter>(undefined)

export class RestoreFromMnemonicRouter extends Subrouter<RestoreFromMnemonicRoute> {
    constructor() {
        super(RestoreFromMnemonicRoute.InputMnemonic, restoreFromMnemonicRoute, get(restoreProfileRouter))
    }

    next(): void {
        let nextRoute: RestoreFromMnemonicRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case RestoreFromMnemonicRoute.InputMnemonic:
                nextRoute = RestoreFromMnemonicRoute.EncryptMnemonic
                break
            case RestoreFromMnemonicRoute.EncryptMnemonic:
                this.parentRouter.next()
                return
        }

        this.setNext(nextRoute)
    }
}
