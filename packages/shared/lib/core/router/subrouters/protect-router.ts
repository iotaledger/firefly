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

import { ProtectRoutes } from '../enums'
import { Subrouter } from '../subrouters'
import { FireflyEvent } from '../types'
import { appRouter } from '../app-router'

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
        this.setNext(nextRoute)
    }
}
