import { get, writable } from 'svelte/store'

import { mnemonic } from '@lib/app'
import { Platform } from '@lib/platform'
import { activeProfile } from '@lib/profile'
import { SetupType } from '@lib/typings/setup'
import {
    asyncCreateAccount,
    asyncSetStoragePassword,
    asyncStoreMnemonic,
    asyncVerifyMnemonic,
    walletSetupType,
} from '@lib/wallet'

import { appRouter } from '../app-router'
import { ProtectRoute } from '../enums'
import { Subrouter } from './subrouter'
import { FireflyEvent } from '../types'

export const protectRoute = writable<ProtectRoute>(null)

export class ProtectRouter extends Subrouter<ProtectRoute> {
    constructor() {
        super(ProtectRoute.Pin, protectRoute)
    }

    public pin: string

    async next(event: FireflyEvent): Promise<void> {
        let nextRoute: ProtectRoute
        const { pin, protectionType } = event || {}

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ProtectRoute.Init:
                if (protectionType === 'pin') {
                    nextRoute = ProtectRoute.Pin
                } else if (protectionType === 'biometric') {
                    nextRoute = ProtectRoute.Biometric
                }
                break
            case ProtectRoute.Pin:
                this.pin = pin
                nextRoute = ProtectRoute.RepeatPin
                break
            case ProtectRoute.RepeatPin: {
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
        this.setNext(nextRoute)
    }
}
