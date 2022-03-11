import { get, writable } from 'svelte/store'
import { appRouter, ProtectRoutes } from '@core/router'
import { FireflyEvent } from '@core/router/typings/event'
import { mnemonic } from 'shared/lib/app'
import { Platform } from 'shared/lib/platform'
import { activeProfile } from 'shared/lib/profile'
import { SetupType } from 'shared/lib/typings/setup'
import {
    asyncCreateAccount,
    asyncSetStoragePassword,
    asyncStoreMnemonic,
    asyncVerifyMnemonic,
    walletSetupType,
} from 'shared/lib/wallet'
import { Subrouter } from '@core/router/subrouters/subrouter'

export const protectRoute = writable<ProtectRoutes>(null)

export class ProtectRouter extends Subrouter<ProtectRoutes> {
    constructor() {
        super(ProtectRoutes.Pin, protectRoute)
    }

    public pin: string

    async next(event: FireflyEvent): Promise<void> {
        let nextRoute: ProtectRoutes
        const { pin, protectionType } = event || {}

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ProtectRoutes.Init:
                if (protectionType === 'pin') {
                    nextRoute = ProtectRoutes.Pin
                } else if (protectionType === 'biometric') {
                    nextRoute = ProtectRoutes.Biometric
                }
                break
            case ProtectRoutes.Pin:
                this.pin = pin
                nextRoute = ProtectRoutes.RepeatPin
                break
            case ProtectRoutes.RepeatPin: {
                await Platform.PincodeManager.set(get(activeProfile)?.id, this.pin)
                await asyncSetStoragePassword(this.pin)

                if (get(walletSetupType) === SetupType.Mnemonic) {
                    const m = get(mnemonic).join(' ')
                    await asyncVerifyMnemonic(m)
                    await asyncStoreMnemonic(m)
                    await asyncCreateAccount()
                    mnemonic.set(null)
                }

                get(appRouter).next(event)
                break
            }
        }
        if (nextRoute) {
            this.setNext(nextRoute)
        }
    }
}
