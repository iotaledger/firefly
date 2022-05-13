import { newProfile } from '@core/profile'
import { storeMnemonic, verifyMnemonic } from '@core/profile-manager'
import { mnemonic } from '@lib/app'
import { Platform } from '@lib/platform'
import { SetupType } from '@lib/typings/setup'
import { createAccount, walletSetupType } from '@lib/wallet'
import { get, writable } from 'svelte/store'
import { appRouter } from '../app-router'
import { ProtectRoute } from '../enums'
import { FireflyEvent } from '../types'
import { Subrouter } from './subrouter'

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
                await Platform.PincodeManager.set(get(newProfile)?.id, this.pin)
                // TODO: replace with new api when it is implemented
                // await setStoragePassword(this.pin)
                if (get(walletSetupType) === SetupType.Mnemonic) {
                    const m = get(mnemonic).join(' ')
                    await verifyMnemonic(m)
                    await storeMnemonic(m)
                    await createAccount()
                    mnemonic.set(null)
                }

                get(appRouter).next(event)
                break
            }
        }
        this.setNext(nextRoute)
    }
}
