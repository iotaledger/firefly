import { Router, Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import { CreateFromMnemonicRoute } from './create-from-mnemonic-route.enum'

export const createFromMnemonicRoute = writable<CreateFromMnemonicRoute>(undefined)
export const createFromMnemonicRouter = writable<CreateFromMnemonicRouter>(undefined)

export class CreateFromMnemonicRouter extends Subrouter<CreateFromMnemonicRoute> {
    constructor(parentRouter: Router<unknown>) {
        super(CreateFromMnemonicRoute.ViewMnemonic, createFromMnemonicRoute, parentRouter)
    }

    next(): void {
        let nextRoute: CreateFromMnemonicRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case CreateFromMnemonicRoute.ViewMnemonic:
                nextRoute = CreateFromMnemonicRoute.VerifyMnemonic
                break
            case CreateFromMnemonicRoute.VerifyMnemonic:
                nextRoute = CreateFromMnemonicRoute.EncryptMnemonic
                break
            case CreateFromMnemonicRoute.EncryptMnemonic:
                this.parentRouter.next()
                return
        }

        this.setNext(nextRoute)
    }
}
