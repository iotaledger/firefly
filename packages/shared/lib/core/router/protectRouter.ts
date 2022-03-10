import { get, writable } from 'svelte/store'
import { appRouter, ProtectRoutes } from '@core/router'
import { Router } from '@core/router/router'
import { FireflyEvent } from '@core/router/typings/event'
import { mnemonic } from 'shared/lib/app'
import { Platform } from 'shared/lib/platform'
import { activeProfile } from 'shared/lib/profile'
import { SetupType } from 'shared/lib/typings/setup'
import { validatePinFormat } from 'shared/lib/utils'
import {
    asyncCreateAccount,
    asyncSetStoragePassword,
    asyncStoreMnemonic,
    asyncVerifyMnemonic,
    walletSetupType,
} from 'shared/lib/wallet'

export const protectRoute = writable<ProtectRoutes>(null)

export class ProtectRouter extends Router<ProtectRoutes> {
    constructor() {
        super(ProtectRoutes.Init, protectRoute)
    }

    async next(event: FireflyEvent): Promise<void> {
        let nextRoute: ProtectRoutes
        const { pin, protectionType } = event

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
                nextRoute = ProtectRoutes.RepeatPin
                break
            case ProtectRoutes.RepeatPin: {
                const pinString = pin.toString()
                if (!validatePinFormat(pinString)) {
                    throw new Error('Invalid pin code!')
                }

                await Platform.PincodeManager.set(get(activeProfile)?.id, pinString)
                await asyncSetStoragePassword(pinString)

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

    previous(): void {
        if (this.history.length === 0) {
            get(appRouter).previous()
        } else {
            super.previous()
        }
    }
}
