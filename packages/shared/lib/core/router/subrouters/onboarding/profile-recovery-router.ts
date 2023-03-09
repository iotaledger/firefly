import { get, writable } from 'svelte/store'

import { onboardingProfile, ProfileRecoveryType } from '@contexts/onboarding'

import { Subrouter } from '../../classes'
import { ProfileRecoveryRoute } from '../../enums'
import { onboardingRouter } from '../../routers'
import { STRONGHOLD_VERSION } from '@core/stronghold'
import { UpdateStrongholdRouter, updateStrongholdRouter } from '../login/update-stronghold-router'

export const profileRecoveryRoute = writable<ProfileRecoveryRoute>(null)
export const profileRecoveryRouter = writable<ProfileRecoveryRouter>(null)

export class ProfileRecoveryRouter extends Subrouter<ProfileRecoveryRoute> {
    public importFile: Buffer

    constructor() {
        super(
            getInitialRoute() ?? ProfileRecoveryRoute.ImportMnemonicPhrase,
            profileRecoveryRoute,
            get(onboardingRouter)
        )
    }

    resetRoute(): void {
        profileRecoveryRoute.set(getInitialRoute() ?? ProfileRecoveryRoute.ImportMnemonicPhrase)
    }

    next(): void {
        let nextRoute: ProfileRecoveryRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ProfileRecoveryRoute.ImportMnemonicPhrase: {
                const _profileRecoveryType = get(onboardingProfile)?.recoveryType
                if (_profileRecoveryType === ProfileRecoveryType.Mnemonic) {
                    nextRoute = ProfileRecoveryRoute.Success
                }
                break
            }
            case ProfileRecoveryRoute.ImportStrongholdBackup: {
                const requiresUpdate =
                    get(onboardingProfile) && get(onboardingProfile)?.strongholdVersion !== STRONGHOLD_VERSION

                if (requiresUpdate) {
                    updateStrongholdRouter.set(new UpdateStrongholdRouter(this))

                    nextRoute = ProfileRecoveryRoute.UpdateStronghold
                } else {
                    nextRoute = ProfileRecoveryRoute.BackupPassword
                }
                break
            }
            case ProfileRecoveryRoute.BackupPassword:
            case ProfileRecoveryRoute.UpdateStronghold: {
                nextRoute = ProfileRecoveryRoute.Success
                break
            }
            case ProfileRecoveryRoute.LedgerImport: {
                // const _profileRecoveryType = get(onboardingProfile)?.recoveryType
                // this.parentRouter.next()
                break
            }
            case ProfileRecoveryRoute.Success:
                this.parentRouter.next()
                return
        }

        this.setNext(nextRoute)
    }
}

function getInitialRoute(): ProfileRecoveryRoute {
    switch (get(onboardingProfile)?.recoveryType) {
        case ProfileRecoveryType.Mnemonic:
            return ProfileRecoveryRoute.ImportMnemonicPhrase
        case ProfileRecoveryType.Stronghold:
            return ProfileRecoveryRoute.ImportStrongholdBackup
        case ProfileRecoveryType.Ledger:
            return ProfileRecoveryRoute.LedgerImport
    }
}
