import { Router, Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import { RestoreFromMnemonicRoute } from './restore-from-mnemonic-route.enum'

export const restoreFromMnemonicRoute = writable<RestoreFromMnemonicRoute>(undefined)
export const restoreFromMnemonicRouter = writable<RestoreFromMnemonicRouter>(undefined)

export class RestoreFromMnemonicRouter extends Subrouter<RestoreFromMnemonicRoute> {
    constructor(parentRouter: Router<unknown>) {
        super(RestoreFromMnemonicRoute.InputMnemonic, restoreFromMnemonicRoute, parentRouter)
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
